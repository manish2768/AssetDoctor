import React, { useState } from 'react';
import { FileText, Bolt, Smartphone, Droplets, Zap, ShieldCheck, ArrowRight, X, CheckCircle2, IndianRupee } from 'lucide-react';

interface UtilityPaymentHubProps {
  onShowToast: (message: string) => void;
}

export const UtilityPaymentHub: React.FC<UtilityPaymentHubProps> = ({ onShowToast }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentOptions = [
    {
      id: 'Insurance',
      title: 'Insurance Pay',
      subtitle: 'Policy & Term Premiums',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      badge: 'Auto-Archive',
    },
    {
      id: 'Electricity',
      title: 'Electricity Bill',
      subtitle: 'State Power Boards',
      icon: <Bolt className="w-5 h-5 text-amber-400" />,
      bg: 'bg-amber-500/10 border-amber-500/30',
      badge: 'BBPS Enabled',
    },
    {
      id: 'Recharge',
      title: 'Mobile / DTH',
      subtitle: 'Prepaid & Postpaid',
      icon: <Smartphone className="w-5 h-5 text-cyan-400" />,
      bg: 'bg-cyan-500/10 border-cyan-500/30',
      badge: 'Instant Topup',
    },
    {
      id: 'Gas/Water',
      title: 'Water & Gas',
      subtitle: 'Piped Gas & Utility',
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      bg: 'bg-blue-500/10 border-blue-500/30',
      badge: 'Direct Pay',
    },
  ];

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) {
      onShowToast('Please enter a valid Consumer / Policy Number');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onShowToast(`Payment request for ${activeModal} submitted. Receipt auto-archived to Vault!`);
      setActiveModal(null);
      setAccountNumber('');
      setAmount('');
    }, 1200);
  };

  return (
    <div className="p-5 rounded-3xl bg-[#0F141F] border border-[#222C40] space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-[#10B981] border border-emerald-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Quick Pay & Auto-Archive Hub
            </h3>
            <p className="text-[10px] text-slate-400">
              Pay bills & auto-save digital receipts directly to your AssetDoctor Vault
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 uppercase font-mono">
          BBPS Sync
        </span>
      </div>

      {/* Utility Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {paymentOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActiveModal(opt.id)}
            className={`p-4 rounded-2xl ${opt.bg} border hover:brightness-125 transition-all text-left flex flex-col justify-between cursor-pointer group shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-slate-950/80 group-hover:scale-110 transition-transform">
                {opt.icon}
              </div>
              <span className="text-[9px] font-bold text-slate-400 font-mono">
                {opt.badge}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                {opt.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                {opt.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Payment Processing Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-[#10B981]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Pay {activeModal} Bill
                  </h3>
                  <p className="text-xs text-slate-400">
                    BBPS Encrypted Utility Payment & Auto-Vault Archive
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Consumer / Policy / Account Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1029384756"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Bill Amount (₹ INR)
                </label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    placeholder="Fetch bill or enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Receipt automatically saved to Vault with warranty & Tax records.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Processing Payment...' : 'Proceed to Pay & Archive'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilityPaymentHub;
