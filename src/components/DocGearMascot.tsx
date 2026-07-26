import React, { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';
import { AssetDoctorIcon } from './AssetDoctorIcon';
import { useAuth } from '../context/AuthContext';

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
  userName?: string;
}

export const MASCOT_LOTTIE_URLS: Record<MascotState, string> = {
  welcome: '', // Will use custom 3D Glassmorphic AssetDoctorIcon
  success: 'https://assets5.lottiefiles.com/packages/lf20_touohxz0.json', // Celebrating Success Bot
  error: 'https://assets10.lottiefiles.com/packages/lf20_kks41q3q.json', // Confused Error Bot
};

export const DocGearMascot: React.FC<DocGearMascotProps> = ({
  state = 'welcome',
  size = 210,
  className = '',
  loop = true,
  autoplay = true,
  caption,
  showStatusBadge = true,
  customUrl,
  userName,
}) => {
  const [hasPlayerError, setHasPlayerError] = useState(false);
  const [key, setKey] = useState(0);

  // Retrieve user name from Auth Context or LocalStorage if available
  let authUser: any = null;
  try {
    const authContext = useAuth();
    authUser = authContext?.user;
  } catch {
    authUser = null;
  }

  const rawName = userName || authUser?.displayName || localStorage.getItem('assetdoctor_user_name') || '';
  const userFirstName = rawName ? rawName.trim().split(' ')[0] : '';

  // Personalized Title & Subtitle Config
  const title = state === 'welcome'
    ? (userFirstName ? `नमस्ते ${userFirstName}! 💖` : 'नमस्ते AssetDoctor परिवार के नए सदस्य! 💖')
    : state === 'success'
    ? 'Awesome! Action Completed 🎉'
    : 'Oops! Something Needs Attention ⚠️';

  const subtitle = state === 'welcome'
    ? 'आप AssetDoctor के सुरक्षित और स्मार्ट वॉल्ट में प्रवेश कर चुके हैं।'
    : state === 'success'
    ? 'AssetDoctor safely secured your asset and warranty details'
    : "AssetDoctor got a bit confused. Let's try scanning again!";

  const badgeText = state === 'welcome'
    ? 'WELCOME • Vault Secured'
    : state === 'success'
    ? 'SUCCESS • Task Completed'
    : 'ATTENTION • Action Needed';

  const badgeColor = state === 'welcome'
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    : state === 'success'
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

  const accentGlow = state === 'welcome'
    ? 'from-emerald-500/25 via-teal-500/15 to-transparent'
    : state === 'success'
    ? 'from-amber-500/25 via-emerald-500/15 to-transparent'
    : 'from-rose-500/20 via-amber-500/10 to-transparent';

  const badgeIcon = state === 'welcome'
    ? <ShieldCheck className="w-4 h-4 text-emerald-400" />
    : state === 'success'
    ? <CheckCircle2 className="w-4 h-4 text-amber-400" />
    : <AlertTriangle className="w-4 h-4 text-rose-400" />;

  const lottieUrl = customUrl || MASCOT_LOTTIE_URLS[state];

  const handleRestart = () => {
    setKey((prev) => prev + 1);
  };

  const numericSize = typeof size === 'number' ? size : 210;

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0B0E14] border border-[#1E2638] shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Background Radial Glow */}
      <div
        className={`absolute inset-0 bg-radial ${accentGlow} opacity-60 pointer-events-none rounded-3xl blur-2xl`}
      />

      {/* Decorative Gold Header Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-emerald-400 rounded-t-3xl" />

      {/* Top Status Badge */}
      {showStatusBadge && (
        <div className="flex items-center justify-between w-full mb-3 z-10">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-md ${badgeColor}`}
          >
            {badgeIcon}
            <span>{badgeText}</span>
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

      {/* Mascot / App Icon Visual Container */}
      <div className="relative z-10 flex items-center justify-center my-3 group">
        {/* Soft Halo Glow Ring */}
        <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-emerald-500/25 via-[#06b6d4]/20 to-transparent blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

        {/* 1. Custom 3D-Effect Glassmorphic Icon for Welcome state */}
        {state === 'welcome' || !lottieUrl ? (
          <div 
            key={key}
            className="relative transform transition-all duration-500 group-hover:scale-105 animate-scale-up drop-shadow-[0_20px_35px_rgba(6,182,212,0.3)]"
          >
            <div className="p-2 rounded-3xl bg-slate-900/40 border border-emerald-500/30 backdrop-blur-md shadow-2xl">
              <AssetDoctorIcon size={numericSize} />
            </div>
            {/* Subtle floating sparkles indicator */}
            <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md text-emerald-400 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        ) : !hasPlayerError ? (
          <div key={key}>
            <Player
              autoplay={autoplay}
              loop={loop}
              src={lottieUrl}
              style={{ width: `${numericSize}px`, height: `${numericSize}px` }}
              onEvent={(e) => {
                if (e === 'error') setHasPlayerError(true);
              }}
              className="drop-shadow-2xl transition-transform duration-300 transform group-hover:scale-105"
            />
          </div>
        ) : (
          /* Fallback Glassmorphic Icon */
          <div className="p-2 rounded-3xl bg-slate-900/40 border border-emerald-500/30 backdrop-blur-md shadow-2xl animate-fade-in">
            <AssetDoctorIcon size={numericSize} />
          </div>
        )}
      </div>

      {/* Personalized Title & Captions with Entry Pop-in */}
      <div className="text-center z-10 space-y-1.5 mt-2 animate-fade-in">
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight flex items-center justify-center gap-2">
          <span>{title}</span>
        </h3>
        <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
          {caption || subtitle}
        </p>
      </div>

      {/* Premium Card Footer Branding */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-[11px] text-slate-400 z-10 font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>🛡️ 100% Encrypted by AssetDoctor Core</span>
        </span>
        <span className="text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[9px] uppercase tracking-widest font-black">
          WELCOME
        </span>
      </div>
    </div>
  );
};
