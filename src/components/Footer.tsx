import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 p-4 pb-20 text-center text-xs text-gray-400">
      
      {/* WhatsApp Direct Help Button */}
      <div className="mb-4 flex justify-center">
        <a 
          href="https://wa.me/919918288299?text=Hi%20AssetDoctor%20Team,%20I%20have%20a%20query/feedback" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full font-medium text-xs hover:bg-emerald-600/30 transition-all cursor-pointer"
        >
          💬 Report Problem / Send Feedback on WhatsApp
        </a>
      </div>

      {/* Highlighted Credit */}
      <div className="bg-slate-800/60 rounded-lg p-2 max-w-sm mx-auto border border-slate-700/50 mb-2">
        <p className="text-gray-300 font-medium">
          Conceptualized &amp; Supervised by <span className="text-emerald-400 font-bold">Ashutosh Rai</span>
        </p>
      </div>

      <p>&copy; {new Date().getFullYear()} AssetDoctor. All rights reserved.</p>
    </footer>
  );
};
