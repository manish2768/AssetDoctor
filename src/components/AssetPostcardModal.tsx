import React, { useState, useRef } from 'react';
import { X, Share2, Download, ShieldCheck, CheckCircle2, Sparkles, Instagram, MessageCircle, Copy } from 'lucide-react';
import { Asset } from '../types';
import { formatINR, calculateResaleValue, generateWhatsAppShareUrl } from '../utils/assetUtils';
import { AssetDoctorLogo } from './AssetDoctorLogo';

interface AssetPostcardModalProps {
  isOpen: boolean;
  asset: Asset | null;
  ownerName?: string;
  onClose: () => void;
}

export const AssetPostcardModal: React.FC<AssetPostcardModalProps> = ({
  isOpen,
  asset,
  ownerName = 'Vault Owner',
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const postcardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !asset) return null;

  const defaultImg = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80';
  const displayImg = imgError ? defaultImg : (asset.imageUrl || asset.receiptImageUrl || defaultImg);

  const resaleValue = calculateResaleValue(asset.price || 0, asset.purchaseDate || new Date().toISOString());

  // Download Postcard Card Image
  const handleDownloadPostcard = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Gradient Background
        const grad = ctx.createLinearGradient(0, 0, 0, 1920);
        grad.addColorStop(0, '#0b0f19');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);

        // Header Title
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 42px monospace';
        ctx.fillText('🛡️ ASSETDOCTOR VERIFIED VAULT POSTCARD', 80, 140);

        // Product Name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'black 68px sans-serif';
        ctx.fillText(asset.name.toUpperCase(), 80, 260);

        // Details
        ctx.fillStyle = '#94a3b8';
        ctx.font = '38px monospace';
        ctx.fillText(`Purchase Date: ${asset.purchaseDate || 'N/A'}`, 80, 360);
        ctx.fillText(`Purchase Price: ₹${(asset.price || 0).toLocaleString('en-IN')}`, 80, 430);
        ctx.fillText(`Estimated Resale: ₹${resaleValue.toLocaleString('en-IN')}`, 80, 500);
        ctx.fillText(`Status: 🟢 GST VERIFIED & 100% SECURED`, 80, 580);
      }

      const link = document.createElement('a');
      link.download = `AssetPostcard_${asset.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Postcard download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Direct Web Share / WhatsApp
  const handleShareWhatsApp = () => {
    const waUrl = generateWhatsAppShareUrl(asset);
    window.open(waUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AssetDoctor Postcard - ${asset.name}`,
          text: `Check out my verified ${asset.name} on AssetDoctor Vault! Purchase Value: ${formatINR(asset.price || 0)} 🟢 GST Verified`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      const textToCopy = `🔥 ${asset.name} is 100% verified on AssetDoctor Vault!\nValue: ${formatINR(asset.price || 0)} | GST Verified 🟢`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center">
        
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between w-full mb-3 px-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Asset Postcard (Story &amp; Share)</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POSTCARD CARD CONTAINER (Instagram Story Aesthetic) */}
        <div
          ref={postcardRef}
          className="relative w-full aspect-[9/16] rounded-3xl p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden select-none"
        >
          {/* Neon Glow Effects */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* 1. POSTCARD HEADER */}
          <div className="flex items-center justify-between z-10">
            <AssetDoctorLogo className="h-7 w-auto" />

            {/* GST Verified Badge */}
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>GST VERIFIED</span>
            </div>
          </div>

          {/* 2. POSTCARD HERO IMAGE */}
          <div className="relative z-10 my-auto">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-slate-950 shadow-2xl group">
              <img
                src={displayImg}
                alt={asset.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                {asset.category}
              </span>
            </div>
          </div>

          {/* 3. POSTCARD DETAILS BOX */}
          <div className="z-10 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md space-y-3">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight leading-snug">
                {asset.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Purchased: {asset.purchaseDate || 'N/A'} • {ownerName}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">PURCHASE PRICE</span>
                <span className="text-white font-extrabold text-sm">{formatINR(asset.price || 0)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">EST. RESALE</span>
                <span className="text-emerald-400 font-extrabold text-sm">{formatINR(resaleValue)}</span>
              </div>
            </div>
          </div>

          {/* 4. POSTCARD FOOTER */}
          <div className="z-10 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono">
              🛡️ AssetDoctor Vault • {asset.id}
            </span>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              100% PROTECTED
            </span>
          </div>

        </div>

        {/* ACTION BUTTONS (Download & Share) */}
        <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
          <button
            onClick={handleDownloadPostcard}
            disabled={isDownloading}
            className="py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{isDownloading ? 'Saving...' : 'Download Image'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>

        <button
          onClick={handleNativeShare}
          className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition cursor-pointer"
        >
          <Instagram className="w-4 h-4" />
          <span>{copied ? 'Story Text Copied!' : 'Share to Instagram Story'}</span>
        </button>

      </div>
    </div>
  );
};

export default AssetPostcardModal;
