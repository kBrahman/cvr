
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Resume Roaster - AI Powered Resume Review';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20 }}>🔥</div>
        <div 
          style={{ 
             fontSize: 80, 
             fontWeight: 900, 
             background: 'linear-gradient(to right, #ef4444, #f97316)', 
             backgroundClip: 'text',
             color: 'transparent',
             marginBottom: 20
          }}
        >
          RESUME ROASTER
        </div>
        <div style={{ fontSize: 40, color: '#a1a1aa' }}>
          Stop Sending Trash to Recruiters.
        </div>
        <div style={{ 
            marginTop: 40, 
            padding: '15px 40px', 
            borderRadius: 50, 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 24,
            color: '#d4d4d8'
        }}>
            AI Analysis • Brutal Feedback • Instant Fix
        </div>
      </div>
    ),
    { ...size }
  );
}
