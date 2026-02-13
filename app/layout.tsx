import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    template: '%s | Resume Roaster',
    default: 'Resume Roaster - Brutally Honest AI Resume Review',
  },
  description: "Get your resume roasted by AI. Instant feedback on formatting, keywords, and impact. Fix your CV in seconds and get hired faster.",
  keywords: ["resume review", "ai resume check", "cv roast", "resume feedback", "ats optimization", "career advice", "job search tools"],
  authors: [{ name: "Brahman" }],
  creator: "Brahman",
  publisher: "Resume Roaster",
  icons: {
    icon: '/favicon.ico',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cv.brahman.top"),
  openGraph: {
    title: 'Resume Roaster - Brutally Honest AI Resume Review',
    description: 'Stop sending trash to recruiters. Get instant, harsh, but helpful AI feedback on your resume.',
    url: 'https://cv.brahman.top',
    siteName: 'Resume Roaster',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Roaster',
    description: 'Get your resume roasted by AI. harsh but helpful feedback.',
    creator: '@brahman', // Update with actual handle if available
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Resume Roaster',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI-powered resume analysis tool that provides instant feedback and improvements.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
