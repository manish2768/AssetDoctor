import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Globe, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Siren, 
  ExternalLink,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string) => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [name, setName] = useState('Manish');
  const [email, setEmail] = useState('hansgeetglobal@gmail.com');
  const [phone, setPhone] = useState('9918288299');
  const [subject, setSubject] = useState('General Query');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      if (onShowToast) onShowToast('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onShowToast) {
        onShowToast('Thank you! Your message has been sent to AssetDoctor Support.');
      }
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    setSubject('General Query');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-500/30 relative flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">We are here to help you!</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Support Hub
                </span>
              </div>
              <p className="text-xs text-slate-400">Reach out to the AssetDoctor team for assistance, inquiries, or claims.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* 1. DIRECT CONTACT CARDS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Direct Contact Channels
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Email Support Card */}
              <a
                href="mailto:hansgeetglobal@gmail.com"
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex flex-col items-center text-center transition group shadow-md"
              >
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Support</span>
                <span className="text-xs font-bold text-white mt-1 break-all">hansgeetglobal@gmail.com</span>
                <span className="text-[10px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                  Click to mail <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </a>

              {/* Website Card */}
              <a
                href="https://assetdoctor.in"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex flex-col items-center text-center transition group shadow-md"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Website</span>
                <span className="text-xs font-bold text-white mt-1">assetdoctor.in</span>
                <span className="text-[10px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                  Visit portal <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </a>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center text-center shadow-md">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 mb-2">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</span>
                <span className="text-xs font-bold text-white mt-1">Lucknow, Uttar Pradesh</span>
                <span className="text-[10px] text-slate-400 mt-1">India</span>
              </div>
            </div>
          </div>

          {/* 2. EMERGENCY SUPPORT BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-rose-950/80 border-2 border-red-500/40 shadow-xl flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 shrink-0 mt-0.5 animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-400">
                  Need Immediate Emergency Help?
                </span>
                <span className="bg-red-500/20 text-red-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-red-500/30">
                  Instant Access
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                For instant roadside assistance (RSA) or emergency appliance helpline numbers, use the <strong className="text-white">Emergency Assistant</strong> mode inside any vehicle/appliance asset card in the app!
              </p>
            </div>
          </div>

          {/* 3. GET IN TOUCH FORM */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Get in Touch
              </h3>
              <span className="text-[10px] text-slate-500">* All fields required</span>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-emerald-300">Message Delivered!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{name}</strong>. Our support desk has received your ticket regarding <strong className="text-emerald-300">{subject}</strong> and will respond to <strong className="text-white">{emailOrPhone}</strong> shortly.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 text-xs text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Manish"
                      required
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                {/* 2-Column Grid: Email Address & Phone Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" 
                      placeholder="yourname@gmail.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" 
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
                </div>

                {/* Subject Dropdown */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Subject *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Warranty Claim Issue">Warranty Claim Issue</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, feedback, or warranty question..."
                    rows={4}
                    required
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
