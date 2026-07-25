import React, { useState, useEffect } from 'react';
import { Fingerprint, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

interface BiometricAuthProps {
  onAuthenticated: () => void;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({ onAuthenticated }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    // Check if device supports WebAuthn / Biometrics
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => setIsSupported(available))
        .catch(() => setIsSupported(false));
    }
  }, []);

  // Trigger Biometric Scan (FaceID / Fingerprint)
  const handleBiometricAuth = async () => {
    setAuthenticating(true);
    setErrorMsg('');

    try {
      if (!isSupported) {
        // Fallback for demo/unsupported browsers
        setTimeout(() => {
          setAuthenticating(false);
          onAuthenticated();
        }, 1000);
        return;
      }

      // WebAuthn Challenge Request
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const options: CredentialRequestOptions = {
        publicKey: {
          challenge: challenge,
          timeout: 60000,
          userVerification: "required"
        }
      };

      await navigator.credentials.get(options);
      setAuthenticating(false);
      onAuthenticated();
    } catch (err) {
      console.error("Biometric authentication failed:", err);
      setAuthenticating(false);
      setErrorMsg('Authentication failed. Please try again or enter PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-8 text-slate-100 select-none">
      
      {/* Top Security Badge */}
      <div 
        className="flex items-center space-x-2 text-cyan-400"
        style={{ paddingTop: 'calc(var(--sat, 0px) + 1.5rem)' }}
      >
        <ShieldCheck className="w-5 h-5" />
        <span className="text-xs font-semibold uppercase tracking-widest">
          AES-256 Protected Vault
        </span>
      </div>

      {/* Center Biometric Prompt */}
      <div className="flex flex-col items-center max-w-xs text-center my-auto">
        <div className="relative mb-6">
          <button
            onClick={handleBiometricAuth}
            disabled={authenticating}
            className={`w-28 h-28 rounded-3xl bg-slate-900 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-2xl shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer ${
              authenticating ? 'animate-pulse border-cyan-400' : 'hover:border-cyan-400'
            }`}
          >
            <Fingerprint className="w-16 h-16" />
          </button>
          
          <div className="absolute -bottom-2 -right-2 bg-slate-950 p-1.5 rounded-full border border-slate-800">
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">AssetDoctor Locked</h2>
        <p className="text-xs text-slate-400 mb-4">
          {isSupported 
            ? 'Touch the fingerprint sensor or use Face ID to unlock your bills.'
            : 'Click fingerprint icon below to simulate device unlock.'}
        </p>

        {errorMsg && (
          <div className="flex items-center space-x-1.5 text-xs text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div 
        className="w-full max-w-xs"
        style={{ paddingBottom: 'calc(var(--sab, 0px) + 1.5rem)' }}
      >
        <button
          onClick={handleBiometricAuth}
          className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
        >
          {authenticating ? 'Authenticating...' : 'Unlock with Biometrics'}
        </button>
      </div>

    </div>
  );
};

export default BiometricAuth;
