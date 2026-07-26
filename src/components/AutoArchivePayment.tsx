import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, FileText, Loader2, X } from 'lucide-react';

interface AutoArchivePaymentProps {
  assetName?: string; // जैसे: 'TVS Ronin'
  category?: string;  // जैसे: 'Vehicles'
  premiumAmount?: number;
  onClose?: () => void;
  onShowToast?: (message: string) => void;
}

export const AutoArchivePayment: React.FC<AutoArchivePaymentProps> = ({ 
  assetName = "TVS Ronin", 
  category = "Vehicles",
  premiumAmount = 3450,
  onClose,
  onShowToast
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    // 1. सिमुलेटेड पेमेंट और ऑटो-आर्काइव प्रोसेस (2 सेकंड)
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      if (onShowToast) {
        onShowToast(`🎉 Payment of ₹${premiumAmount.toLocaleString('en-IN')} successful! Policy receipt auto-archived to ${assetName}.`);
      }
    }, 2000);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 max-w-md w-full mx-auto text-white shadow-2xl relative">
      
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pr-6">
        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Insurance Renewal</h3>
          <p className="text-xs text-slate-400">Asset Linked: <span className="text-cyan-400 font-medium">{assetName}</span></p>
        </div>
      </div>

      {/* Bill Details */}
      <div className="bg-slate-800/50 rounded-xl p-3.5 mb-4 border border-slate-700/50 space-y-1.5">
        <div className="flex justify-between text-sm py-1">
          <span className="text-slate-400">Premium Amount</span>
          <span className="font-bold text-cyan-300">₹{premiumAmount.toLocaleString('en-IN')}.00</span>
        </div>
        <div className="flex justify-between text-xs text-slate-400 py-1 border-t border-slate-800 pt-2">
          <span>Auto-Archive Destination</span>
          <span className="text-slate-300 font-mono text-[11px]">Assets &gt; {category} &gt; {assetName}</span>
        </div>
      </div>

      {/* Action Button & Status */}
      {!isCompleted ? (
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-cyan-500/20"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing & Archiving...
            </>
          ) : (
            <>
              Pay ₹{premiumAmount.toLocaleString('en-IN')} &amp; Auto-Archive <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      ) : (
        /* Success Screen with Auto-Archive Confirmation */
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center animate-fade-in space-y-3">
          <div className="flex justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h4 className="font-bold text-emerald-400 text-sm">Payment Successful!</h4>
          
          <div className="bg-slate-950/60 p-2.5 rounded-lg flex items-center justify-between text-xs text-slate-300 border border-slate-800">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">Insurance_Policy_2026.pdf</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0">
              Saved ✅
            </span>
          </div>
          
          <p className="text-[11px] text-slate-400">
            रसीद <b>Assets &gt; {category} &gt; {assetName}</b> में अपने आप सुरक्षित कर दी गई है।
          </p>

          {onClose && (
            <button
              onClick={onClose}
              className="mt-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Close & View Asset Vault
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoArchivePayment;
