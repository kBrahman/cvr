import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Resume Roaster',
    short_name: 'Roaster',
    description: 'AI-powered resume analysis and improvement tool.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#ef4444',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
