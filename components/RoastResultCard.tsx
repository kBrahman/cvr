"use client";

import { AlertCircle, Loader2, Share2, Check, Copy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface RoastResultCardProps {
    result: any;
    onFix?: () => void;
    isFixing?: boolean;
    showFixButton?: boolean;
    isSharedPage?: boolean;
}

export default function RoastResultCard({ result, onFix, isFixing, showFixButton = true, isSharedPage = false }: RoastResultCardProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // If we have an ID, we can share. If not (legacy or error), fallback?
        // Ideally the API now returns ID.
        const shareId = result.id;
        if (!shareId) {
             console.warn("No roast ID found for sharing");
             return;
        }

        const url = `${window.location.origin}/roast/${shareId}`;
        const shareData = {
          title: `Resume Roast Score: ${result.score}/100`,
          text: `My resume got roasted! Score: ${result.score}/100.\n"${result.summary}"\n\nCheck it out here:`,
          url: url,
        };

        if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try { 
                await navigator.share(shareData); 
            } catch (e) { 
                console.error("Share failed", e); 
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (e) {
                console.error("Clipboard failed", e);
                alert("Could not copy link. Manually copy: " + url);
            }
        }
    };

    return (
        <div className="glass-panel rounded-2xl p-8 border-t-4 border-t-destructive relative" suppressHydrationWarning>


            <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Score Visualization */}
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

            {/* Content: Summary & Lists */}
            <div className="flex-grow space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-destructive flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            The Verdict
                        </h3>
                        {/* Share Button */}
                        {result.id && (
                            <button 
                                onClick={handleShare}
                                className="p-2 -mr-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors group relative"
                                title={copied ? "Copied!" : "Share Result"}
                            >
                                {copied ? (
                                    <Check className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                )}
                            </button>
                        )}
                    </div>
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
            
            {/* Actions */}
            {showFixButton && !isSharedPage && (
                <div className="mt-8 text-center py-8 border-t border-zinc-800">
                    <button 
                        onClick={onFix}
                        disabled={isFixing}
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
                    >
                        {isFixing ? (
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
            
            {isSharedPage && (
                 <div className="mt-8 text-center py-8 border-t border-zinc-800">
                 <Link 
                     href="/#roast-section"
                     className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-200 bg-white rounded-xl hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-lg"
                 >
                     <span className="mr-2 text-xl">🔥</span> 
                     Roast Your Own Resume
                 </Link>
                 <p className="mt-4 text-sm text-zinc-500">
                     Join thousands of job seekers getting hired faster.
                 </p>
             </div>
            )}
        </div>
    );
}
