
import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Resume Roast Result';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch roast data
  const { data: roast } = await supabase
    .from('roasts')
    .select('score, summary, weaknesses, improvements')
    .eq('id', id)
    .single();

  if (!roast) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: '#09090b',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Resume Not Found
        </div>
      ),
      { ...size }
    );
  }

  // Calculate score circle dash offset (simplified visual representation)
  // 377 is circumference roughly for r=60. Here we scale up.
  // Standard full circle stroke.
  const score = roast.score;
  const scoreColor = score < 50 ? '#ef4444' : score < 80 ? '#f59e0b' : '#10b981';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          color: 'white',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left Column: Score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '300px',
            height: '100%',
            marginRight: '40px',
          }}
        >
          {/* Score Circle - using CSS border radius for simplicity in Satori */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              border: `15px solid #27272a`, // Base track
              position: 'relative',
            }}
          >
             {/* Score Overlay - We simulate progress by just coloring the border if supported,
                 or just simpler visual: Colored Text or Inner Ring. 
                 Satori has limited SVG support, but simple border works.
                 Let's do a colored border distinct from track. 
              */}
              <div
                style={{
                    position: 'absolute',
                    top: -15, left: -15,
                    width: '240px',
                    height: '240px',
                    borderRadius: '50%',
                    border: `15px solid ${scoreColor}`,
                    borderRightColor: 'transparent', // Hacky partial circle or full
                    borderBottomColor: score < 50 ? 'transparent' : scoreColor,
                    transform: 'rotate(-45deg)', // Just static visual logic
                }}
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -10 }}>
                <span style={{ fontSize: '96px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{score}</span>
                <span style={{ fontSize: '20px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '4px', marginTop: 10 }}>SCORE</span>
              </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {/* Header & Verdict */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
               {/* Icon placeholder */}
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
               </svg>
               <span style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>The Verdict</span>
            </div>
            
            <div style={{ 
                fontSize: '24px', 
                color: '#d4d4d8', 
                lineHeight: 1.4, 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                padding: '25px', 
                borderRadius: '16px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                // Limit summary length visually
                overflow: 'hidden',
                maxHeight: '180px',
            }}>
                {roast.summary.length > 220 ? roast.summary.substring(0, 220) + '...' : roast.summary}
            </div>
          </div>

          {/* Grid for Weaknesses / Quick Fixes */}
          <div style={{ display: 'flex', gap: '30px', flex: 1 }}>
             {/* Weaknesses */}
             <div style={{ 
                 display: 'flex', 
                 flexDirection: 'column', 
                 flex: 1, 
                 backgroundColor: 'rgba(239, 68, 68, 0.05)', 
                 border: '1px solid rgba(239, 68, 68, 0.1)', 
                 borderRadius: '12px',
                 padding: '20px' 
             }}>
                 <span style={{ fontSize: '18px', fontWeight: 700, color: '#f87171', marginBottom: '15px', textTransform: 'uppercase' }}>Weaknesses</span>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {roast.weaknesses.slice(0, 3).map((w: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '18px', color: '#d4d4d8', lineHeight: 1.3 }}>
                           <span style={{ color: '#ef4444', marginRight: '8px', fontSize: '24px', lineHeight: 0.8 }}>•</span>
                           <span>{w.length > 60 ? w.substring(0, 60) + '...' : w}</span>
                        </div>
                    ))}
                 </div>
             </div>

             {/* Fixes */}
             <div style={{ 
                 display: 'flex', 
                 flexDirection: 'column', 
                 flex: 1, 
                 backgroundColor: 'rgba(16, 185, 129, 0.05)', 
                 border: '1px solid rgba(16, 185, 129, 0.1)', 
                 borderRadius: '12px',
                 padding: '20px' 
             }}>
                 <span style={{ fontSize: '18px', fontWeight: 700, color: '#34d399', marginBottom: '15px', textTransform: 'uppercase' }}>Quick Fixes</span>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {roast.improvements.slice(0, 3).map((imp: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '18px', color: '#d4d4d8', lineHeight: 1.3 }}>
                           <span style={{ color: '#10b981', marginRight: '8px', fontSize: '24px', lineHeight: 0.8 }}>•</span>
                           <span>{imp.length > 60 ? imp.substring(0, 60) + '...' : imp}</span>
                        </div>
                    ))}
                 </div>
             </div>
          </div>

        </div>
      </div>
    ),
    {
      ...size,
      // Optional: Load fonts here if needed, but defaults work.
    }
  );
}
