import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle, 
  X 
} from 'lucide-react';

interface SoftLoginModalProps {
  capturedImage?: string | null;
  onClose: () => void;
  onSignUp: () => void;
}

export const SoftLoginModal: React.FC<SoftLoginModalProps> = ({ 
  capturedImage, 
  onClose, 
  onSignUp 
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative">
        
        {/* Close Modal Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Preview Thumbnail */}
        {capturedImage && (
          <div className="flex items-center space-x-4 mb-6 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <div className="w-16 h-20 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-800">
              <img 
                src={capturedImage} 
                alt="Scanned Bill" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>Bill Processed Successfully!</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">AI Bill OCR Extracted</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ready to encrypt &amp; store in Vault.</p>
            </div>
          </div>
        )}

        {/* Soft Login Value Pitch */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Save Your Bill in Vault 🛡️
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            You tried it for free! Sign up in 10 seconds to save this bill and get automated warranty expiry alerts.
          </p>
        </div>

        {/* Benefits Checklist */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2.5 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Bank-Grade 256-Bit Encrypted Storage</span>
          </div>
          <div className="flex items-center space-x-2.5 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Automated Expiry Push Notifications</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={onSignUp}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>Create Free Account to Save</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
          >
            Discard &amp; Exit
          </button>
        </div>

      </div>
    </div>
  );
};

export default SoftLoginModal;
