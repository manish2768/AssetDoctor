import React, { useState } from 'react';
import { DocGearMascot, MascotState, MASCOT_LOTTIE_URLS, MASCOT_STATE_CONFIG } from './DocGearMascot';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowLeft,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Zap,
  Crown
} from 'lucide-react';

interface MascotDemoPageProps {
  onBackToApp?: () => void;
}

export const MascotDemoPage: React.FC<MascotDemoPageProps> = ({ onBackToApp }) => {
  const [activeState, setActiveState] = useState<MascotState>('welcome');
  const [isLoop, setIsLoop] = useState<boolean>(true);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [mascotSize, setMascotSize] = useState<number>(280);
  const [customCaption, setCustomCaption] = useState<string>('');
  const [urlOverrides, setUrlOverrides] = useState<Record<MascotState, string>>({ ...MASCOT_LOTTIE_URLS });

  const statesList: MascotState[] = ['welcome', 'success', 'error'];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans p-4 sm:p-6 md:p-10 relative overflow-hidden selection:bg-[#D4AF37] selection:text-slate-950">
      
      {/* Background Decorative Metallic Gold & Emerald Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">

        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2638]">
          <div className="flex items-center gap-3">
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="p-2.5 rounded-2xl bg-[#121824] hover:bg-[#1A2234] text-slate-300 hover:text-white border border-[#2A344A] transition-all cursor-pointer group shadow-lg"
                title="Return to Main Application"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] via-amber-400 to-emerald-400 text-slate-950 p-0.5 shadow-xl shadow-amber-500/10">
                <div className="w-full h-full bg-[#0B0E14] rounded-[14px] flex items-center justify-center text-amber-300">
                  <Bot className="w-7 h-7 stroke-[2.5]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    DocGear <span className="text-[#D4AF37]">Mascot</span> Studio
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Lottie Preview
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deep Obsidian Canvas • Emerald Green & Metallic Gold Theme
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Back to AssetDoctor</span>
            </button>
          )}
        </div>

        {/* State Selection Tabs */}
        <div className="p-2 rounded-2xl bg-[#121824] border border-[#1E2638] flex flex-wrap items-center gap-2 shadow-xl">
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Crown className="w-4 h-4" />
            <span>Select State:</span>
          </div>

          {statesList.map((state) => {
            const isActive = activeState === state;
            const config = MASCOT_STATE_CONFIG[state];

            return (
              <button
                key={state}
                onClick={() => setActiveState(state)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-emerald-500/20 text-white border-[#D4AF37]/60 shadow-lg shadow-amber-500/10'
                    : 'bg-[#0B0E14] text-slate-400 hover:text-white border-[#1E2638] hover:border-slate-700'
                }`}
              >
                {config.icon}
                <span className="capitalize">{state} Bot</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left / Primary Active Showcase Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-[#0F141F] border border-[#222C40] shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Active Focus View
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Size: {mascotSize}px
                </span>
              </div>

              <DocGearMascot
                state={activeState}
                size={mascotSize}
                loop={isLoop}
                autoplay={isAutoplay}
                caption={customCaption || undefined}
                customUrl={urlOverrides[activeState]}
                className="w-full"
              />
            </div>

            {/* Custom Caption / Overrides Box */}
            <div className="p-5 rounded-2xl bg-[#121824] border border-[#1E2638] space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Customize Mascot Subtitle / Caption:</span>
                <span className="text-[10px] text-slate-500">Optional</span>
              </label>
              <input
                type="text"
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                placeholder={`Default: "${MASCOT_STATE_CONFIG[activeState].subtitle}"`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E14] border border-[#2A344A] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
              />

              {/* Lottie URL Config */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Remote Lottie JSON URL ({activeState}):</span>
                  <a
                    href={urlOverrides[activeState]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    Open URL <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </label>
                <input
                  type="text"
                  value={urlOverrides[activeState]}
                  onChange={(e) =>
                    setUrlOverrides({
                      ...urlOverrides,
                      [activeState]: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0E14] border border-[#2A344A] text-[11px] font-mono text-slate-300 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right / Animation Controls & Side-by-Side Cards */}
          <div className="lg:col-span-5 space-y-6">

            {/* Interactive Player Controls */}
            <div className="p-5 rounded-3xl bg-[#121824] border border-[#1E2638] shadow-xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Animation Controls
              </h3>

              <div className="space-y-3">
                {/* Loop Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0E14] border border-[#2A344A]">
                  <span className="text-xs font-bold text-slate-200">Loop Animation</span>
                  <button
                    onClick={() => setIsLoop(!isLoop)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isLoop
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isLoop ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Autoplay Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0E14] border border-[#2A344A]">
                  <span className="text-xs font-bold text-slate-200">Autoplay</span>
                  <button
                    onClick={() => setIsAutoplay(!isAutoplay)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isAutoplay
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isAutoplay ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Size Slider */}
                <div className="p-3 rounded-xl bg-[#0B0E14] border border-[#2A344A] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">Mascot Canvas Size</span>
                    <span className="font-mono text-[#D4AF37]">{mascotSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="400"
                    step="10"
                    value={mascotSize}
                    onChange={(e) => setMascotSize(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Quick Preview Grid of all 3 States Side-by-Side */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
                All 3 States At A Glance
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {statesList.map((state) => (
                  <div
                    key={state}
                    onClick={() => setActiveState(state)}
                    className={`p-3 rounded-2xl bg-[#0B0E14] border transition-all cursor-pointer flex items-center gap-3 ${
                      activeState === state
                        ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 bg-amber-500/5'
                        : 'border-[#1E2638] hover:border-slate-700'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl bg-[#121824] flex items-center justify-center shrink-0 border border-[#2A344A]">
                      <DocGearMascot
                        state={state}
                        size={56}
                        showStatusBadge={false}
                        className="p-0 border-none bg-transparent shadow-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white capitalize block">
                        {state} State
                      </span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">
                        {MASCOT_STATE_CONFIG[state].badgeText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Color Palette Information Box */}
        <div className="p-5 rounded-3xl bg-[#0F141F] border border-[#222C40] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-emerald-400 text-slate-950">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-white block">Refined Color Palette Spec:</span>
              <span>Deep Obsidian (#0B0E14) • Emerald Green (#10B981) • Metallic Gold (#D4AF37)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#0B0E14] border border-slate-700" title="Obsidian #0B0E14" />
            <span className="w-4 h-4 rounded-full bg-[#10B981]" title="Emerald Green #10B981" />
            <span className="w-4 h-4 rounded-full bg-[#D4AF37]" title="Metallic Gold #D4AF37" />
          </div>
        </div>

      </div>
    </div>
  );
};
