import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { X, CreditCard, CheckCircle2, Loader2, Apple, Globe } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: string; // e.g., "9.99"
}

// Custom wrapper to handle PayPal Loading State cleanly
const PayPalButtonWrapper = ({ amount, onSuccess }: { amount: string, onSuccess: () => void }) => {
    const [{ isPending }] = usePayPalScriptReducer();

    return (
        <>
            {isPending && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-blue-500" /></div>}
            <PayPalButtons
                style={{ layout: "vertical" }}
                fundingSource="paypal" // Explicitly show PayPal first
                createOrder={(data, actions) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                amount: {
                                    value: amount,
                                    currency_code: "USD"
                                }
                            }
                        ],
                    });
                }}
                onApprove={async (data, actions) => {
                     const details = await actions.order?.capture();
                     // In production, verify transaction on server
                     console.log("Transaction completed by " + details?.payer?.name?.given_name);
                     onSuccess();
                }}
            />
             {/* Apple/Google Pay often auto-detected by smart buttons but can be forced if needed */}
             <div className="mt-4">
                 <p className="text-center text-xs text-zinc-500 mb-2">Or pay with Card / Wallet</p>
                 <PayPalButtons
                    style={{ layout: "vertical", color: 'black' }}
                    fundingSource="card"
                    createOrder={(data, actions) => {
                        return actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { value: amount, currency_code: "USD" } }] });
                    }}
                    onApprove={async (data, actions) => {
                        await actions.order?.capture();
                        onSuccess();
                    }}
                 />
            </div>
            {/* Note: Apple Pay requires domain verification on PayPal dashboard. Google Pay works on supported devices. */}
        </>
    );
}

export default function PaymentModal({ isOpen, onClose, onSuccess, amount }: PaymentModalProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!isOpen || !mounted) return null;

    return createPortal(


        <div 
            className="flex items-center justify-center"
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh', 
                zIndex: 2147483647, // Max Safe Integer for z-index
                backgroundColor: 'rgba(9, 9, 11, 0.95)' // Zinc-950 with 95% opacity
            }}
        >
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-0 overflow-hidden shadow-2xl scale-100 relative">
                {/* Header */}
                <div className="bg-zinc-900 p-6 border-b border-zinc-800 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Unlock Full Access</h2>
                        <p className="text-zinc-400 text-sm mt-1">Download your resume without watermarks.</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8 bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                        <span className="font-semibold text-white">Total</span>
                        <span className="text-2xl font-bold text-blue-400">${amount}</span>
                    </div>

                    {/* PayPal Provider */}
                    {/* Ideally Client ID comes from env */}
                    <PayPalScriptProvider options={{ 
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
                        currency: "USD",
                        intent: "capture", // Explicit intent
                        components: "buttons", // Simplified
                    }}>
                        <PayPalButtonWrapper amount={amount} onSuccess={onSuccess} />
                    </PayPalScriptProvider>

                    <div className="mt-6 text-center text-xs text-zinc-500">
                        <p>Secure payment processed by PayPal.</p>
                        <div className="flex justify-center gap-2 mt-2 opacity-50">
                             <CreditCard className="w-4 h-4" />
                             <Apple className="w-4 h-4" />
                             <Globe className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        , document.body
    );
}
