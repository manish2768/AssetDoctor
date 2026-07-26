import React from 'react';
import { ShieldCheck, AlertTriangle, Plus, HardDrive, FileText, Bike } from 'lucide-react';
import { Asset } from '../types';

interface DashboardOverviewProps {
  assets?: Asset[];
  totalValuation?: number;
  activeCount?: number;
  expiringCount?: number;
  onOpenAddModal?: () => void;
  onOpenOCRModal?: () => void;
  onSelectAsset?: (asset: Asset) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  assets = [],
  totalValuation = 250000,
  activeCount = 1,
  expiringCount = 0,
  onOpenAddModal,
  onOpenOCRModal,
  onSelectAsset
}) => {
  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-8 rounded-3xl border border-slate-800/80 shadow-2xl">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>AssetDoctor Vault</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              🟢 Encrypted & Live
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            अपने सभी एसेट्स, वारंटी और डॉक्युमेंट्स को सुरक्षित एक जगह मैनेज करें।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => typeof onOpenOCRModal === 'function' ? onOpenOCRModal() : alert('Opening AI OCR Scanner...')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Asset</span>
          </button>
        </div>
      </div>

      {/* 2. Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>Total Vault Value</span>
            <HardDrive className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            ₹{totalValuation.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">{activeCount} Primary Asset Active</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>Protected Warranties</span>
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{activeCount} Covered</div>
          <p className="text-xs text-slate-500 mt-1">Bills & Proofs Verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>Expiry Alerts</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{expiringCount} Urgent</div>
          <p className="text-xs text-slate-500 mt-1">All Renewals On Schedule</p>
        </div>
      </div>

      {/* 3. Primary Assets Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">My Assets & Warranties</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Asset Card: TVS Ronin or Dynamic Assets */}
          {assets.length > 0 ? (
            assets.map((ast) => (
              <div 
                key={ast.id}
                onClick={() => typeof onSelectAsset === 'function' && onSelectAsset(ast)}
                className="bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all duration-300 shadow-xl relative group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{ast.name}</h3>
                      <p className="text-xs text-slate-400">{ast.category} • Asset Vault</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
                    {ast.status || 'Active'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800/80 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Asset Valuation</p>
                    <p className="font-semibold text-slate-200">₹{(ast.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Service Schedule</p>
                    <p className="font-semibold text-slate-200">Every 5,000 KM</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-5">
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition border border-slate-700/50 cursor-pointer">
                    View Vault Docs
                  </button>
                  <button className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition border border-slate-700/50 cursor-pointer">
                    <FileText className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            /* Default TVS Ronin Card */
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all duration-300 shadow-xl relative group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">TVS Ronin</h3>
                    <p className="text-xs text-slate-400">Motorcycle • Vehicle Vault</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800/80 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Asset Valuation</p>
                  <p className="font-semibold text-slate-200">₹1,70,000</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Service Schedule</p>
                  <p className="font-semibold text-slate-200">Every 5,000 KM</p>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition border border-slate-700/50 cursor-pointer">
                  View Vault Docs
                </button>
                <button className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition border border-slate-700/50 cursor-pointer">
                  <FileText className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default DashboardOverview;
