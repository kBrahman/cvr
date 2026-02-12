import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { generateWithFallback } from "@/lib/gemini";

// Initialize Gemini client properly inside the handler or globally if key exists
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Mock response if no API key
    if (!apiKey || !genAI) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(NextResponse.json({
            score: Math.floor(Math.random() * 30) + 40,
            summary: "Oh wow. I see you uploaded a resume but didn't pay the API bill (GEMINI_API_KEY missing). This resume is so empty it matches my API credentials.",
            weaknesses: [
              "Missing API Key",
              "Deployment not configured correctly",
              "You are broke"
            ],
            improvements: [
              "Add GEMINI_API_KEY to .env.local",
              "Check Google AI Studio for keys",
              "Try again"
            ]
          }));
        }, 1500);
      });
    }

    let promptParts: any[] = [];
    let resumeText = "";
    let base64Image = "";

    const systemPrompt = `You are a brutal, sarcastic, but highly knowledgeable senior recruiter. Your job is to 'roast' resumes.
    
    Current Date: ${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}.
    
    Analyze the user's resume and provide a structured JSON response.
    
    Tone: Harsh, funny, witty, but ultimately helpful.
    
    Output JSON format ONLY (no markdown backticks):
    {
      "score": number (0-100),
      "summary": "A 2-3 sentence brutal summary of the resume.",
      "weaknesses": ["Point 1", "Point 2", "Point 3"],
      "improvements": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"],
      "extracted_text": "Full text extracted from the resume (required for images)",
      "face_box": [ymin, xmin, ymax, xmax] // normalized 0-1000 coordinates of the candidate's face photo, or null
    }`;

    // Prepare content for Gemini
    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Parse PDF Text
      // @ts-ignore
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");
      const data = await pdfParse(buffer);
      resumeText = data.text;
      
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Parse DOCX Text using mammoth
      // @ts-ignore
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value;

    } else if (file.type === "text/plain") {
      resumeText = await file.text();
    } else if (
      file.type === "application/rtf" || 
      file.type === "text/rtf" || 
      file.type === "application/x-rtf" ||
      file.type === "text/richtext" ||
      (file.name.toLowerCase().endsWith(".rtf"))
    ) {
      const rawRtf = await file.text();
      
      // For large RTF files (>500KB), skip the parser and use regex to avoid OOM/Timeouts
      // 1.6MB is too large for the synchronous rtf-parser in this context
      if (file.size > 500 * 1024) {
          console.log("RTF file too large for parser, using regex fallback.");
          resumeText = rawRtf
            .replace(/\\par[d]?\s*/g, "\n")
            .replace(/\\line\s*/g, "\n")
            .replace(/\\row\s*/g, "\n")
            .replace(/\\'([0-9a-fA-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
            .replace(/\\u([0-9]+)\?/g, (match, code) => String.fromCharCode(parseInt(code))) // Unicode
            .replace(/[{}]/g, "")
            .replace(/\\[a-z]+\d* ?/g, "")
            .split('\n').filter(line => line.trim().length > 0).join('\n')
            .trim();
      } else {
          try {
              // Parse RTF
              // @ts-ignore
              const rtfParser = require("rtf-parser");
              resumeText = await new Promise((resolve, reject) => {
                rtfParser.string(rawRtf, (err: any, doc: any) => {
                  if (err) reject(err);
                  else {
                     // Helper to extract text from AST
                     const extractText = (node: any): string => {
                        if (Array.isArray(node)) return node.map(extractText).join("");
                        if (node.text) return node.text;
                        if (node.content) return extractText(node.content);
                        return "";
                     };
                     resolve(extractText(doc.content || []));
                  }
                });
              });
          } catch (e) {
              console.warn("RTF structued parser failed (likely encoding issue), switching to Regex fallback.");
              // Fallback: Robust Regex strip
              resumeText = rawRtf
                .replace(/\\par[d]?\s*/g, "\n") // Paragraphs
                .replace(/\\line\s*/g, "\n")    // Line breaks
                .replace(/\\row\s*/g, "\n")     // Table rows
                .replace(/\\'([0-9a-fA-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16))) // Decode Hex
                .replace(/\\u([0-9]+)\?/g, (match, code) => String.fromCharCode(parseInt(code))) // Unicode
                .replace(/[{}]/g, "")           // Remove braces
                .replace(/\\[a-z]+\d* ?/g, "")  // Remove control words
                .split('\n').filter(line => line.trim().length > 0).join('\n') // Clean empty lines
                .trim();
          }
      }
    } else if (file.type === "application/vnd.oasis.opendocument.text") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      try {
        // Parse ODT using adm-zip to read content.xml
        // @ts-ignore
        const AdmZip = require("adm-zip");
        const zip = new AdmZip(buffer);
        let contentXml = zip.readAsText("content.xml");
        
        // Simple XML to Text conversion for ODT
        // 1. Replace paragraphs with newlines
        contentXml = contentXml.replace(/<text:p[^>]*>/g, "\n");
        // 2. Remove all tags
        resumeText = contentXml.replace(/<[^>]+>/g, " ").trim();
        // 3. Simple entity decode (Gemini handles most, but good to be clean)
        resumeText = resumeText
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
            
      } catch (e) {
        console.error("ODT parsing failed:", e);
        return NextResponse.json({ error: "Failed to parse ODT file." }, { status: 400 });
      }

    } else if (file.type.startsWith("image/")) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Image = buffer.toString("base64");
    } else {
      return NextResponse.json({ error: "Unsupported file type. Supported types are PDF, DOCX, ODT, TXT, RTF, and common image formats." }, { status: 400 });
    }
    
    // Construct Prompt based on whether we have text or image
    if (resumeText) {
      promptParts = [
        systemPrompt,
        "Here is the resume text (Note: This may be raw extracted text, PDF content, or raw RTF/DOCX code. If it is RTF or markup-heavy, ignore the tags/formatting and focus ONLY on the human-readable content within):",
        resumeText.substring(0, 20000) // Gemini has large context context, but let's be safe
      ];
    } else if (base64Image) { // Use the stored base64Image
      promptParts = [
        systemPrompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: file.type
          }
        },
        "Roast this resume image. CRITICAL: You must also extract all readable text from the image and include it in the JSON output as 'extracted_text'. ALSO: Detect the candidate's profile photo face bounding box. Return it as 'face_box': [ymin, xmin, ymax, xmax] using 0-1000 normalized coordinates. If no photo is found, set face_box to null."
      ];
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    // Validate extracted text
    if (!resumeText && !base64Image) {
        return NextResponse.json({ error: "Could not extract any text from this file. Please try a different format (PDF/DOCX) or copy-paste the content." }, { status: 400 });
    }

    // Call Gemini API with Fallback
    // This utilizes the same robust logic as the fix route (Primary -> Legacy -> List -> Best Available)
    let text = await generateWithFallback(genAI, promptParts);
    
    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const jsonResponse = JSON.parse(text);
    
    // Use extracted text from Gemini if valid (for images)
    if (!resumeText && jsonResponse.extracted_text) {
        resumeText = jsonResponse.extracted_text;
    }

    // Track usage
    try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.from('usage_events').insert({ event_type: 'roast' });
    } catch (e) {
        console.error("Tracking error:", e);
    }
    
    return NextResponse.json({ ...jsonResponse, resumeText });

  } catch (error) {
    console.error("Error roasting resume:", error);
    return NextResponse.json(
      { error: "Failed to roast resume. Try again later." },
      { status: 500 }
    );
  }
}
