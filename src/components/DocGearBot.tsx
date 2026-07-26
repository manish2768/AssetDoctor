import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface DocGearBotProps {
  isNewUser?: boolean;
}

export const DocGearBot: React.FC<DocGearBotProps> = ({ isNewUser = false }) => {
  const { user } = useAuth();
  const [_botState] = useState<'welcome' | 'happy' | 'scanning'>('welcome');

  // User ke naam se personalized welcome greeting
  const userName = user?.displayName 
    ? user.displayName.split(' ')[0] 
    : (localStorage.getItem('assetdoctor_user_name')?.split(' ')[0] || 'Member');

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 text-center shadow-xl backdrop-blur-md relative overflow-hidden my-4">
      
      {/* Bot Animated Face & Avatar */}
      <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        {/* Outer Pulsing Glow */}
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-75"></div>
        
        {/* Bot Head Circle */}
        <div className="relative w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-300">
          
          {/* Animated SVG Face (Eyes + Smile) */}
          <svg className="w-12 h-12 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
            {/* Happy Eyes */}
            <circle cx="8.5" cy="9.5" r="1.5" />
            <circle cx="15.5" cy="9.5" r="1.5" />
            {/* Big Smiley Curve */}
            <path d="M8 13.5C8.5 15.5 10.2 17 12 17C13.8 17 15.5 15.5 16 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>

          {/* Bot Antenna Badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
          </span>
        </div>
      </div>

      {/* Dynamic Welcome Message */}
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          👋 {isNewUser ? 'Welcome to AssetDoctor' : 'Welcome Back'}, {userName}!
        </h3>
        <p className="text-xs text-emerald-400 font-medium">
          DocGear AI Assistant • Ready to scan &amp; track
        </p>
        <p className="text-sm text-slate-300 mt-2 px-2 leading-relaxed">
          &quot;I’m ready! Scan your new bill/warranty or check your expiring assets below.&quot;
        </p>
      </div>

    </div>
  );
};

export default DocGearBot;
