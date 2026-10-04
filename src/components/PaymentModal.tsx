import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, ShieldCheck, CreditCard, QrCode, Banknote, Smartphone, 
  Check, Lock, ArrowRight, Loader2, Sparkles
} from 'lucide-react';
import { sounds } from '../services/audio';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess: (method: 'upi' | 'card' | 'cod' | 'wallet') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onPaymentSuccess
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('user@okhdfcbank');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [cardHolder, setCardHolder] = useState('Subhadra Singh');

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePay = () => {
    setIsProcessing(true);
    sounds.playPing();

    setTimeout(() => {
      setIsProcessing(false);
      sounds.playOrderPlaced();
      triggerConfetti();
      onPaymentSuccess(paymentMethod);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">Secure Payment</h2>
              <p className="text-xs text-neutral-400">256-Bit Bank Grade SSL Encryption</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount to pay banner */}
        <div className="bg-emerald-950/40 border-b border-emerald-800/30 px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-300">Amount to pay</span>
          <span className="text-xl font-black text-emerald-400 font-mono">₹{totalAmount}</span>
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-4 bg-neutral-950 border-b border-neutral-800 p-1.5 gap-1 text-xs">
          <button
            onClick={() => setPaymentMethod('upi')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'upi'
                ? 'bg-neutral-800 text-emerald-400 shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI Instant</span>
          </button>

          <button
            onClick={() => setPaymentMethod('card')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'card'
                ? 'bg-neutral-800 text-emerald-400 shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setPaymentMethod('wallet')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'wallet'
                ? 'bg-neutral-800 text-emerald-400 shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Wallets</span>
          </button>

          <button
            onClick={() => setPaymentMethod('cod')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'cod'
                ? 'bg-neutral-800 text-emerald-400 shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>Cash</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 no-scrollbar">
          {paymentMethod === 'upi' && (
            <div className="space-y-4">
              <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center text-center">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Scan & Pay with Any UPI App
                </span>
                
                {/* Simulated QR Code */}
                <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/30 mb-2">
                  <div className="w-36 h-36 bg-neutral-900 rounded-lg p-2 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-4 border-white rounded-sm" />
                      <div className="w-8 h-8 border-4 border-white rounded-sm" />
                    </div>
                    <div className="flex items-center justify-center text-white text-[11px] font-mono font-bold">
                      ₹{totalAmount}
                    </div>
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-4 border-white rounded-sm" />
                      <div className="w-4 h-4 bg-emerald-400 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span className="px-2 py-0.5 rounded bg-neutral-800 font-mono">GPay</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-800 font-mono">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-800 font-mono">Paytm</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Or Pay via UPI ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => sounds.playSuccessTone()}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 rounded-xl"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-3.5">
              {/* Card visual preview */}
              <div className="relative bg-gradient-to-tr from-neutral-950 via-emerald-950 to-neutral-900 border border-emerald-500/40 rounded-2xl p-5 text-white shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 text-xs tracking-widest uppercase font-mono text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" /> QuickBasket Express Card
                  </div>
                  <span className="font-extrabold italic text-sm text-white">VISA</span>
                </div>
                <div className="font-mono text-base tracking-widest mb-4 text-neutral-100">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase block">Card Holder</span>
                    <span className="font-medium tracking-wide uppercase">{cardHolder || 'FULL NAME'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase block">Expires</span>
                    <span className="font-mono">{cardExpiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Valid Thru</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div className="space-y-3 text-xs">
              <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-4 space-y-2.5">
                {[
                  { name: 'Paytm Wallet', balance: '₹420.00' },
                  { name: 'Amazon Pay', balance: '₹1,250.00' },
                  { name: 'MobiKwik', balance: '₹85.00' }
                ].map((w, idx) => (
                  <label key={w.name} className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 cursor-pointer border border-neutral-800 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input type="radio" name="wallet" defaultChecked={idx === 0} className="accent-emerald-500" />
                      <span className="font-bold text-white text-sm">{w.name}</span>
                    </div>
                    <span className="font-mono text-neutral-400">Bal: {w.balance}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-5 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Banknote className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">Cash / QR on Delivery</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Keep cash ready or scan the rider's QR code when they reach your doorstep in 10 minutes.
              </p>
            </div>
          )}
        </div>

        {/* Footer pay button */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <span>PAY ₹{totalAmount} & PLACE ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
