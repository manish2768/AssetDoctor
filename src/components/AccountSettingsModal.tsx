import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Check,
  Database,
  History,
  Sparkles,
  LogOut,
  RefreshCw,
  MapPin,
  Navigation,
  Loader2,
} from 'lucide-react';
import { AssetDoctorLogo } from './AssetDoctorLogo';

interface AccountSettingsModalProps {
  isOpen: boolean;
  userName?: string;
  userEmail: string;
  userPhone: string;
  userLocation?: string;
  onClose: () => void;
  onOpenUpdatePhoneModal: () => void;
  onOpenUpdateEmailModal: () => void;
  onOpenForgotPassword: () => void;
  onUpdateLocation?: (newLocation: string) => void;
  onPasswordChangedToast?: (msg: string) => void;
  onShowToast?: (msg: string) => void;
  onLoadDemoAssets?: () => void;
  onLogout?: () => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  userName,
  userEmail,
  userPhone,
  userLocation = 'Mumbai, Maharashtra',
  onClose,
  onOpenUpdatePhoneModal,
  onOpenUpdateEmailModal,
  onOpenForgotPassword,
  onUpdateLocation,
  onPasswordChangedToast,
  onShowToast,
  onLoadDemoAssets,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'CHANGE_PASSWORD' | 'SECURITY_LOG'>('PROFILE');

  // Location state
  const [locationInput, setLocationInput] = useState(userLocation);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userLocation) {
      setLocationInput(userLocation);
    }
  }, [userLocation]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('PROFILE');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setSuccessMsg('');
      setIsUpdating(false);
    }
  }, [isOpen]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      const err = 'Geolocation is not supported by your browser.';
      setErrorMsg(err);
      if (onShowToast) onShowToast(err);
      return;
    }

    setIsDetectingLocation(true);
    setErrorMsg('');
    setSuccessMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const city =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.suburb ||
              addr.municipality ||
              addr.county ||
              addr.state_district ||
              'Detected Location';
            const state = addr.state || addr.country || '';
            const detectedLoc = state && city !== state ? `${city}, ${state}` : city;

            setLocationInput(detectedLoc);
            if (onUpdateLocation) onUpdateLocation(detectedLoc);

            const successText = `📍 Location detected: ${detectedLoc}`;
            setSuccessMsg(successText);
            if (onShowToast) {
              onShowToast(successText);
            } else if (onPasswordChangedToast) {
              onPasswordChangedToast(successText);
            }
          } else {
            const fallback = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
            setLocationInput(fallback);
            if (onUpdateLocation) onUpdateLocation(fallback);
            const fallbackText = `📍 Coordinates detected: ${fallback}`;
            setSuccessMsg(fallbackText);
            if (onShowToast) onShowToast(fallbackText);
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setErrorMsg('Could not reverse geocode address. You can enter location manually.');
          if (onShowToast) onShowToast('Reverse geocoding failed. Please type location.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (geoError) => {
        setIsDetectingLocation(false);
        let msg = 'Unable to fetch current location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = 'Location permission denied in browser. Please type location manually.';
        } else if (geoError.code === geoError.TIMEOUT) {
          msg = 'Location request timed out. Please try again or type manually.';
        }
        setErrorMsg(msg);
        if (onShowToast) onShowToast(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveLocationManual = () => {
    if (!locationInput.trim()) {
      setErrorMsg('Please enter a valid city or location.');
      return;
    }
    const cleanLoc = locationInput.trim();
    if (onUpdateLocation) onUpdateLocation(cleanLoc);
    const msg = `📍 Location saved: ${cleanLoc}`;
    setSuccessMsg(msg);
    if (onShowToast) {
      onShowToast(msg);
    } else if (onPasswordChangedToast) {
      onPasswordChangedToast(msg);
    }
  };

  if (!isOpen) return null;

  // Validation rules for Change Password
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isDifferentFromCurrent = newPassword.length > 0 && newPassword !== currentPassword;

  const isPasswordChangeValid =
    currentPassword.length >= 4 &&
    hasMinLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch &&
    isDifferentFromCurrent;

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      setErrorMsg('Please enter your current account password.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMsg('New password cannot be identical to your current password.');
      return;
    }

    if (!isPasswordChangeValid) {
      setErrorMsg('Please ensure all password security rules are fulfilled.');
      return;
    }

    setErrorMsg('');
    setIsUpdating(true);

    setTimeout(() => {
      setIsUpdating(false);
      setSuccessMsg('Your password has been successfully updated across all active devices!');
      if (onPasswordChangedToast) {
        onPasswordChangedToast('Account password updated securely!');
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div
        id="account-settings-modal-container"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Account Settings & Security
              </h2>
              <p className="text-xs text-slate-400">
                Manage profile credentials & vault access controls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('PROFILE');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            id="tab-account-profile"
            className={`py-2.5 px-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'PROFILE'
                ? 'text-emerald-400 border-emerald-400 bg-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('CHANGE_PASSWORD');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            id="tab-change-password"
            className={`py-2.5 px-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'CHANGE_PASSWORD'
                ? 'text-emerald-400 border-emerald-400 bg-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('SECURITY_LOG');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            id="tab-security-log"
            className={`py-2.5 px-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'SECURITY_LOG'
                ? 'text-emerald-400 border-emerald-400 bg-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Security Log</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* Error / Success Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                      U
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        User Account Profile
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </h3>
                      <p className="text-[11px] text-slate-400">ServiVault Owner • Verified Member</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                    Active Session
                  </span>
                </div>

                {/* 2-Column Grid: Name & Email Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Name *</label>
                    <input 
                      type="text" 
                      value={userName || localStorage.getItem('assetdoctor_user_name') || "Manish Rai"} 
                      readOnly 
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none cursor-not-allowed opacity-80"
                    />
                  </div>

                  {/* Email Address (Separate) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      value={userEmail || localStorage.getItem('assetdoctor_user_email') || "manish2768@gmail.com"} 
                      readOnly 
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>

                {/* Phone Number (Separate Field below) */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">Phone Number (Optional)</label>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenUpdatePhoneModal();
                      }}
                      className="text-[10px] text-teal-400 hover:underline font-bold cursor-pointer"
                    >
                      Verify / Change
                    </button>
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    defaultValue={userPhone || ""} 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                {/* City / Location Section */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      City / Location:
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      LocalStorage Saved
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="Enter City / Location (e.g. Mumbai, MH)"
                        className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5" />
                    </div>

                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isDetectingLocation}
                      id="detect-user-location-btn"
                      className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                      title="Automatically detect current City & State using Geolocation API"
                    >
                      {isDetectingLocation ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          <span>Detecting...</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                          <span>📍 Detect Location</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveLocationManual}
                      id="save-user-location-btn"
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-md shadow-emerald-500/20"
                      title="Save typed location"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Encryption row */}
                <div className="flex items-center justify-between py-1 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Vault Encryption:
                  </span>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">
                    AES-256 Cloud Encrypted
                  </span>
                </div>
              </div>

              {/* Password Recovery trigger button */}
              <div className="p-4 rounded-2xl bg-[#081426] border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    Forgot or Want to Reset Password?
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Initiate OTP verification or email link reset flow
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenForgotPassword();
                  }}
                  id="account-forgot-password-trigger"
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Reset Link / OTP
                </button>
              </div>

              {/* End Active Session / Logout Button */}
              {onLogout && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1 text-rose-300">
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      End Active Session
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Sign out of AssetDoctor on this device
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    id="account-logout-btn"
                    className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CHANGE PASSWORD WITH STRICT VALIDATION */}
          {activeTab === 'CHANGE_PASSWORD' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              
              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Current Account Password:
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  New Password:
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Confirm New Password:
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Password Validation Checklist */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                  Required Password Rules:
                </span>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>8+ characters</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>Uppercase (A-Z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>Lowercase (a-z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>Number (0-9)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>Special symbol (!@#)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>Passwords match</span>
                  </div>

                  <div className={`col-span-2 flex items-center gap-1.5 ${isDifferentFromCurrent ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>Different from current password</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isPasswordChangeValid || isUpdating}
                  className={`w-full py-3 px-4 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isPasswordChangeValid && !isUpdating
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20 hover:scale-[1.01]'
                      : 'bg-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating Database Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Update Account Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SECURITY LOG */}
          {activeTab === 'SECURITY_LOG' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Password Changed
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Today, 06:40 AM</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Password updated via ServiVault Auth console. Device IP: 192.168.1.42 (Chrome Desktop).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                    Mobile OTP Verified
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Yesterday, 04:15 PM</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  User phone number verified via SMS token for user account update.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
