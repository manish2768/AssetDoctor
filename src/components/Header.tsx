import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  ScanText, 
  Sparkles, 
  Download, 
  Bell, 
  PhoneCall, 
  User, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  KeyRound, 
  Settings, 
  MapPin, 
  Info, 
  HelpCircle, 
  X,
  ChevronRight,
  LogOut,
  Bot
} from 'lucide-react';
import { AssetDoctorLogo } from './AssetDoctorLogo';
import { formatINR } from '../utils/assetUtils';

interface HeaderProps {
  isLoggedIn?: boolean;
  totalValuation: number;
  totalAssetsCount: number;
  expiringSoonCount: number;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  userLocation?: string;
  onOpenOCR: () => void;
  onOpenAddModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenUpdatePhoneModal?: () => void;
  onOpenUpdateEmailModal?: () => void;
  onOpenLoginModal?: () => void;
  onOpenAccountSettingsModal?: () => void;
  onOpenWarrantyAlertsModal?: () => void;
  onOpenSplashScreen?: () => void;
  onOpenAboutUs?: () => void;
  onOpenContactUs?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onNavigateToProfile?: () => void;
  onOpenLandingPage?: () => void;
  onExportVault: () => void;
  onScrollToAlerts: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = true,
  totalValuation,
  totalAssetsCount,
  expiringSoonCount,
  userName = 'Manish',
  userPhone = '+91 98765 43210',
  userEmail = 'manish2768@gmail.com',
  userLocation = 'Lucknow, Uttar Pradesh',
  onOpenOCR,
  onOpenAddModal,
  onOpenEmergencyModal,
  onOpenUpdatePhoneModal,
  onOpenUpdateEmailModal,
  onOpenLoginModal,
  onOpenAccountSettingsModal,
  onOpenWarrantyAlertsModal,
  onOpenSplashScreen,
  onOpenAboutUs,
  onOpenContactUs,
  onOpenPrivacyPolicy,
  onNavigateToProfile,
  onOpenLandingPage,
  onExportVault,
  onScrollToAlerts,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 transition-all shadow-xl shadow-slate-950/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Logo & Name */}
        <div 
          onClick={onOpenSplashScreen}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="AssetDoctor Home"
        >
          <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-wide flex items-center gap-1.5">
              <span>Asset<span className="text-teal-400">Doctor</span></span>
              <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Vault
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Smart Care & Warranty Vault</p>
          </div>
        </div>

        {/* Center / Desktop Stats Bar */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-2xl">
          <div className="text-xs">
            <span className="text-slate-500 font-semibold block text-[10px]">TOTAL VALUE</span>
            <span className="text-emerald-400 font-bold font-mono">{formatINR(totalValuation)}</span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="text-xs">
            <span className="text-slate-500 font-semibold block text-[10px]">ASSETS</span>
            <span className="text-white font-bold">{totalAssetsCount} Items</span>
          </div>
        </div>

        {/* Right Actions & Menu */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Emergency Hotline Button */}
          <button
            onClick={onOpenEmergencyModal}
            id="header-emergency-btn"
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-500/10 active:scale-95"
            title="Emergency Hotline"
          >
            <PhoneCall className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="hidden md:inline">Emergency</span>
          </button>

          {/* Scan Document / Invoice */}
          <button
            onClick={onOpenOCR}
            id="header-scan-invoice-btn"
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Scan Invoice with OCR"
          >
            <ScanText className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Scan Invoice</span>
          </button>

          {/* Add Asset Button */}
          <button
            onClick={onOpenAddModal}
            id="header-add-asset-btn"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Add New Asset"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Add Asset</span>
          </button>

          {/* Alerts Bell */}
          <button 
            onClick={onOpenWarrantyAlertsModal || onScrollToAlerts}
            id="header-alerts-bell-btn"
            className="relative p-2 bg-slate-800 rounded-xl text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Warranty Alerts"
          >
            <Bell className={`w-5 h-5 ${expiringSoonCount > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-300'}`} />
            {expiringSoonCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                {expiringSoonCount}
              </span>
            )}
          </button>

          {/* Profile Menu Drawer Button */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              id="header-profile-menu-btn"
              className={`p-2 rounded-xl transition border cursor-pointer ${
                isProfileMenuOpen 
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 ring-2 ring-teal-500/30' 
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="Profile & Settings Menu"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Profile Drawer / Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
                
                {/* User Header */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-base shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white truncate">{userName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
                    <p className="text-[10px] text-teal-400 font-mono font-medium truncate">{userPhone}</p>
                  </div>
                </div>

                {/* Account & Security Options */}
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-2">
                    Account & Security
                  </span>

                  {onOpenAccountSettingsModal && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenAccountSettingsModal();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings className="w-4 h-4 text-teal-400" />
                        <span>Account Settings & Password</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                    </button>
                  )}

                  {onOpenUpdatePhoneModal && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenUpdatePhoneModal();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-teal-400" />
                        <span>Update Phone Number</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                    </button>
                  )}

                  {onOpenUpdateEmailModal && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenUpdateEmailModal();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <span>Update Email Address</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                    </button>
                  )}

                  {isLoggedIn && onLogout ? (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      id="header-signout-btn"
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer group mt-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out / Log Out</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition" />
                    </button>
                  ) : onOpenLoginModal ? (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenLoginModal();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <KeyRound className="w-4 h-4 text-amber-400" />
                        <span>Sign In / Forgot Password</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                    </button>
                  ) : null}
                </div>

                {/* Quick Info & Backup Options */}
                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-2">
                    Pages & Vault Tools
                  </span>

                  {onOpenLandingPage && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenLandingPage();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Public Landing Page</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                    </button>
                  )}

                  {onOpenAboutUs && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenAboutUs();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Info className="w-4 h-4 text-emerald-400" />
                        <span>About AssetDoctor</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                    </button>
                  )}

                  {onOpenContactUs && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenContactUs();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-blue-400" />
                        <span>Contact Support</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                    </button>
                  )}

                  {onOpenPrivacyPolicy && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenPrivacyPolicy();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-teal-400" />
                        <span>Privacy Policy</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onExportVault();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Download className="w-4 h-4 text-purple-400" />
                      <span>Export Vault Backup JSON</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      id="header-logout-btn"
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer group mt-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Log Out of Account</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition" />
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};


