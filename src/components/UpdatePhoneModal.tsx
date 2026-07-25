import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Phone,
  CheckCircle2,
  Lock,
  Smartphone,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface UpdatePhoneModalProps {
  isOpen: boolean;
  currentPhone: string;
  onClose: () => void;
  onPhoneUpdated: (newPhone: string) => void;
}

export const UpdatePhoneModal: React.FC<UpdatePhoneModalProps> = ({
  isOpen,
  currentPhone,
  onClose,
  onPhoneUpdated,
}) => {
  const { updateUserPhone } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    if (cleanNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    const formattedPhone = `+91 ${cleanNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}`;
    setLoading(true);

    try {
      await updateUserPhone(formattedPhone);
      setSuccessMsg(`Mobile number updated to ${formattedPhone}`);
      onPhoneUpdated(formattedPhone);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update phone number.');
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
            <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Update Phone Number</h2>
              <p className="text-xs text-slate-400">
                Current: <span className="font-mono text-slate-200 font-bold">{currentPhone || '+91 98765 43210'}</span>
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
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                Enter New Mobile Phone Number:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-mono font-bold text-slate-400 border-r border-slate-800 pr-2">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full pl-14 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-sm tracking-wider focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{loading ? 'Updating...' : 'Save Phone Number'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
