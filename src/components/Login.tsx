import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AssetDoctorLogo } from './AssetDoctorLogo';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

export interface LoginProps {
  initialMode?: 'SIGN_UP' | 'SIGN_IN';
  onClose?: () => void;
  onAuthSuccess?: (userData: { name: string; email: string; phone: string; location?: string }) => void;
  onGuestLogin?: () => void;
  canDismiss?: boolean;
}

export const Login: React.FC<LoginProps> = ({ 
  initialMode = 'SIGN_UP',
  onClose,
  onAuthSuccess,
  onGuestLogin,
  canDismiss = true
}) => {
  const { user, loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(initialMode === 'SIGN_UP');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    setIsSignUp(initialMode === 'SIGN_UP');
  }, [initialMode]);

  // Handle successful auth
  const handleAuthComplete = (userEmail: string, userName?: string) => {
    const savedPhone = localStorage.getItem('assetdoctor_user_phone') || '+91 98765 43210';
    const savedLocation = localStorage.getItem('assetdoctor_user_location') || 'Lucknow, Uttar Pradesh';
    const finalName = userName || name || 'Vault Owner';
    
    if (onAuthSuccess) {
      onAuthSuccess({
        name: finalName,
        email: userEmail,
        phone: savedPhone,
        location: savedLocation,
      });
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setVerificationSent(false);
    setLoading(true);

    try {
      if (isSignUp) {
        await signupWithEmail(name, email, password);
        setVerificationSent(true);
        // Delay closing slightly so user sees the verification sent alert
        setTimeout(() => {
          handleAuthComplete(email, name);
        }, 2000);
      } else {
        await loginWithEmail(email, password);
        handleAuthComplete(email);
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Try signing in.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithGoogle();
      handleAuthComplete(user?.email || 'user@assetdoctor.app', user?.displayName || '');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Google sign in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-md w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
      
      {/* Dismiss / Close Button (if inside modal) */}
      {canDismiss && onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer z-20"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header Logo */}
      <div className="text-center space-y-3 pt-1">
        <div className="inline-flex justify-center">
          <AssetDoctorLogo size="lg" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {isSignUp ? 'Create Your Asset Vault' : 'Welcome Back to AssetDoctor'}
        </h2>
        <p className="text-xs text-slate-400">
          {isSignUp 
            ? 'Join thousands of families securing their home appliances & warranties.' 
            : 'Sign in to access your saved bills, warranties, and vehicle documents.'}
        </p>
      </div>

      {/* Verification Sent Banner */}
      {verificationSent && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Verification Email Sent!</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            We sent a verification link to <strong className="text-white">{email}</strong>. Please check your email inbox to verify your account.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Prominent Google Login Button for both Sign-Up & Sign-In */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 hover:from-slate-900 hover:to-slate-800 border-2 border-emerald-500/40 hover:border-emerald-400 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/40 group ring-2 ring-emerald-500/20"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="tracking-wide">Continue with Google</span>
        </button>
        <p className="text-[10px] text-slate-500 text-center">Fast, secure 1-click authentication</p>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider absolute">
          Or with Email
        </span>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {isSignUp && (
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required={isSignUp}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        )}

        <div className="relative">
          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="relative">
          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{loading ? 'Please wait...' : isSignUp ? 'Create Free Account' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Toggle Sign Up / Sign In */}
      <div className="pt-2 text-center text-xs text-slate-400">
        {isSignUp ? (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMsg('');
                setVerificationSent(false);
              }}
              className="text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        ) : (
          <p>
            Don&apos;t have a vault account yet?{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMsg('');
                setVerificationSent(false);
              }}
              className="text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Create Free Vault
            </button>
          </p>
        )}
      </div>

      {/* Guest Demo Mode Option */}
      {onGuestLogin && (
        <div className="pt-2 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onGuestLogin}
            className="text-xs text-slate-500 hover:text-slate-400 font-semibold cursor-pointer underline decoration-slate-700"
          >
            Continue in Guest / Demo Vault Mode
          </button>
        </div>
      )}

    </div>
  );
};
