import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  KeyRound, 
  AlertCircle,
  Sparkles,
  Smartphone,
  MapPin
} from 'lucide-react';
import { AssetDoctorLogo } from './AssetDoctorLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userData: { name: string; email: string; phone: string; location?: string }) => void;
  canDismiss?: boolean;
  initialMode?: 'SIGN_UP' | 'SIGN_IN';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  canDismiss = true,
  initialMode = 'SIGN_UP',
}) => {
  const [mode, setMode] = useState<'SIGN_UP' | 'SIGN_IN' | 'FORGOT_PASSWORD'>(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setResetSuccess(false);
      // Pre-fill existing stored profile if available
      const savedEmail = localStorage.getItem('assetdoctor_user_email') || '';
      const savedPhone = localStorage.getItem('assetdoctor_user_phone') || '';
      const savedName = localStorage.getItem('assetdoctor_user_name') || '';
      const savedCity = localStorage.getItem('assetdoctor_user_location') || '';
      if (savedEmail) setEmail(savedEmail);
      if (savedPhone) setPhone(savedPhone);
      if (savedName) setName(savedName);
      if (savedCity) setCity(savedCity);
    }
  }, [isOpen, initialMode]);

  // Handle Escape key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle Registration (Sign Up)
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your mobile phone number.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const formattedPhone = phone.startsWith('+') ? phone : `+91 ${phone.replace(/\D/g, '')}`;
      const userObj = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: formattedPhone,
        location: city.trim() || 'Lucknow, Uttar Pradesh',
      };

      // Save user profile locally
      localStorage.setItem('assetdoctor_user_name', userObj.name);
      localStorage.setItem('assetdoctor_user_email', userObj.email);
      localStorage.setItem('assetdoctor_user_phone', userObj.phone);
      localStorage.setItem('assetdoctor_user_location', userObj.location);
      localStorage.setItem('assetdoctor_is_logged_in', 'true');

      onAuthSuccess(userObj);
      onClose();
    }, 800);
  };

  // Handle Login (Sign In)
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email or phone number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const existingName = localStorage.getItem('assetdoctor_user_name') || name || 'Asset Vault Owner';
      const existingPhone = localStorage.getItem('assetdoctor_user_phone') || phone || '+91 98765 43210';
      const existingLocation = localStorage.getItem('assetdoctor_user_location') || city || 'Lucknow, Uttar Pradesh';
      
      const userObj = {
        name: existingName,
        email: email.trim().toLowerCase(),
        phone: existingPhone,
        location: existingLocation,
      };

      localStorage.setItem('assetdoctor_is_logged_in', 'true');
      localStorage.setItem('assetdoctor_user_email', userObj.email);

      onAuthSuccess(userObj);
      onClose();
    }, 800);
  };

  // Handle Forgot Password
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetSuccess(true);
    }, 600);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in cursor-pointer"
    >
      <div
        id="auth-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col cursor-default"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800/80 text-center relative bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            title="Close Auth (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-3">
            <AssetDoctorLogo size="md" />
          </div>

          <h2 className="text-xl font-black text-white tracking-wide">
            {mode === 'SIGN_UP' && 'Create Your AssetDoctor Account'}
            {mode === 'SIGN_IN' && 'Welcome Back to AssetDoctor'}
            {mode === 'FORGOT_PASSWORD' && 'Recover Account Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {mode === 'SIGN_UP' && 'Store, track & protect bills, warranties, and FASTags'}
            {mode === 'SIGN_IN' && 'Sign in with your registered credentials'}
            {mode === 'FORGOT_PASSWORD' && 'We will send reset instructions to your registered email'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        {mode !== 'FORGOT_PASSWORD' && (
          <div className="flex border-b border-slate-800 bg-slate-950 p-1.5 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('SIGN_UP');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'SIGN_UP'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Create Account (Sign Up)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('SIGN_IN');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'SIGN_IN'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        )}

        {/* Form Container */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN UP FORM */}
          {mode === 'SIGN_UP' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Name:
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Manish Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Address:
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. manish@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Account Password:
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Mobile Phone Number:
                </label>
                <div className="relative flex items-center">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  City / State:
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lucknow, Uttar Pradesh"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registering Account...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Create Account & Access Vault</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('SIGN_IN');
                      setErrorMsg('');
                    }}
                    className="font-bold text-emerald-400 hover:underline cursor-pointer"
                  >
                    Sign In Here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* SIGN IN FORM */}
          {mode === 'SIGN_IN' && (
            <form onSubmit={handleSignInSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Address or Mobile Number:
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. manish@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Account Password:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('FORGOT_PASSWORD');
                      setErrorMsg('');
                      setResetSuccess(false);
                    }}
                    className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Forgot Password?</span>
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Sign In to Vault</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400">
                  New to AssetDoctor?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('SIGN_UP');
                      setErrorMsg('');
                    }}
                    className="font-bold text-emerald-400 hover:underline cursor-pointer"
                  >
                    Create First Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              {!resetSuccess ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Registered Email Address:
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. user@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending Request...' : 'Send Password Reset Link'}
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Reset Link Dispatched</h4>
                  <p className="text-xs text-slate-300">
                    We sent password reset instructions to <strong className="font-mono text-emerald-300">{email}</strong>.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setMode('SIGN_IN');
                  setErrorMsg('');
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                &larr; Back to Sign In
              </button>
            </div>
          )}

          {/* Offline Security Note */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Private IndexedDB storage & local session encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

