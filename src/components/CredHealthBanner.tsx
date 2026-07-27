import React from 'react';
import { Shield, Sparkles, TrendingUp } from 'lucide-react';
import { formatINR } from '../utils/assetUtils';

interface CredHealthBannerProps {
  totalValuation?: number;
  healthScore?: number;
  assetsCount?: number;
}

export const CredHealthBanner: React.FC<CredHealthBannerProps> = ({
  totalValuation = 285400,
  healthScore = 94,
  assetsCount = 2,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5 font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          ASSET HEALTH
        </span>
        <span className="text-[11px] font-black px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono shadow-sm">
          {healthScore}% SECURE
        </span>
      </div>

      <div>
        <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
          ₹ {totalValuation.toLocaleString('en-IN')}
        </div>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
          <span>Total Tracked Assets Value</span>
          <span className="text-emerald-400 font-semibold">• {assetsCount} Vault Items Active</span>
        </p>
      </div>
    </div>
  );
};

export default CredHealthBanner;
