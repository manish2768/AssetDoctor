import React, { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Bot, Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export type MascotState = 'welcome' | 'success' | 'error';

interface DocGearMascotProps {
  state?: MascotState;
  size?: number | string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  caption?: string;
  showStatusBadge?: boolean;
  customUrl?: string;
}

export const MASCOT_LOTTIE_URLS: Record<MascotState, string> = {
  welcome: 'https://assets1.lottiefiles.com/packages/lf20_cK1M5P.json', // Waving Bot Welcome
  success: 'https://assets5.lottiefiles.com/packages/lf20_touohxz0.json', // Celebrating Success Bot
  error: 'https://assets10.lottiefiles.com/packages/lf20_kks41q3q.json', // Confused Error Bot
};

export const MASCOT_STATE_CONFIG: Record<
  MascotState,
  {
    title: string;
    subtitle: string;
    badgeText: string;
    badgeColor: string;
    accentGlow: string;
    icon: React.ReactNode;
  }
> = {
  welcome: {
    title: "Hi there! I'm DocGear 🤖",
    subtitle: "Your AI Warranty & Asset Care Companion",
    badgeText: "Waving Bot • Ready to Help",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    accentGlow: "from-emerald-500/20 via-teal-500/10 to-transparent",
    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
  },
  success: {
    title: "Awesome! Action Completed 🎉",
    subtitle: "DocGear safely secured your asset and warranty details",
    badgeText: "Celebrating Bot • Task Success",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    accentGlow: "from-amber-500/25 via-emerald-500/15 to-transparent",
    icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
  },
  error: {
    title: "Oops! Something Needs Attention ⚠️",
    subtitle: "DocGear got a bit confused. Let's try scanning again!",
    badgeText: "Confused Bot • Action Needed",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    accentGlow: "from-rose-500/20 via-amber-500/10 to-transparent",
    icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
  },
};

export const DocGearMascot: React.FC<DocGearMascotProps> = ({
  state = 'welcome',
  size = 260,
  className = '',
  loop = true,
  autoplay = true,
  caption,
  showStatusBadge = true,
  customUrl,
}) => {
  const [hasPlayerError, setHasPlayerError] = useState(false);
  const [key, setKey] = useState(0);

  const currentConfig = MASCOT_STATE_CONFIG[state];
  const lottieUrl = customUrl || MASCOT_LOTTIE_URLS[state];

  const handleRestart = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0B0E14] border border-[#1E2638] shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Background Radial Glow using Deep Obsidian + Emerald + Metallic Gold */}
      <div
        className={`absolute inset-0 bg-radial ${currentConfig.accentGlow} opacity-60 pointer-events-none rounded-3xl blur-2xl`}
      />

      {/* Decorative Gold Header Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-emerald-400 rounded-t-3xl" />

      {/* Top Status Badge */}
      {showStatusBadge && (
        <div className="flex items-center justify-between w-full mb-3 z-10">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-md ${currentConfig.badgeColor}`}
          >
            {currentConfig.icon}
            <span>{currentConfig.badgeText}</span>
          </div>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-all cursor-pointer"
            title="Replay Animation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mascot Player Container */}
      <div className="relative z-10 flex items-center justify-center my-2 group">
        {/* Halo Glow Ring */}
        <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-500/20 via-[#D4AF37]/15 to-transparent blur-xl pointer-events-none group-hover:scale-110 transition-transform" />

        {!hasPlayerError ? (
          <div key={key}>
            <Player
              autoplay={autoplay}
              loop={loop}
              src={lottieUrl}
              style={{ width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size }}
              onEvent={(e) => {
                if (e === 'error') setHasPlayerError(true);
              }}
              className="drop-shadow-2xl transition-transform duration-300 transform group-hover:scale-105"
            />
          </div>
        ) : (
          /* SVG Vector Fallback in case remote CDN fails */
          <div
            style={{ width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#121824] border border-[#2A344A] text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4AF37] to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg mb-2 animate-bounce">
              <Bot className="w-10 h-10 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-amber-300">DocGear Bot</span>
            <span className="text-[10px] text-slate-400 capitalize">{state} State</span>
          </div>
        )}
      </div>

      {/* Title & Captions */}
      <div className="text-center z-10 space-y-1 mt-2">
        <h3 className="text-base font-extrabold text-white tracking-wide flex items-center justify-center gap-2">
          <span>{currentConfig.title}</span>
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          {caption || currentConfig.subtitle}
        </p>
      </div>

      {/* Subdued Gold Metallic Footer Tag */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-[10px] text-slate-500 z-10 font-mono">
        <span className="flex items-center gap-1 text-[#D4AF37]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
          DocGear AI Engine
        </span>
        <span className="text-slate-400 uppercase tracking-widest font-bold">
          State: <span className="text-emerald-400">{state}</span>
        </span>
      </div>
    </div>
  );
};
