import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Database, 
  Lock, 
  UserCheck, 
  Mail, 
  Globe, 
  FileCheck2, 
  BellRing, 
  ExternalLink,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-500/30 relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Privacy Policy for AssetDoctor</h2>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span>Last Updated:</span>
                <span className="text-emerald-400 font-semibold">July 2026</span>
              </p>
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
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-xs text-slate-300 leading-relaxed">
          
          {/* Introductory Mission Statement Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-200 leading-relaxed">
              At <strong className="text-emerald-300">AssetDoctor</strong> (accessible via <a href="https://assetdoctor.in" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">assetdoctor.in</a>), your privacy is our top priority. This Privacy Policy explains how we collect, use, and protect your personal information when you use our Asset, Warranty, and Insurance Tracking services.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-extrabold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4 text-teal-400" />
              <span>1. Information We Collect</span>
            </div>
            <p className="text-slate-300">
              We only collect information that is essential to provide you with seamless asset tracking features:
            </p>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white font-semibold">Personal Information:</strong> Name, Email Address, and Contact Details when you register or contact support.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white font-semibold">Asset Data:</strong> Details about your assets, appliances, vehicles, warranties, purchase dates, serial numbers, and uploaded invoice images/documents.
                </div>
              </li>
            </ul>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-extrabold text-xs uppercase tracking-wider">
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>2. How We Use Your Information</span>
            </div>
            <p className="text-slate-300">
              Your data is strictly used to enhance your app experience:
            </p>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>To calculate warranty expiration dates and send timely alert notifications (<strong className="text-emerald-400">Green</strong>/<strong className="text-amber-400">Amber</strong>/<strong className="text-red-400">Red</strong> alerts).</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>To display your digital invoice vault and enable fast access during service or claims.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>To assist you with relevant emergency helpline contacts when needed.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Data Protection & Security */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-extrabold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>3. Data Protection & Security</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1">
                <strong className="text-emerald-300 font-bold block">Zero Third-Party Selling</strong>
                <p className="text-[11px] text-slate-300">
                  We never sell, trade, or rent your personal data or uploaded documents to any third-party marketing companies.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl space-y-1">
                <strong className="text-teal-300 font-bold block">Secure Storage</strong>
                <p className="text-[11px] text-slate-300">
                  All uploaded bills, invoices, and personal details are encrypted and stored securely in your private vault.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: User Rights & Control */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-xs uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>4. User Rights & Control</span>
            </div>
            <p className="text-slate-300">
              You have full control over your data:
            </p>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-2.5">
              <FileCheck2 className="w-5 h-5 text-blue-400 shrink-0" />
              <span className="text-xs text-slate-200">
                You can view, edit, or delete your assets, bills, and account details at any time directly within the app.
              </span>
            </div>
          </div>

          {/* Section 5: Contact Us */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>5. Contact Us</span>
            </div>
            <p className="text-xs text-slate-300">
              If you have any questions or concerns regarding this Privacy Policy, feel free to reach out to us:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="mailto:support@assetdoctor.in"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
              >
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Email</span>
                  <span className="text-xs font-bold text-white">support@assetdoctor.in</span>
                </div>
              </a>

              <a
                href="https://assetdoctor.in"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
              >
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Website</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    assetdoctor.in <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Guarantee Footer Badge */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AssetDoctor Privacy Guarantee
            </span>
            <span className="text-slate-500">Effective: July 2026</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
