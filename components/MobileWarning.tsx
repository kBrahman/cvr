
"use client";

import { useEffect, useState } from "react";
import { Smartphone, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Detect mobile by screen width or user agent
    const checkMobile = () => {
      // 768px is the standard md breakpoint. Most phones are below this.
      // Also check coarse pointer (touch) to be more accurate
      const isSmallScreen = window.innerWidth < 768;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      
      if (isSmallScreen) {
        setIsMobile(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4 pb-2"
      >
        <div className="mx-auto max-w-lg bg-zinc-900/90 backdrop-blur-md border border-yellow-500/20 text-white p-4 rounded-xl shadow-2xl flex gap-4 items-start relative">
            <div className="bg-yellow-500/10 p-2 rounded-lg shrink-0">
                <Monitor className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-sm mb-1 text-yellow-500">Better on Desktop</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                    Resume editing is complex. For the best experience and to see all details, please switch to a laptop or desktop computer.
                </p>
                <button 
                  onClick={() => setShow(false)}
                  className="mt-3 text-xs font-medium text-white underline underline-offset-2 hover:text-yellow-400"
                >
                  I understand, continue anyway
                </button>
            </div>
            
            <button 
                onClick={() => setShow(false)}
                className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-white"
            >
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
