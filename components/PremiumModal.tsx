
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient'; 
import { Loader2, Lock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Called after successful login & payment check
}

export default function PremiumModal({ isOpen, onClose, onSuccess }: PremiumModalProps) {
  const [step, setStep] = useState<'initial' | 'login-method' | 'email-input' | 'otp-input' | 'pay-confirm'>('initial');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // Ideally use a context or Supabase hook
  const supabase = createClient();
  const router = useRouter();

  if (!isOpen) return null;

  const handleInitialPay = async () => {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setUser(session.user);
      setStep('pay-confirm'); // Proceed to payment if logged in
    } else {
      setStep('login-method'); // Ask for login
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // auto-register if new
      }
    });
    setLoading(false);
    if (!error) {
      setStep('otp-input');
    } else {
      alert(error.message);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    
    setLoading(false);

    if (error) {
      alert(error.message);
    } else if (data.session) {
      setUser(data.session.user);
      setStep('pay-confirm'); // Automatically proceed to payment step after login
    }
  };

  const processPayment = async () => {
    setLoading(true);
    // Here we would integrate Stripe
    // For now, mock success
    setTimeout(() => {
      setLoading(false);
      onSuccess(); // Close modal and enable edit mode
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {step === 'initial' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Unlock Premium Features</h2>
              <p className="text-zinc-400 mb-8">
                Editing this resume is a premium feature. Unlock full editing capabilities and downloads for a one-time payment.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleInitialPay}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all transform hover:scale-[1.02]"
                >
                  Pay $9.99 to Unlock
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 'login-method' && (
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-6">Sign in to continue</h2>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  className="w-full py-3 bg-white text-black font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
                <button 
                  onClick={() => handleSocialLogin('apple')}
                  className="w-full py-3 bg-black text-white border border-zinc-700 font-medium rounded-xl flex items-center justify-center gap-2 hover:border-zinc-500 transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.09-.54-2.08-.51-3.2.06-1.37.7-2.1.33-3.14-.81-1.63-1.78-2.8-4.59-1.18-7.39.81-1.4 2.27-2.3 3.86-2.32 1.25-.03 2.44.83 3.2.83.77 0 2.2-.84 3.71-.7 1.27.09 2.22.5 2.82 1.37-2.48 1.48-2.06 4.75.29 5.8 0 .02-.15.46-.38.78zm-5.3-17.5c.73-.89 1.94-1.45 3.03-1.38.12 1.21-.43 2.45-1.19 3.29-.68.78-1.92 1.39-3.08 1.34-.14-1.28.52-2.52 1.24-3.25z"/></svg>
                  Continue with Apple
                </button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Or continue with email</span></div>
                </div>

                <button 
                  onClick={() => setStep('email-input')}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
                >
                  Continue with Email
                </button>
              </div>
            </div>
          )}

          {step === 'email-input' && (
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Enter your email</h2>
              <p className="text-zinc-400 text-sm mb-6">We'll send you a verification code.</p>
              
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                autoFocus
              />
              
              <button 
                onClick={handleEmailLogin}
                disabled={loading || !email}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Code
              </button>
              
              <button 
                onClick={() => setStep('login-method')}
                className="mt-4 text-zinc-500 hover:text-white text-sm"
              >
                Back to Login Options
              </button>
            </div>
          )}

          {step === 'otp-input' && (
             <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Verify your email</h2>
              <p className="text-zinc-400 text-sm mb-6">Enter the 6-digit code sent to {email}</p>
              
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono mb-4"
                autoFocus
              />
              
              <button 
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                 {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify & Login
              </button>
            </div>
          )}

          {step === 'pay-confirm' && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-5 duration-300">
               <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
               </div>
               <h2 className="text-xl font-bold text-white mb-2">Processing Payment...</h2>
               <p className="text-zinc-400 text-sm">
                 Please wait while we secure your transaction.
                 <br />
                 (Simulated Payment)
               </p>
               <button onClick={processPayment} className="hidden">Mock Trigger</button>
               {/* Auto-trigger via useEffect in real implementation, manual for now */}
               <div className="mt-6 flex justify-center">
                 <button onClick={processPayment} className="px-4 py-2 bg-green-600 rounded text-sm font-bold text-white hover:bg-green-500">
                    Confirm mock payment
                 </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
