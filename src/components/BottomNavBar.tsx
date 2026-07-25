import React from 'react';
import { LayoutDashboard, ShieldCheck, ScanText, User, Sparkles } from 'lucide-react';

export type NavTab = 'dashboard' | 'vault' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenOCR: () => void;
  expiringSoonCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  onOpenOCR,
  expiringSoonCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0E14]/90 backdrop-blur-xl border-t border-[#1E2638] px-3 py-2 shadow-2xl transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        
        {/* 1. Dashboard Tab */}
        <button
          onClick={() => onChangeTab('dashboard')}
          id="bottom-nav-dashboard-tab"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
            activeTab === 'dashboard'
              ? 'text-[#10B981] font-extrabold'
              : 'text-slate-400 hover:text-slate-200 font-semibold'
          }`}
        >
          {activeTab === 'dashboard' && (
            <span className="absolute -top-2 w-8 h-1 rounded-full bg-[#10B981] shadow-[0_0_12px_#10B981]" />
          )}
          <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#10B981]/15 scale-110' : ''}`}>
            <LayoutDashboard className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
        </button>

        {/* 2. Vault (Assets) Tab */}
        <button
          onClick={() => onChangeTab('vault')}
          id="bottom-nav-vault-tab"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
            activeTab === 'vault'
              ? 'text-[#10B981] font-extrabold'
              : 'text-slate-400 hover:text-slate-200 font-semibold'
          }`}
        >
          {activeTab === 'vault' && (
            <span className="absolute -top-2 w-8 h-1 rounded-full bg-[#10B981] shadow-[0_0_12px_#10B981]" />
          )}
          <div className={`p-1.5 rounded-xl transition-all relative ${activeTab === 'vault' ? 'bg-[#10B981]/15 scale-110' : ''}`}>
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            {expiringSoonCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse border-2 border-[#0B0E14]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Vault</span>
        </button>

        {/* 3. Center Floating Scan (OCR) Button */}
        <div className="flex flex-col items-center justify-center -mt-5">
          <button
            onClick={onOpenOCR}
            id="bottom-nav-scan-ocr-btn"
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#10B981] via-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-[#10B981]/30 hover:scale-110 active:scale-95 transition-all cursor-pointer border-4 border-[#0B0E14] group"
            title="Scan New Document or Invoice"
          >
            <ScanText className="w-6 h-6 stroke-[2.5] group-hover:rotate-12 transition-transform" />
          </button>
          <span className="text-[10px] font-extrabold text-[#10B981] mt-0.5 tracking-tight flex items-center gap-0.5">
            <span>Scan</span>
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          </span>
        </div>

        {/* 4. Profile Tab */}
        <button
          onClick={() => onChangeTab('profile')}
          id="bottom-nav-profile-tab"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
            activeTab === 'profile'
              ? 'text-[#10B981] font-extrabold'
              : 'text-slate-400 hover:text-slate-200 font-semibold'
          }`}
        >
          {activeTab === 'profile' && (
            <span className="absolute -top-2 w-8 h-1 rounded-full bg-[#10B981] shadow-[0_0_12px_#10B981]" />
          )}
          <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-[#10B981]/15 scale-110' : ''}`}>
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
        </button>

      </div>
    </nav>
  );
};
