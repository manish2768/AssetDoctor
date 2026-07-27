import React from 'react';
import { AlertTriangle, Zap, ArrowRight } from 'lucide-react';

interface UrgentAlertCardProps {
  title?: string;
  daysLeft?: number;
  assetName?: string;
  onRenew?: () => void;
}

export const UrgentAlertCard: React.FC<UrgentAlertCardProps> = ({
  title = 'PUC EXPIRING',
  daysLeft = 3,
  assetName = 'TVS Ronin',
  onRenew,
}) => {
  const handleRenew = () => {
    if (typeof onRenew === 'function') {
      onRenew();
    } else {
      alert(`1-Tap Renewing ${title} for ${assetName}...`);
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-rose-950/70 border border-rose-500/40 shadow-2xl space-y-3 relative overflow-hidden animate-pulse-border">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          ⚠️ {title}
        </span>
        <span className="text-xs font-extrabold text-rose-300 font-mono">
          {daysLeft} Days Left
        </span>
      </div>

      <div className="text-lg font-black text-white">
        {assetName}
      </div>

      <button
        onClick={handleRenew}
        className="w-full py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
        <span>1-Tap Renew Now</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UrgentAlertCard;
