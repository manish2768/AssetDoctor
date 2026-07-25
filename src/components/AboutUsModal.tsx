import React from 'react';
import { 
  X, 
  Lightbulb, 
  Target, 
  FileText, 
  Bell, 
  Siren, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Heart,
  ExternalLink,
  Award,
  CheckCircle2
} from 'lucide-react';
import { AssetDoctorLogo } from './AssetDoctorLogo';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-500/30 relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <AssetDoctorLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">About AssetDoctor</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Smart Health & Care
                </span>
              </div>
              <p className="text-xs text-slate-400">The Ultimate Household Asset & Warranty Protection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* 🌟 1. PROMINENT INSPIRATIONAL ORIGIN SECTION & FOUNDER SPOTLIGHT */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-emerald-950/60 p-6 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10">
            {/* Ambient Background Badge */}
            <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Young Innovator &amp; Founder Spotlight</span>
              </div>
              <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Aged 14 • Visionary
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 font-black text-xl">
                <Lightbulb className="w-8 h-8 text-slate-950" />
              </div>

              <div className="space-y-3 flex-1">
                <h3 className="text-lg font-black text-amber-300 tracking-tight">
                  The Story &amp; Vision of Ashutosh Rai
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <strong>Ashutosh Rai</strong>, a 14-year-old student and tech-enthusiast, founded <strong>AssetDoctor (ServiVault)</strong> to solve a problem that plagues millions of households: lost paper invoices, expired warranties, and misplaced vehicle documents.
                </p>
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30 text-amber-100 text-xs italic leading-relaxed shadow-inner">
                  <div className="flex items-center gap-2 mb-1.5 text-amber-400 font-semibold not-italic">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                    <span>The Founding Vision</span>
                  </div>
                  &ldquo;Every family deserves a <strong>&apos;Smart Health &amp; Care Card&apos;</strong> for their valuable possessions. No more losing money on repairs or hunting for invoices when things break down.&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* 🎯 2. OUR MISSION */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Our Mission</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              To provide families with an effortless, secure, and automated way to store invoices, track warranty expirations (<span className="text-emerald-400 font-semibold">Green</span> / <span className="text-amber-400 font-semibold">Amber</span> / <span className="text-red-400 font-semibold">Red</span> alerts), and access 1-click emergency contacts when things go wrong.
            </p>
          </div>

          {/* 🚀 3. CORE FEATURES */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Core Features & Platform Value
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Feature 1 */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 hover:border-emerald-500/40 transition group">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 w-fit mb-2.5 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">📄 Digital Vault</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Instant invoice scanning & bill organization. Store serial numbers, bills, and warranty proofs safely in one place.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 hover:border-emerald-500/40 transition group">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 w-fit mb-2.5 group-hover:scale-110 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">⏰ Smart Expiry Alerts</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Never miss a warranty or policy renewal. Receive automated visual indicators and notifications before warranties expire.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 hover:border-emerald-500/40 transition group">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 w-fit mb-2.5 group-hover:scale-110 transition-transform">
                  <Siren className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">🚨 1-Click Emergency</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Instant helpline access for vehicles & home appliances. Quick roadside breakdown dialing and insurance policy lookups.
                </p>
              </div>
            </div>
          </div>

          {/* 📞 4. CONTACT SUPPORT BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Support</span>
                <p className="text-xs font-extrabold text-white">Hansgeetglobal@gmail.com</p>
              </div>
            </div>

            <a
              href="mailto:Hansgeetglobal@gmail.com"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Email Us</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Trust Footer */}
          <div className="text-xs text-slate-400 space-y-1 border-t border-slate-800 pt-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> AssetDoctor Smart Asset Protection
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for every family asset
            </span>
          </div>

        </div>

        {/* Bottom Close Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
