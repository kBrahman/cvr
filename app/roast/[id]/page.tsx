
import { createClient } from "@supabase/supabase-js";
import RoastResultCard from "@/components/RoastResultCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { ArrowLeft } from "lucide-react";

// Revalidate cached data every hour, but for new roasts they should be available immediately via on-demand or dynamic.
// Since we want instant sharing, let's use force-dynamic for this page or strict revalidation.
export const dynamic = 'force-dynamic'; 

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: roast } = await supabase
    .from('roasts')
    .select('score, summary')
    .eq('id', id)
    .single();

  if (!roast) {
    return {
      title: 'Roast Not Found - Resume Roaster'
    }
  }

  return {
    title: `Roasted! Score: ${roast.score}/100 - Resume Roaster`,
    description: `My resume got a score of ${roast.score}/100 on Resume Roaster. "${roast.summary.substring(0, 100)}..."`,
    openGraph: {
      title: `Resume Roast Score: ${roast.score}/100`,
      description: roast.summary,
      url: `https://resumeroaster.app/roast/${id}`, // Example URL
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Resume Roast Score: ${roast.score}/100`,
      description: roast.summary,
    }
  }
}

export default async function SharedRoastPage({ params }: Props) {
  const { id } = await params;

  if (!id) return notFound();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: roast, error } = await supabase
    .from('roasts')
    .select('id, score, summary, weaknesses, improvements, created_at')
    .eq('id', id)
    .single();

  if (error || !roast) {
    console.error("Error fetching roast:", error);
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-destructive">Roast Not Found</h1>
        <p className="text-zinc-400 mb-8">This roast may have expired or never existed.</p>
        <Link href="/" className="px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
          Roast Your Resume
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
      {/* Simple Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <span className="text-2xl">🔥</span>
            <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
              Resume Roaster
            </span>
          </Link>
          <Link 
            href="/"
            className="hidden md:block text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Roast Yours →
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-12 max-w-4xl">
         <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-zinc-500 hover:text-white mb-6 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </Link>
            
            <div className="text-center max-w-2xl mx-auto mb-12">
               <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                  The Verdict Is In.
               </h1>
               <p className="text-zinc-400 text-lg">
                  Someone uploaded their resume and asked for the brutal truth. Here it is.
               </p>
            </div>

            <RoastResultCard 
                result={roast} 
                isSharedPage={true}
                showFixButton={false} // Don't show fix button on shared page yet, guide them to home
            />
         </div>
         
         <div className="text-center mt-20 border-t border-white/10 pt-12">
             <h2 className="text-2xl font-bold mb-4">Dare to check your own score?</h2>
             <Link 
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black transition-all bg-white rounded-full hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
             >
                Roast My Resume Now for Free
             </Link>
         </div>
      </div>
    </main>
  );
}
