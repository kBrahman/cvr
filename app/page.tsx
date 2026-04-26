import Image from "next/image";
import packageInfo from "@/package.json";

import CVR from "@/components/ResumeRoaster";
import Navbar from "@/components/Navbar";
import MobileWarning from "@/components/MobileWarning";
import { MoveRight, Zap, Shield, Search, CheckCircle2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60; // Revalidate every minute so counters update
export const dynamic = 'force-dynamic';
export default async function Home() {
  // Fetch real stats
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get Roasts Today (UTC)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  const { count: roastsToday } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'roast')
    .gte('created_at', today.toISOString());

  // Get Total Downloads
  const { count: totalDownloads } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'download');

  // Get Dynamic Price
  const { data: priceConfig } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'resume_price')
    .single();
  const price = priceConfig?.value || '9.99';

  const displayRoasts = roastsToday || 0;
  // If downloads are 0, maybe show a baseline? User said "real counter".
  // But "Trusted by 0 job seekers" is bad. 
  // I will just show the real number.
  const displayDownloads = totalDownloads || 0;

  return (
    <main className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden custom-scrollbar">
      {/* Global styles for smooth scroll */}
      <style>{`
        html { scroll-behavior: smooth; }
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>

      {/* Background Gradients */}
      <MobileWarning />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {displayRoasts.toLocaleString()} Resumes Roasted Today
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Stop Sending <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Trash</span> to Recruiters.
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            AI-powered resume roasting that tells you exactly why you're not getting hired. 
            <span className="text-white font-medium"> Brutally honest feedback in seconds.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="#roast-section" className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all flex items-center gap-2 group shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Roast My Resume
              <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="flex items-center gap-1 text-sm text-zinc-500">
              <div className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[10px] overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 34}`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <span className="ml-2">Trusted by {displayDownloads.toLocaleString()} job seekers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Roaster Component */}
      <section id="roast-section" className="px-6 pb-32 scroll-mt-24">
        <CVR price={price} />
      </section>

      {/* Social Proof */}
      <section className="border-y border-zinc-900 bg-zinc-950/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-zinc-500 font-medium mb-12 uppercase tracking-widest text-sm">
            Getting people hired at
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Google', 'Netflix', 'Spotify', 'stripe'].map((brand) => (
               <div key={brand} className="h-12 flex items-center justify-center font-black text-2xl text-zinc-300">
                 {brand}
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 relative scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">How It Works</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Three simple steps to go from "Rejected" to "Hired".</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Search className="w-8 h-8 text-blue-400" />,
                title: "1. Upload Resume",
                desc: "Paste your resume text. Don't worry, we don't store it for long. We just judge it."
              },
              { 
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "2. Get Roasted",
                desc: "Our AI analyzes your formatting, keywords, and metrics to tell you exactly where you suck."
              },
              { 
                icon: <Shield className="w-8 h-8 text-green-400" />,
                title: "3. Get Fixed",
                desc: "Pay a tiny fee to get a professional rewrite that actually beats the ATS robots."
              }
            ].map((step, i) => (
              <div key={i} className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 bg-zinc-900/20 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Simple Pricing</h2>
            <p className="text-zinc-400">Invest in your career. It costs less than a bad lunch.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl border border-zinc-800 opacity-75 hover:opacity-100 transition-opacity">
              <h3 className="text-2xl font-bold mb-2">The Roach Mode</h3>
              <div className="text-4xl font-black mb-6">$0</div>
              <ul className="space-y-4 mb-8">
                {[
                  "Brutal AI Analysis & Score", 
                  "Complete Professional Rewrite (Preview)",
                  "ATS Keyword Optimization",
                  "Modern Design Templates",
                  "Unlimited Editing"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-400">
                    <CheckCircle2 className="w-5 h-5 text-zinc-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#roast-section" className="block w-full py-3 rounded-lg border border-zinc-700 text-center font-bold hover:bg-zinc-800 transition-colors">
                Roast & Rewrite Free
              </a>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-primary/10 to-zinc-900 border border-primary/50 relative overflow-hidden transform md:scale-105 shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold rounded-bl-xl">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Resume Rescue</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black">${price}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Roach Mode",
                  "Instant PDF Download",
                  "Remove Watermarks",
                  "High-Quality Print Ready",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              {/* Note: In a real app, this would be a direct link to Stripe checkout */}
              <a 
                href="#roast-section"
                className="block w-full py-4 rounded-xl bg-white text-black text-center font-bold hover:bg-zinc-200 transition-colors"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 bg-black text-center text-zinc-500 text-sm">
        <p>&copy; 2026 CVR v{packageInfo.version}. All rights reserved.</p>
      </footer>
    </main>
  );
}
