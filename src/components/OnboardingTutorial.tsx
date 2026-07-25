import React, { useState } from 'react';
import { DocGearMascot, MascotState } from './DocGearMascot';
import { ShieldCheck, ScanText, Sparkles, ChevronRight, ChevronLeft, CheckCircle2, Lock, X } from 'lucide-react';

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface SlideData {
  title: string;
  subtitle: string;
  description: string;
  mascotState: MascotState;
  icon: React.ReactNode;
  badge: string;
  highlights: string[];
}

const ONBOARDING_SLIDES: SlideData[] = [
  {
    title: 'Smart Vault for Home & Vehicles',
    subtitle: 'Consolidate all invoices, warranties, and insurance policies in one place',
    description: 'Never search through paper drawers or buried emails again. AssetDoctor keeps your home appliances, gadgets, and vehicles organized with instant status tracking.',
    mascotState: 'welcome',
    icon: <ShieldCheck className="w-5 h-5 text-[#10B981]" />,
    badge: 'Slide 1 of 3 • Smart Asset Vault',
    highlights: [
      'Encrypted local storage with 100% offline access',
      'Track electronics, bikes, cars, and home appliances',
      'One-click WhatsApp asset detail sharing',
    ],
  },
  {
    title: 'DocGear AI Scanner & Scam Guard',
    subtitle: 'Snap bills & receipts for automatic extraction with Gemini Vision AI',
    description: 'Our intelligent scanner parses multi-item invoices from Flipkart, Amazon, Croma, or local stores in seconds, extracting serial numbers, merchant GSTIN, and prices.',
    mascotState: 'success',
    icon: <ScanText className="w-5 h-5 text-teal-400" />,
    badge: 'Slide 2 of 3 • AI Bill Extraction',
    highlights: [
      'Instant extraction of model numbers & purchase dates',
      'AI Scam Guard verifies GSTIN authenticity & price anomalies',
      'Live camera capture or file upload support',
    ],
  },
  {
    title: 'Warranty Health & Depreciation',
    subtitle: 'Automated expiration alerts & financial resale value calculations',
    description: 'DocGear proactively monitors 30-day, 60-day, and 90-day expiry windows, sending timely service reminders and tracking real-time asset resale values.',
    mascotState: 'welcome',
    icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
    badge: 'Slide 3 of 3 • Automated Protection',
    highlights: [
      'Proactive 🟢 Active, 🟡 Expiring, and 🔴 Expired status indicators',
      '1-Click service helpline & brand support directory',
      'Live financial portfolio net worth & depreciation metrics',
    ],
  },
];

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!isOpen) return null;

  const currentSlide = ONBOARDING_SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
      onClose();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0E14]/90 backdrop-blur-xl animate-fade-in">
      <div
        id="onboarding-tutorial-container"
        className="relative w-full max-w-2xl bg-[#0F141F] border border-[#222C40] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Metallic Gold Accent Border */}
        <div className="h-1.5 bg-gradient-to-r from-[#10B981] via-[#D4AF37] to-teal-400 w-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E2638] bg-[#0B0E14]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              {currentSlide.icon}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-mono">
                {currentSlide.badge}
              </span>
              <h2 className="text-sm font-extrabold text-white">
                Welcome to AssetDoctor
              </h2>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#1E2638] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Skip</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Mascot Visual Column */}
            <div className="flex justify-center order-2 md:order-1">
              <DocGearMascot
                state={currentSlide.mascotState}
                size={210}
                showStatusBadge={false}
                caption={currentSlide.subtitle}
                className="w-full max-w-xs border-[#222C40] bg-[#0B0E14]"
              />
            </div>

            {/* Content Column */}
            <div className="space-y-4 order-1 md:order-2">
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                  {currentSlide.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {currentSlide.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-2 pt-2 border-t border-[#1E2638]">
                {currentSlide.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                <span>100% Private • Offline-First Storage</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-[#1E2638] bg-[#0B0E14]/90 flex items-center justify-between gap-4">
          
          {/* Progress Indicators (Dots) */}
          <div className="flex items-center gap-2">
            {ONBOARDING_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-8 bg-gradient-to-r from-[#10B981] to-teal-400 shadow-[0_0_10px_#10B981]'
                    : 'w-2.5 bg-[#222C40] hover:bg-slate-600'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-3">
            {currentSlideIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl bg-[#161D2B] hover:bg-[#1E2638] text-slate-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] via-teal-400 to-[#D4AF37] text-slate-950 font-black text-xs shadow-lg shadow-[#10B981]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{isLastSlide ? 'Get Started Now' : 'Next'}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
