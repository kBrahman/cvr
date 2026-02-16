
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo / Favicon */}
        <div className="relative w-24 h-24 animate-pulse">
           <img 
             src="/favicon.ico" 
             alt="ResumeRoast" 
             className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]"
           />
        </div>
        
        {/* Loading Dots */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
