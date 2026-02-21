
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateWithFallback } from "@/lib/gemini";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    const { resumeText, weaknesses, improvements, summary } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
    }

    if (!apiKey || !genAI) {
      // Mock response
      // Mock response
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({
          fixedContent: {
            "header": {
                "name": "[Your Name]",
                "title": "Senior Professional",
                "contact": "555-0123 | email@example.com | San Francisco, CA"
            },
            "summary": "Highly motivated and results-oriented professional with a proven track record of success. (This is a mock rewrite because the API key is missing).",
            "skills": ["Python", "JavaScript", "React", "Next.js", "Leadership"],
            "experience": [
                {
                    "role": "Senior Developer",
                    "company": "Tech Corp",
                    "period": "2020 - Present",
                    "achievements": ["Led a team of 5 developers", "Increased system efficiency by 20%"]
                }
            ],
            "education": [
                {
                    "degree": "B.S. Computer Science",
                    "school": "University of Tech",
                    "year": "2018"
                }
            ],
            "projects": []
          }
      });
    }

    const prompt = `
    You are an expert professional resume writer and career coach.
    
    Current Date: ${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}.
    
    Rewrite the user's resume content to be highly professional, impactful, and ATS-friendly.
    
    Target Audience: Recruiters and Hiring Managers.
    Tone: Professional, confident, concise.
    
    Structure the output as a strictly valid JSON object with the following schema:
    {
      "header": {
        "name": "Full Name",
        "title": "Professional Title",
        "contact": "Phone | Email 1 | Email 2 | Location",
        "links": [ // EXTRACT Personal/Portfolio Websites, GitHub, StackOverflow, LinkedIn, Kaggle.
          { "platform": "Personal Website", "url": "http://..." },
          { "platform": "GitHub", "url": "https://github.com/..." }
        ]
      },
      "languages": ["Language 1", "Language 2"], // Extract languages if present
      "summary": "2-3 sentence powerful professional summary.",
      "skills": ["Skill 1", "Skill 2", "Skill 3", ...],
      "experience": [
        {
          "role": "Job Title",
          "company": "Company Name",
          "period": "Dates",
          "achievements": ["Strong action verb + result", "Achievement 2", ...],
          "links": ["https://play.google.com/store/...", "https://apps.apple.com/..."] // ONLY if present
        }
      ],
      "education": [ // Return [] if NO education is mentioned in source
        {
          "degree": "Degree Name",
          "school": "University Name",
          "year": "Year"
        }
      ],
      "projects": [ // VERY IMPORTANT: Only extract if there is an explicit 'Projects' section in the source. Otherwise return [].
        {
          "name": "Project Name",
          "description": "Brief description of technologies and impact."
        }
      ]
    }

    CONTEXT FOR IMPROVEMENT:
    The user's resume has been critiqued with the following feedback. You MUST address these points in your rewrite:
    
    WEAKNESSES IDENTIFIED:
    ${weaknesses ? JSON.stringify(weaknesses, null, 2) : "None identified."}

    ACTIONABLE FIXES TO IMPLEMENT:
    ${improvements ? JSON.stringify(improvements, null, 2) : "General professional polish."}
    
    SUMMARY OF CRITIQUE:
    ${summary || "No summary provided."}

    Original Resume Text:
    ${resumeText.substring(0, 25000)}

    IMPORTANT: 
    - Fix all grammar and spelling errors.
    - Use strong action verbs.
    - CRITICAL: Do NOT invent, hallucinate, or infer ANY contact details. Only use contact info explicitly present in the source text.
    - CRITICAL: If multiple email addresses or phone numbers are present, INCLUDE ALL OF THEM (separated by ' / ' or ' | '). Do not arbitrarily select just one.
    - CRITICAL: In 'header.links', INCLUDE ONLY:
      1. Known professional profiles: GitHub, LinkedIn, Stack Overflow, Kaggle, GitLab.
      2. ONE Personal Website/Portfolio ONLY IF it looks like a personal domain (e.g. matches candidate's name like 'catalin.francu.com') OR is explicitly labeled as 'Web'/'Website'/'Portfolio' in the resume header.
    - CRITICAL: Do NOT include company websites, project demos (e.g. nerdvana.ro, dignitas.ro), or random URLs in 'header.links'. These belong in 'experience' or 'projects'.
    - CRITICAL: If a URL is 'nerdvana.ro', 'dignitas.ro', 'dexonline.ro', it is a PROJECT or COMPANY link. Do NOT put it in the header. Put it in the corresponding Experience item.
    - CRITICAL: Place relevant project/app links (e.g. Play Store, App Store, Live Demo) INSIDE the 'experience' or 'projects' item they belong to, using the 'links' array.
    - CRITICAL: If a section (Education, Experience, Skills) is missing from the source text, return an empty array []. Do NOT invent placeholder data like 'University (Information not provided)' or 'Coursework'.
    - CRITICAL: HOWEVER, if a section contains REDACTED/BLACKED-OUT information (e.g. '[Redacted]' or similar placeholders in source text), include the section with '[Redacted]' or generic placeholders (e.g. 'University name [Redacted]'). Do NOT omit it.
    - CRITICAL: Preserve all Play Store / App Store / GitHub links found in job descriptions. Add them to the 'links' array for that experience.
    - CRITICAL: Order 'experience' items by date, starting with the MOST RECENT (Current/Present) job first, and working backwards. Do NOT return them in random or chronological order.
    - CRITICAL: YOU MUST INCLUDE EVERY SINGLE EXPERIENCE ITEM FOUND IN THE SOURCE TEXT. If the source lists 2 jobs, return 2 jobs. If it lists 3, return 3. Do NOT omit older jobs unless they are irrelevant >15 years ago.
    - CRITICAL: EXTRACT 'PROJECTS' SECTION ONLY IF EXPLICITLY PRESENT. This includes sections titled 'Projects', 'Solo Projects', 'Side Projects', or 'Technical Projects'.
    - CRITICAL: IF NO EXPLICIT 'PROJECTS' SECTION EXISTS, RETURN AN EMPTY ARRAY '[]'. Do NOT convert 'Experience' items into 'Components' or 'Projects'.
    - CRITICAL: Do NOT invent a projects section if the user didn't include one.
    - CRITICAL: If the user lists 'Solo Projects', treat them as full 'Projects'. Include name, description, and key tech stack.
    - CRITICAL: APPLY IMPROVEMENTS: If an 'Actionable Fix' or 'Weakness' critique specifically suggests a change (e.g. 'rephrase X as Y'), YOU MUST IMPLEMENT THAT CHANGE in the generated JSON content.
    - CRITICAL: DETERMINE SECTION ORDER. You must output a 'sectionOrder' array of strings.
      - If the candidate is a STUDENT or Recent Grad (e.g. grad year > 2023) or has High GPA (>3.5), put "education" FIRST.
      - If the candidate is an EXPERIENCED professional (>2 years), put "experience" FIRST.
      - If the candidate relies on portfolios (e.g. designer/dev), put "projects" or "skills" higher.
      - The array must assume 'header' and 'summary' are already at the top.
      - valid values: "experience", "education", "projects", "skills", "languages".
      - Example 1 (Student): ["education", "skills", "projects", "experience", "languages"]
      - Example 2 (Senior Dev): ["experience", "skills", "projects", "education", "languages"]
    - CRITICAL: 'languages' array MUST contain HUMAN SPOKEN LANGUAGES ONLY (e.g. English, Spanish, French).
    - CRITICAL: DO NOT put programming languages (Python, Java, C++, etc.) in 'languages'. Put them in 'skills'.
    - CRITICAL: If you see links containing "idk" (e.g., github.com/idk, canva.com/design/idk), TREAT THEM AS NORMAL LINKS. Extract them exactly as written into the 'links' array. Do NOT skip or remove them.
    - Do NOT include markdown code blocks (like \`\`\`json). Just return the raw JSON string.
    `;

    // Use redundancy helper
    let text = await generateWithFallback(genAI, prompt);
    
    // Clean up potential markdown formatting from the model
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const fixedContent = JSON.parse(text);

    return NextResponse.json({ fixedContent });

  } catch (error) {
    console.error("Error generating fix:", error);
    return NextResponse.json(
      { error: "Failed to generate fixed resume" },
      { status: 500 }
    );
  }
}
