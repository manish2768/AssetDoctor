import React, { useMemo } from 'react';
import { Asset } from '../types';
import { calculateResaleValue, formatINR } from '../utils/assetUtils';
import { TrendingDown, IndianRupee, ShieldCheck, AlertTriangle, PackageX, Sparkles, RefreshCw, Wrench, ShieldAlert } from 'lucide-react';

interface DepreciationTrackerWidgetProps {
  assets: Asset[];
  onSelectAsset?: (asset: Asset) => void;
  onOpenClaimModal?: (asset: Asset) => void;
}

export const DepreciationTrackerWidget: React.FC<DepreciationTrackerWidgetProps> = ({
  assets,
  onSelectAsset,
  onOpenClaimModal,
}) => {
  const depreciationSummary = useMemo(() => {
    let totalOriginalPrice = 0;
    let totalCurrentValue = 0;

    const itemsWithMetrics = assets.map((ast) => {
      const res = calculateResaleValue({
        price: ast.price,
        purchaseDate: ast.purchaseDate,
        category: ast.category,
      });

      totalOriginalPrice += ast.price || 0;
      totalCurrentValue += res.currentValue;

      return {
        asset: ast,
        ...res,
      };
    });

    const totalDepreciated = Math.max(0, totalOriginalPrice - totalCurrentValue);
    const overallRetainedPct = totalOriginalPrice > 0 ? Math.round((totalCurrentValue / totalOriginalPrice) * 100) : 100;

    return {
      totalOriginalPrice,
      totalCurrentValue,
      totalDepreciated,
      overallRetainedPct,
      itemsWithMetrics,
    };
  }, [assets]);

  if (assets.length === 0) return null;

  return (
    <div id="depreciation-tracker-widget" className="p-4 sm:p-6 rounded-3xl bg-[#0F141F] border border-[#222C40] shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Metallic Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#10B981]/10 via-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2638] pb-5 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            <TrendingDown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Asset Health & Resale Valuation Engine</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            Portfolio Net Worth & Financial Depreciation
          </h2>
          <p className="text-xs text-slate-400">
            Real-time calculation based on category wear rates, age in years, and active warranty status
          </p>
        </div>

        {/* Retained Value Badge */}
        <div className="px-4 py-3 rounded-2xl bg-[#0B0E14] border border-[#D4AF37]/40 text-center shrink-0">
          <span className="text-[10px] font-extrabold uppercase text-[#D4AF37] tracking-wider block">
            Overall Value Retention
          </span>
          <span className="text-2xl font-black text-white font-mono tracking-tight block">
            {depreciationSummary.overallRetainedPct}%
          </span>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        
        {/* Original Value */}
        <div className="p-4 rounded-2xl bg-[#0B0E14] border border-[#222C40] space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Original Purchase Total
          </span>
          <span className="text-xl font-black text-slate-200 font-mono">
            {formatINR(depreciationSummary.totalOriginalPrice)}
          </span>
          <span className="text-[10px] text-slate-500 block">Initial invoice expenditure</span>
        </div>

        {/* Current Estimated Resale Value */}
        <div className="p-4 rounded-2xl bg-[#0B0E14] border border-[#10B981]/40 space-y-1">
          <span className="text-[10px] font-extrabold text-[#10B981] uppercase tracking-wider block">
            Current Est. Resale Value
          </span>
          <span className="text-xl font-black text-[#10B981] font-mono">
            {formatINR(depreciationSummary.totalCurrentValue)}
          </span>
          <span className="text-[10px] text-[#10B981]/80 block font-semibold">Live market valuation estimate</span>
        </div>

        {/* Total Depreciation Amount */}
        <div className="p-4 rounded-2xl bg-[#0B0E14] border border-[#D4AF37]/30 space-y-1">
          <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider block">
            Accumulated Depreciation
          </span>
          <span className="text-xl font-black text-amber-300 font-mono">
            -{formatINR(depreciationSummary.totalDepreciated)}
          </span>
          <span className="text-[10px] text-slate-400 block">Straight-line category decay</span>
        </div>

      </div>

      {/* Top Assets Health & Depreciation Breakdown */}
      <div className="space-y-3 relative z-10">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>Individual Asset Health & Resale Metric</span>
          <span className="text-[10px] text-slate-500 font-mono">{assets.length} Items Calculated</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {depreciationSummary.itemsWithMetrics.slice(0, 6).map(({ asset, currentValue, retainedPercentage, ageInYears }) => {
            const isGreen = asset.status === 'active';
            const isYellow = asset.status === 'expiring_soon';

            return (
              <div
                key={`deprec-${asset.id}`}
                onClick={() => onSelectAsset?.(asset)}
                className="p-3.5 rounded-2xl bg-[#0B0E14] border border-[#1E2638] hover:border-[#10B981]/50 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#10B981] transition-colors truncate">
                      {asset.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{asset.category}</span>
                      <span>•</span>
                      <span>Age: {ageInYears} yrs</span>
                      <span>•</span>
                      <span>Invoice: {formatINR(asset.price)}</span>
                    </p>
                  </div>

                  {/* Health Pill */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 border ${
                      isGreen
                        ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                        : isYellow
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {isGreen ? '🟢 Healthy' : isYellow ? '🟡 Expiring' : '🔴 Expired'}
                  </span>
                </div>

                {/* Value Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Current Resale: <strong className="text-white">{formatINR(currentValue)}</strong></span>
                    <span className="text-[#D4AF37] font-bold">{retainedPercentage}% Value Retained</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1E2638] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        retainedPercentage > 70
                          ? 'bg-gradient-to-r from-[#10B981] to-emerald-400'
                          : retainedPercentage > 40
                          ? 'bg-gradient-to-r from-amber-400 to-[#D4AF37]'
                          : 'bg-gradient-to-r from-rose-500 to-amber-500'
                      }`}
                      style={{ width: `${retainedPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Prompt button if expiring soon */}
                {isYellow && (
                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    <span className="text-amber-300 font-medium">Warranty expiring in {asset.daysRemaining} days!</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenClaimModal?.(asset);
                      }}
                      className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold border border-amber-500/30 transition cursor-pointer flex items-center gap-1"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>1-Click Renewal / Claim</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
