import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for CVR - Your data privacy and security are our top priority.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-primary/30 selection:text-primary-foreground">
      {/* Navbar Overlay */}
      <nav className="border-b border-zinc-800/50 backdrop-blur-md sticky top-0 w-full z-50 bg-black/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              CVR
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20 uppercase tracking-wide">
              Beta
            </span>
          </Link>
          <Link 
            href="/" 
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 bg-pattern">
        <div className="space-y-12">
          {/* Header */}
          <header className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gradient">
              Privacy Policy
            </h1>
            <p className="text-zinc-400 font-medium">
              Last Updated: April 29, 2026
            </p>
          </header>

          <section className="glass-panel p-8 rounded-2xl space-y-8 leading-relaxed text-zinc-300">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
              <p>
                Welcome to <strong>CVR</strong> ("we," "our," or "us"), operated by <strong>Brahman</strong>. 
                We are committed to protecting your personal information and your right to privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our resume roasting and enhancement service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Information Collection and Usage</h2>
              <p>
                When you upload your resume to CVR, we extract the textual content to provide our core services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-primary">Resume Roasting:</strong> We use Large Language Models (LLMs) to analyze your resume and provide critical, actionable feedback.
                </li>
                <li>
                  <strong className="text-secondary">Resume Enhancement:</strong> We process your data to suggest improvements in formatting, phrasing, and impact.
                </li>
              </ul>
              <p className="bg-zinc-900/50 p-4 border-l-2 border-primary rounded-r-lg italic">
                Your resume data is sent to a secure LLM provider for the sole purpose of generating these insights.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Data Retention and Deletion</h2>
              <p>
                Your privacy is our priority. We follow a strict <strong>zero-persistence</strong> policy for your sensitive data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Extracted Data:</strong> All sensitive user data extracted from your resume is deleted immediately after the roasting or enhancement process is complete.
                </li>
                <li>
                  <strong>No Persistent Storage:</strong> We do not store your personal resume content, contact details, or work history in any persistent database or long-term storage.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data during transmission. 
                Data sent to our LLM partners is encrypted in transit and processed under strict confidentiality agreements.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
              <p>
                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at: support@brahman.top
              </p>
              <p className="text-primary font-bold">
                Brahman
              </p>
            </div>
          </section>

          <footer className="pt-10 border-t border-zinc-800/50 text-center text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} CVR by Brahman. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
