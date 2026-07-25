import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  Lock,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface UpdateEmailModalProps {
  isOpen: boolean;
  currentEmail: string;
  onClose: () => void;
  onEmailUpdated: (newEmail: string) => void;
}

export const UpdateEmailModal: React.FC<UpdateEmailModalProps> = ({
  isOpen,
  currentEmail,
  onClose,
  onEmailUpdated,
}) => {
  const { updateUserEmail } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewEmail('');
      setPassword('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const cleanEmail = newEmail.trim().toLowerCase();

    if (cleanEmail === currentEmail.trim().toLowerCase()) {
      setErrorMsg('New email cannot be the same as your current registered email.');
      return;
    }

    setLoading(true);
    try {
      await updateUserEmail(cleanEmail, password);
      setSuccessMsg(`Email updated to ${cleanEmail}. A verification email has been sent to your new inbox.`);
      onEmailUpdated(cleanEmail);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid password. Re-authentication failed.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already associated with another account.');
      } else if (err.code === 'auth/requires-recent-login') {
        setErrorMsg('Security check required. Please enter your current password.');
      } else {
        setErrorMsg(err.message || 'Failed to update email address.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Update Email Address</h2>
              <p className="text-xs text-slate-400">
                Current: <span className="font-mono text-slate-200 font-bold">{currentEmail}</span>
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

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                New Email Address:
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. new.email@domain.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Current Password (for Security Re-authentication):
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{loading ? 'Updating in Firebase...' : 'Verify & Update Email'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
