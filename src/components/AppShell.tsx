import React, { useState } from 'react';
import { 
  Home, 
  ShieldAlert, 
  User, 
  Camera, 
  Bell, 
  PlusCircle,
  Search
} from 'lucide-react';

interface AppShellProps {
  children?: React.ReactNode;
  onQuickScan?: () => void;
  onOpenNotifications?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ 
  children, 
  onQuickScan,
  onOpenNotifications,
  activeTab: externalActiveTab,
  onTabChange
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState('dashboard');
  const activeTab = externalActiveTab || internalActiveTab;

  const handleTabClick = (tab: string) => {
    setInternalActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* ========================================================= */}
      {/* 1. TOP BAR (Header with Safe Area Top + Camera Trigger)   */}
      {/* ========================================================= */}
      <header 
        className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 fixed top-0 left-0 z-40 px-4 flex items-center justify-between"
        style={{ paddingTop: 'calc(var(--sat, 0px) + 0.75rem)', paddingBottom: '0.75rem' }}
      >
        {/* App Logo & Name */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="font-extrabold text-white text-lg">A</span>
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Asset<span className="text-cyan-400">Doctor</span>
          </span>
        </div>

        {/* Quick Actions (Right Top) */}
        <div className="flex items-center space-x-3">
          {/* Quick Scan Camera Button */}
          <button
            onClick={onQuickScan}
            aria-label="Quick Scan"
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white px-3 py-1.5 rounded-full font-medium text-xs shadow-md shadow-cyan-500/20 transition-all duration-150 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Scan</span>
          </button>

          {/* Notification Button */}
          <button 
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA (Scrollable & Padded for Bars)           */}
      {/* ========================================================= */}
      <main 
        className="flex-1 overflow-y-auto no-scrollbar px-4"
        style={{ 
          paddingTop: 'calc(var(--sat, 0px) + 4rem)', 
          paddingBottom: 'calc(var(--sab, 0px) + 5rem)' 
        }}
      >
        <div className="max-w-md mx-auto py-4">
          {children}
        </div>
      </main>

      {/* ========================================================= */}
      {/* 2. BOTTOM NAVIGATION BAR (Thumb Zone + Floating Trigger)  */}
      {/* ========================================================= */}
      <nav 
        className="w-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/80 fixed bottom-0 left-0 z-40 px-4"
        style={{ paddingBottom: 'calc(var(--sab, 0px) + 0.5rem)', paddingTop: '0.5rem' }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between relative px-2">
          
          {/* Dashboard */}
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`flex flex-col items-center justify-center w-14 py-1 transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Home</span>
          </button>

          {/* Warranties */}
          <button
            onClick={() => handleTabClick('warranties')}
            className={`flex flex-col items-center justify-center w-14 py-1 transition-all cursor-pointer ${
              activeTab === 'warranties' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Warranties</span>
          </button>

          {/* Center Elevated Action Button (Primary Scan) */}
          <div className="relative -top-5">
            <button
              onClick={onQuickScan}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40 active:scale-90 transition-transform duration-150 border-4 border-slate-950 cursor-pointer"
            >
              <PlusCircle className="w-7 h-7" />
            </button>
          </div>

          {/* Search / Filter */}
          <button
            onClick={() => handleTabClick('search')}
            className={`flex flex-col items-center justify-center w-14 py-1 transition-all cursor-pointer ${
              activeTab === 'search' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Search</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center justify-center w-14 py-1 transition-all cursor-pointer ${
              activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </button>

        </div>
      </nav>

    </div>
  );
};

export default AppShell;
