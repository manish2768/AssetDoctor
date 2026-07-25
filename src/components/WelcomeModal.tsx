import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onGoToDashboard
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Smiling Avatar Header Container */}
        <div className="inline-flex items-center justify-center relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 animate-bounce">
            <span className="select-none">😊✨</span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-md">
            <ShieldCheck className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        {/* Welcome Title */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            स्वागत है, AssetDoctor परिवार में! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
            आपका अकाउंट सफलतापूर्वक तैयार हो गया है। अब आपके सारे इम्पॉर्टेंट डॉक्यूमेंट्स और वॉरंटीज़ 100% सुरक्षित हैं!
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AI Multi-Item Bill Scanning Enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Bank-Grade AES-256 Encrypted Storage</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          type="button"
          onClick={() => {
            onGoToDashboard();
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>स्कैनर शुरू करें 🚀</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

      </div>
    </div>
  );
};

export default WelcomeModal;
