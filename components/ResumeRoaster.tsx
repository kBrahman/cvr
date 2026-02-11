"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, Flame, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ProfessionalResume from "./ProfessionalResume";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function ResumeRoaster({ price = "9.99" }: { price?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [resumeText, setResumeText] = useState("");
  const [fixedContent, setFixedContent] = useState<any>(null);
  const [fixing, setFixing] = useState(false);
  const [extractedPhoto, setExtractedPhoto] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500); // Slight delay to account for animation
    }
  }, [result]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRoast = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setFixedContent("");
    
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/roast", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      
      setResult(data);
      if (data.resumeText) setResumeText(data.resumeText);

      // EXTRACT FACE IF DETECTED
      if (data.face_box && file && file.type.startsWith('image/')) {
        try {
            const extractFace = async () => {
                const img = new Image();
                img.src = URL.createObjectURL(file);
                await new Promise((resolve) => { img.onload = resolve; });
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // Gemini 0-1000 coordinates: [ymin, xmin, ymax, xmax]
                const [ymin, xmin, ymax, xmax] = data.face_box;
                
                // Convert to pixels - Use natural dimensions for max resolution
                const natW = img.naturalWidth || img.width;
                const natH = img.naturalHeight || img.height;

                const y = (ymin / 1000) * natH;
                const x = (xmin / 1000) * natW;
                const h = ((ymax - ymin) / 1000) * natH;
                const w = ((xmax - xmin) / 1000) * natW;

                // Add some padding (10%)
                const padding = w * 0.1;
                const sx = Math.max(0, x - padding);
                const sy = Math.max(0, y - padding * 1.5); // More top padding for hair
                const sw = Math.min(natW - sx, w + padding * 2);
                const sh = Math.min(natH - sy, h + padding * 2);

                canvas.width = sw;
                canvas.height = sh;
                
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
                setExtractedPhoto(canvas.toDataURL('image/png'));
            };
            extractFace();
        } catch (e) {
            console.error("Failed to crop face:", e);
        }
      } else {
        setExtractedPhoto(null);
      }

    } catch (error) {
      console.error(error);
      alert("Failed to roast resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFix = async () => {
    if (!resumeText) {
      alert("We can only fix text-based resumes right now. Please upload a PDF.");
      return;
    }
    setFixing(true);
    try {
      const response = await fetch("/api/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeText,
          weaknesses: result?.weaknesses 
        }),
      });
      
      const data = await response.json();
      if (data.fixedContent) {
        // Inject extracted photo if available
        const contentWithPhoto = { ...data.fixedContent };
        if (extractedPhoto) {
            contentWithPhoto.photo = extractedPhoto;
        }
        setFixedContent(contentWithPhoto);
        // Scroll to fix section
        setTimeout(() => {
          document.getElementById('fixed-resume')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
       console.error(error);
       alert("Failed to generate fix.");
    } finally {
      setFixing(false);
    }
  };

  const handleDownload = () => {
    if (confirm(`Wait! To download this professionally formatted PDF, you need to unlock the full 'Resume Rescue' package for just $${price}.\n\nClick OK to proceed to payment.`)) {
        // Replace with actual Stripe link provided by user later
        window.open('https://buy.stripe.com/test_12345', '_blank'); 
    }
  };

  return (
    <>
    <div className="w-full max-w-4xl mx-auto p-6 relative z-10">
      <div className="glass-panel rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Drop Your Resume</h2>
          <p className="text-zinc-400">Upload PDF or Image. We'll roast the content AND the look.</p>
        </div>

        <div className="space-y-6">
          {/* Upload Area */}
          <div 
            className={cn(
              "border-2 border-dashed rounded-xl p-12 transition-all duration-300 relative group flex flex-col items-center justify-center text-center cursor-pointer",
              isDragging ? "border-primary bg-primary/5" : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              id="file-upload"
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg,.avif,.docx,.txt,.rtf,.odt"
              className="hidden"
              onChange={handleFileChange}
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-4">
                <FileText className="w-16 h-16 text-primary" />
                <div>
                  <p className="text-lg font-bold text-white">{file.name}</p>
                  <p className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setFile(null); 
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors text-white"
                >
                  Change File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                  <Upload className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-zinc-500">PDF, DOCX, ODT, TXT, RTF, PNG, JPG, AVIF (Max 5MB)</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleRoast}
            disabled={loading || !file}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent font-bold text-lg text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing & Roasting...
              </span>
            ) : (
              <>
                <Flame className="w-5 h-5 fill-current" />
                Roast My Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <div className="glass-panel rounded-2xl p-8 border-t-4 border-t-destructive">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Score */}
                <div className="flex-shrink-0 text-center mx-auto md:mx-0">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="#27272a" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="64" cy="64" r="60" 
                        stroke="#ef4444" 
                        strokeWidth="8" 
                        fill="transparent"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * result.score) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-black text-white">{result.score}</span>
                      <span className="text-xs text-zinc-400 uppercase tracking-widest">Score</span>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="flex-grow space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-destructive mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      The Verdict
                    </h3>
                    <p className="text-zinc-300 leading-relaxed font-mono bg-black/30 p-4 rounded-lg border border-red-500/20">
                      {result.summary}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                      <h4 className="font-bold text-red-400 mb-2 text-sm uppercase">Weaknesses</h4>
                      <ul className="space-y-1">
                        {result.weaknesses.map((w: string, i: number) => (
                          <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <h4 className="font-bold text-emerald-400 mb-2 text-sm uppercase">Quick Fixes</h4>
                      <ul className="space-y-1">
                        {result.improvements.map((imp: string, i: number) => (
                          <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ACTION AREA - Kept inside the card for flow, or move out? 
                  Result: Verdict Card ends here. 
                  Fix Button should probably be part of the flow AFTER verdict? 
                  Or inside? 
                  Let's keep Fix Button INSIDE the Verdict Card for now, but ProfessionalResume OUTSIDE.
              */}
              {!fixedContent && (
                  <div className="mt-8 text-center py-8 border-t border-zinc-800">
                      <button 
                          onClick={handleFix}
                          disabled={fixing}
                          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
                      >
                          {fixing ? (
                               <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Applying Magic Fixes...
                               </>
                          ) : (
                              <>
                                  <span className="mr-2 text-xl">✨</span> 
                                  Fix My Resume Instantly 
                                  <span className="ml-2 text-xl">✨</span>
                              </>
                          )}
                      </button>
                      <p className="mt-4 text-sm text-zinc-500">
                          Our AI will rewrite your resume to be ATS-friendly and impactful.
                      </p>
                  </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* SEPARATE SECTION: Professional Resume Preview - Wider Container */}
    {fixedContent && (
        <div id="fixed-resume" className="w-full flex justify-center relative z-10 mt-12">
                <ProfessionalResume 
                data={fixedContent} 
                onDownload={handleDownload} 
                price={price}
                />
        </div>
    )}
    </>
  );
}
