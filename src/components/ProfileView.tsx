import React, { useState, useEffect } from 'react';
import { 
  User, 
  Smartphone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Settings, 
  Download, 
  PhoneCall, 
  HelpCircle, 
  Info, 
  Lock, 
  ChevronRight, 
  Sparkles, 
  Bot, 
  ExternalLink,
  Crown,
  Bell,
  CheckCircle2,
  FileSpreadsheet,
  DownloadCloud,
  LogOut
} from 'lucide-react';
import { formatINR } from '../utils/assetUtils';

interface ProfileViewProps {
  userName?: string;
  userPhone: string;
  userEmail: string;
  userLocation: string;
  totalAssetsCount: number;
  totalValuation: number;
  expiringSoonCount: number;
  onOpenUpdatePhoneModal: () => void;
  onOpenUpdateEmailModal: () => void;
  onOpenAccountSettingsModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenWarrantyAlertsModal: () => void;
  onOpenAboutUs: () => void;
  onOpenContactUs: () => void;
  onOpenPrivacyPolicy: () => void;
  onExportVault: () => void;
  onOpenOnboarding?: () => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName = 'Asset Vault Owner',
  userPhone,
  userEmail,
  userLocation,
  totalAssetsCount,
  totalValuation,
  expiringSoonCount,
  onOpenUpdatePhoneModal,
  onOpenUpdateEmailModal,
  onOpenAccountSettingsModal,
  onOpenEmergencyModal,
  onOpenWarrantyAlertsModal,
  onOpenAboutUs,
  onOpenContactUs,
  onOpenPrivacyPolicy,
  onExportVault,
  onOpenOnboarding,
  onLogout,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPwaPrompt = e;
    };

    if ((window as any).deferredPwaPrompt) {
      setDeferredPrompt((window as any).deferredPwaPrompt);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPwaPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      setDeferredPrompt(null);
      (window as any).deferredPwaPrompt = null;
    } else {
      alert('To install AssetDoctor as a PWA app:\n\n1. On Mobile: Tap your browser share/menu button -> select "Add to Home Screen".\n2. On Desktop Chrome/Edge: Click the Install icon in the address bar.');
    }
  };

  return (

    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Profile Card Header */}
      <div className="p-6 rounded-3xl bg-[#0F141F] border border-[#222C40] shadow-2xl relative overflow-hidden">
        {/* Background Accent Lights */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#10B981]/15 via-[#D4AF37]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
          {/* Avatar with Metallic Border */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#10B981] via-teal-400 to-[#D4AF37] p-0.5 shadow-xl shadow-[#10B981]/20">
              <div className="w-full h-full bg-[#0B0E14] rounded-[14px] flex items-center justify-center text-[#10B981]">
                <User className="w-10 h-10 stroke-[2.2]" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#10B981] text-slate-950 flex items-center justify-center border-2 border-[#0B0E14] shadow">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-wide">
                {userName || 'Asset Vault Owner'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D4AF37]/15 text-amber-300 border border-[#D4AF37]/30 flex items-center gap-1">
                <Crown className="w-3 h-3 text-[#D4AF37]" /> Verified Vault
              </span>
            </div>

            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{userLocation}</span>
            </p>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              {(!userPhone || userPhone.includes('00000') || userPhone.toLowerCase().includes('not set')) ? (
                <button
                  onClick={onOpenUpdatePhoneModal}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Save Phone Number</span>
                </button>
              ) : (
                <button
                  onClick={onOpenUpdatePhoneModal}
                  className="px-3 py-1.5 rounded-xl bg-[#0B0E14] hover:bg-[#161D2B] border border-[#2A344A] text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 cursor-pointer group"
                  title="Click to Change Phone Number"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{userPhone}</span>
                  <span className="text-[10px] font-sans text-slate-500 group-hover:text-slate-300">(Change)</span>
                </button>
              )}

              <button
                onClick={onOpenUpdateEmailModal}
                className="px-3 py-1.5 rounded-xl bg-[#0B0E14] hover:bg-[#161D2B] border border-[#2A344A] text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 cursor-pointer group"
              >
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>{userEmail || 'Add Email Address'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vault Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#1E2638]">
          <div className="p-3 rounded-2xl bg-[#0B0E14] border border-[#222C40] text-center">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block">Total Vault Assets</span>
            <span className="text-lg font-black text-white font-mono">{totalAssetsCount} Items</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B0E14] border border-[#222C40] text-center">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block">Total Asset Value</span>
            <span className="text-lg font-black text-[#10B981] font-mono">{formatINR(totalValuation)}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-[#0B0E14] border border-[#222C40] text-center">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block">Alerts / Expiring</span>
            <span className={`text-lg font-black font-mono ${expiringSoonCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`}>
              {expiringSoonCount} Expiring
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Security Verification Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#10B981]/10 via-[#0F141F] to-[#0F141F] border border-[#10B981]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 shrink-0">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-black uppercase text-white tracking-wider">
                End-to-End Encrypted & Offline Private
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                AES-256
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              All invoices, warranties, and serial numbers are stored locally on your device via IndexedDB. Zero cloud leaks.
            </p>
          </div>
        </div>
      </div>

      {/* Account & Security Menu Section */}
      <div className="p-5 rounded-3xl bg-[#0F141F] border border-[#222C40] space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37] px-1 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Security & Account
        </h3>

        <div className="space-y-2">
          {/* Account Settings */}
          <button
            onClick={onOpenAccountSettingsModal}
            className="w-full p-3.5 rounded-2xl bg-[#0B0E14] hover:bg-[#161D2B] border border-[#222C40] hover:border-slate-700 text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-[#10B981] transition-colors">
                  Account Preferences
                </span>
                <span className="text-[10px] text-slate-400">Manage location, notifications & dark mode</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>

          {/* Warranty Alerts Modal */}
          <button
            onClick={onOpenWarrantyAlertsModal}
            className="w-full p-3.5 rounded-2xl bg-[#0B0E14] hover:bg-[#161D2B] border border-[#222C40] hover:border-slate-700 text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition-colors">
                  Warranty & Renewal Alerts
                </span>
                <span className="text-[10px] text-slate-400">{expiringSoonCount} items require attention</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>

          {/* Export Vault Backup */}
          <button
            onClick={onExportVault}
            className="w-full p-3.5 rounded-2xl bg-[#0B0E14] hover:bg-[#161D2B] border border-[#222C40] hover:border-slate-700 text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-[#10B981] border border-emerald-500/30">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-[#10B981] transition-colors">
                  Export Vault Backup (JSON / Excel)
                </span>
                <span className="text-[10px] text-slate-400">Download encrypted copy of all assets & bills</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Tools & Emergency */}
      <div className="p-5 rounded-3xl bg-[#0F141F] border border-[#222C40] space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#10B981] px-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Tools & Emergency
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* PWA App Installation */}
          <button
            onClick={handleInstallClick}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-[#10B981]/40 hover:border-[#10B981] text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#10B981] text-slate-950 font-black">
                <DownloadCloud className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-emerald-300 block">
                  {isAppInstalled ? 'PWA Installed' : 'Install PWA App'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isAppInstalled ? 'Running Standalone' : 'Add to Home Screen'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition" />
          </button>

          {/* Replay Onboarding Tour */}
          <button
            onClick={onOpenOnboarding}
            className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 hover:border-[#10B981] text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0B0E14] text-[#10B981] border border-teal-500/30 font-black">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-teal-300 block">
                  Onboarding Tour
                </span>
                <span className="text-[10px] text-slate-400">Replay FTUX Tutorial</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition" />
          </button>

          {/* Emergency Hotline */}
          <button
            onClick={onOpenEmergencyModal}
            className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-500 text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500 text-white font-black">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-black text-rose-300 block">
                  Emergency Support
                </span>
                <span className="text-[10px] text-slate-400">24x7 Brand Hotline</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Help & Support / Legal Settings Section */}
      <div className="p-5 rounded-3xl bg-[#0F141F] border border-[#222C40] space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#10B981] px-1 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#10B981]" /> Help & Support / Legal
        </h3>

        <div className="space-y-2">
          {/* About Us */}
          <button
            onClick={onOpenAboutUs}
            className="w-full p-3.5 rounded-2xl bg-[#0B0E14] hover:bg-[#161D2B] border border-[#222C40] hover:border-slate-700 text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-[#10B981] border border-emerald-500/30">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-[#10B981] transition-colors">
                  About AssetDoctor
                </span>
                <span className="text-[10px] text-slate-400">App overview, architecture & features</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>

          {/* Contact Support */}
          <button
            onClick={onOpenContactUs}
            className="w-full p-3.5 rounded-2xl bg-[#0B0E14] hover:bg-[#161D2B] border border-[#222C40] hover:border-slate-700 text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-teal-300 transition-colors">
                  Contact Support & Feedback
                </span>
                <span className="text-[10px] text-slate-400">Direct assistance and feature requests</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>

          {/* Privacy Policy */}
          <button
            onClick={onOpenPrivacyPolicy}
            className="w-full p-3.5 rounded-2xl bg-[#0B0E14] hover:bg-[#161D2B] border border-[#222C40] hover:border-slate-700 text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-blue-300 transition-colors">
                  Privacy Policy & Data Guarantees
                </span>
                <span className="text-[10px] text-slate-400">Offline IndexedDB storage & security rules</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>

        </div>
      </div>

      {/* Footer Info & Version Badge */}
      <div className="p-4 rounded-2xl bg-[#0F141F] border border-[#222C40] flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#10B981]" />
          <span>AssetDoctor v2.4 • Offline Private Vault</span>
        </div>
        <span>© {new Date().getFullYear()} AssetDoctor</span>
      </div>

    </div>
  );
};
