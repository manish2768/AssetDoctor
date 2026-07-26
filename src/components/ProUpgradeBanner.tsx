import React from 'react';
import { Crown, MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProUpgradeBannerProps {
  onShowToast: (message: string) => void;
}

export const ProUpgradeBanner: React.FC<ProUpgradeBannerProps> = ({ onShowToast }) => {
  const handleUpgrade = () => {
    const confirmUpgrade = window.confirm(
      "AssetDoctor Smart Shield Pro Upgrade:\n\n- ₹9/महीना\n- Direct WhatsApp Expiry Alerts\n- Cloud Backup & Fast Vault Sync\n\nक्या आप अपग्रेड करना चाहते हैं?"
    );
    if (confirmUpgrade) {
      onShowToast('💳 Payment Gateway (Razorpay/UPI) Opening... Subscribing to ₹9/Mo Pro!');
    }
  };

  return (
    <div 
      onClick={handleUpgrade}
      className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-2 border-emerald-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer group hover:border-emerald-400 transition-all"
    >
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-[#10B981] border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <MessageCircle className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>Get Instant WhatsApp & SMS Alerts</span>
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
              ₹9 / Mo Pro
            </span>
          </div>

          <p className="text-xs text-slate-300">
            कभी न भूलें अपनी पॉलिसी या बिल ड्यू डेट (मात्र ₹9/महीना) • Auto-Alert Protection
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleUpgrade();
        }}
        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#10B981] to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
      >
        <span>Upgrade ₹9/mo</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProUpgradeBanner;
