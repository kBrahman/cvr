"use client";

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="border-b border-zinc-800/50 backdrop-blur-md fixed top-0 w-full z-50 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="text-2xl font-black bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            ResumeRoast
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20 uppercase tracking-wide">
            Beta
          </span>
        </div>
        
        <div className="flex items-center gap-8 text-sm font-medium text-zinc-400">
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
        </div>
      </div>
    </nav>
  );
}
