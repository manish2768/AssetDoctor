import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Check, Share, PlusSquare } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running as PWA standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    if ((window as any).deferredPwaPrompt) {
      setDeferredPrompt((window as any).deferredPwaPrompt);
      setIsVisible(true);
    }

    // Check if user previously dismissed prompt in this session
    const isDismissed = sessionStorage.getItem('assetDoctor_pwa_dismissed');
    if (isDismissed) return;

    // Listen for Chrome / Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPwaPrompt = e;
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner by default for mobile / desktop after brief delay if not installed
    const timer = setTimeout(() => {
      if (!isStandalone && !sessionStorage.getItem('assetDoctor_pwa_dismissed')) {
        setIsVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPwaPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice?.outcome === 'accepted') {
        setIsVisible(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      (window as any).deferredPwaPrompt = null;
    } else {
      // Fallback instructions for iOS or browsers without native prompt
      setShowInstructionsModal(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('assetDoctor_pwa_dismissed', 'true');
  };

  if (isInstalled || !isVisible) return null;

  return (
    <>
      {/* Floating Bottom PWA Install Banner */}
      <div className="fixed bottom-24 left-4 right-4 z-50 max-w-lg mx-auto bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 rounded-3xl p-3.5 sm:p-4 shadow-2xl shadow-slate-950/80 animate-fade-in flex items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 shadow-md shrink-0">
            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
              <span className="truncate">Add AssetDoctor to Home Screen</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase shrink-0">
                App
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              Instant 1-click warranty vault & emergency assistance access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95 shrink-0"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Manual Instructions Modal for Safari/iOS */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
              <Share className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                How to Install AssetDoctor
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Follow these simple steps on your browser menu to add AssetDoctor as a web app:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>Tap the <strong>Share</strong> icon (iOS Safari) or <strong>Three Dots</strong> menu (Chrome).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>Scroll down and select <strong>'Add to Home Screen'</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-teal-400" />).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>Tap <strong>Add</strong> to place AssetDoctor directly on your home screen!</span>
              </div>
            </div>

            <button
              onClick={() => setShowInstructionsModal(false)}
              className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
