import React, { useState, useRef } from 'react';
import { X, ShieldCheck, Share2, Download, Sparkles, QrCode, CheckCircle2, Crown, Zap, Flame } from 'lucide-react';
import { AssetDoctorLogo } from './AssetDoctorLogo';
import { Asset } from '../types';
import { formatINR } from '../utils/assetUtils';

export type PassportTheme = 'biker' | 'techie' | 'minimalist';

interface AssetPassportModalProps {
  isOpen: boolean;
  asset: Asset | null;
  ownerName?: string;
  onClose: () => void;
}

export const AssetPassportModal: React.FC<AssetPassportModalProps> = ({
  isOpen,
  asset,
  ownerName = 'Manish Rai',
  onClose,
}) => {
  const [theme, setTheme] = useState<PassportTheme>('techie');
  const [imgError, setImgError] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const passportCardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !asset) return null;

  // Theme styling configurations
  const themeStyles = {
    biker: {
      bg: 'bg-gradient-to-b from-neutral-950 via-stone-900 to-black',
      border: 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.25)]',
      accentText: 'text-orange-400',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      heroBorder: 'border-orange-500/60 shadow-orange-500/20',
      titleGrad: 'from-orange-400 via-amber-200 to-yellow-400',
      qrBorder: 'border-orange-500/40',
    },
    techie: {
      bg: 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950',
      border: 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.25)]',
      accentText: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      heroBorder: 'border-cyan-500/60 shadow-cyan-500/20',
      titleGrad: 'from-cyan-400 via-teal-200 to-indigo-300',
      qrBorder: 'border-cyan-500/40',
    },
    minimalist: {
      bg: 'bg-gradient-to-b from-black via-zinc-950 to-neutral-950',
      border: 'border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.2)]',
      accentText: 'text-[#D4AF37]',
      badgeBg: 'bg-[#D4AF37]/20 text-amber-300 border-[#D4AF37]/40',
      heroBorder: 'border-[#D4AF37]/60 shadow-[#D4AF37]/20',
      titleGrad: 'from-[#D4AF37] via-amber-100 to-[#F59E0B]',
      qrBorder: 'border-[#D4AF37]/40',
    },
  };

  const currentTheme = themeStyles[theme];

  // Flex Score calculation
  const flexScore = asset.status === 'active' ? 98 : asset.status === 'expiring_soon' ? 85 : 70;

  // Fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80';
  const displayImage = imgError ? defaultImage : (asset.imageUrl || asset.receiptImageUrl || defaultImage);

  // Download card function
  const handleDownloadImage = async () => {
    setIsExporting(true);
    try {
      // Draw simulated passport image export or trigger download
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = theme === 'biker' ? '#0f0e0c' : theme === 'minimalist' ? '#050505' : '#090d16';
        ctx.fillRect(0, 0, 1080, 1920);

        // Header Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 54px sans-serif';
        ctx.fillText('AssetDoctor Vault Passport', 80, 120);

        ctx.fillStyle = theme === 'biker' ? '#f97316' : theme === 'minimalist' ? '#d4af37' : '#06b6d4';
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText(asset.name.toUpperCase(), 80, 240);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '40px monospace';
        ctx.fillText(`ID: ${asset.id} | OWNER: ${ownerName}`, 80, 320);
        ctx.fillText(`VALUATION: ₹${(asset.price || 0).toLocaleString('en-IN')}`, 80, 390);

        ctx.fillStyle = '#10b981';
        ctx.fillText(`STATUS: 100% VERIFIED VAULT PASSPORT`, 80, 480);
      }

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `AssetPassport_${asset.name.replace(/\s+/g, '_')}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error('Passport Download Error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Share to Instagram Story
  const handleShareStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${asset.name} Passport`,
          text: `Check out my verified ${asset.name} on AssetDoctor Vault! Flex Score: ${flexScore}% Verified 🛡️`,
          url: window.location.href,
        });
      } catch (e) {
        console.error('Share error:', e);
      }
    } else {
      alert(`Copied Instagram Story Flex text:\n\n🔥 My ${asset.name} is 100% verified on AssetDoctor! Flex Score: ${flexScore}% 🛡️`);
    }
  };

  // Verification QR API URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `https://assetdoctor.in/verify/${asset.id}`
  )}&color=ffffff&bgboundary=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center">
        
        {/* Top Controls: Close + Theme Switcher */}
        <div className="flex items-center justify-between w-full mb-3 px-1">
          {/* Theme Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => setTheme('techie')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                theme === 'techie' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-cyan-400" /> Techie
            </button>
            <button
              onClick={() => setTheme('biker')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                theme === 'biker' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-orange-400" /> Biker
            </button>
            <button
              onClick={() => setTheme('minimalist')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                theme === 'minimalist' ? 'bg-[#D4AF37]/20 text-amber-300 border border-[#D4AF37]/40 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3 h-3 text-amber-400" /> Gold
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 9:16 VERTICAL ASSET PASSPORT CARD */}
        <div
          ref={passportCardRef}
          className={`relative w-full aspect-[9/16] rounded-3xl p-5 ${currentTheme.bg} border-2 ${currentTheme.border} backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 group select-none`}
        >
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/20 blur-3xl pointer-events-none" />

          {/* 1. HEADER SECTION */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <AssetDoctorLogo className="h-7 w-auto" />
            </div>

            {/* Flex Score Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 shadow-lg ${currentTheme.badgeBg}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{flexScore}% VERIFIED</span>
            </div>
          </div>

          {/* 2. HERO ASSET IMAGE */}
          <div className="relative z-10 my-auto">
            <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 ${currentTheme.heroBorder} bg-slate-950 shadow-2xl transform transition-transform duration-300 group-hover:scale-[1.02]`}>
              <img
                src={displayImage}
                alt={asset.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
              {/* Asset Category Badge */}
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white border border-slate-800">
                {asset.category}
              </span>
            </div>
          </div>

          {/* 3. DETAILS BOX */}
          <div className="z-10 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={`text-lg font-black tracking-tight leading-snug bg-gradient-to-r ${currentTheme.titleGrad} bg-clip-text text-transparent`}>
                  {asset.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Owner: {ownerName}</p>
              </div>

              {/* Asset Health Badge */}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 border ${
                asset.status === 'active' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {asset.status === 'active' ? '🟢 Protected' : '🟡 Expiring'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">ASSET ID</span>
                <span className="text-white font-bold">{asset.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">CURRENT VALUE</span>
                <span className={`font-black ${currentTheme.accentText}`}>
                  {formatINR(asset.price || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* 4. FOOTER: QR CODE & GEN-Z STAMP */}
          <div className="z-10 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-xl bg-slate-950 border ${currentTheme.qrBorder} shadow-md`}>
                <img
                  src={qrUrl}
                  alt="Verify QR"
                  className="w-10 h-10 rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">SCAN TO VERIFY</span>
                <span className="text-[11px] font-bold text-white flex items-center gap-1">
                  AssetDoctor Core <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </span>
              </div>
            </div>

            {/* GEN-Z VERIFIED Stamp */}
            <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <span>GEN-Z VERIFIED</span>
              <Sparkles className="w-3 h-3 text-emerald-400" />
            </div>
          </div>

        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{isExporting ? 'Saving...' : 'Download Image'}</span>
          </button>

          <button
            onClick={handleShareStory}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-pink-500/20 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>Share to Story</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssetPassportModal;
