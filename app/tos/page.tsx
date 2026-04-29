import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for CVR - Please read these terms carefully before using our service.',
};

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-zinc-400 font-medium">
              Last Updated: April 29, 2026
            </p>
          </header>

          <section className="glass-panel p-8 rounded-2xl space-y-8 leading-relaxed text-zinc-300">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing and using <strong>CVR</strong> (the "Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Description of Service</h2>
              <p>
                CVR provides AI-powered resume analysis, roasting, and enhancement services. 
                The Service allows users to upload resume data, receive feedback, and purchase premium features such as PDF downloads.
              </p>
            </div>

            <div className="space-y-4 border-l-4 border-primary pl-6 bg-primary/5 py-4 rounded-r-xl">
              <h2 className="text-2xl font-bold text-white">3. Purchases and PDF Access</h2>
              <p>
                When you purchase a premium resume enhancement or download:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-primary">Limited Access Window:</strong> After a successful purchase, you will have access to download the PDF version of your enhanced resume for a period of <strong>one (1) hour</strong>.
                </li>
                <li>
                  <strong>Responsibility:</strong> It is your responsibility to download and save your file within this timeframe. After one hour, the download link will expire as part of our data privacy policy.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Refunds and Payments</h2>
              <p>
                Payments for CVR services are processed through the Apple App Store (for iOS users) or other integrated payment processors.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-secondary">Refund Requests:</strong> All refund requests for purchases made within the CVR iOS app are <strong>handled exclusively by Apple</strong>. We do not have the ability to process refunds directly for App Store transactions.
                </li>
                <li>
                  <strong>Process:</strong> To request a refund, please follow the instructions provided by Apple at <a href="https://reportaproblem.apple.com" className="text-secondary underline underline-offset-4">reportaproblem.apple.com</a>.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. User Conduct</h2>
              <p>
                You agree not to use the Service for any unlawful purpose or to upload any content that is offensive, defamatory, or infringes on the intellectual property rights of others.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Disclaimer of Warranties</h2>
              <p>
                The Service is provided "as is" and "as available." While our AI provides high-quality feedback, we do not guarantee that using CVR will result in a job offer or any specific career outcome.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Brahman shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the Service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Support and Contact</h2>
              <p>
                If you have any questions about these Terms, please contact our support team at:
              </p>
              <p className="text-primary font-bold text-lg">
                <a href="mailto:support@brahman.top" className="hover:underline">support@brahman.top</a>
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
