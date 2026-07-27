import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, Plus, HardDrive, FileText, 
  Bike, Search, Scan, Sparkles, Clock, ExternalLink, ChevronRight 
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  // Ctrl + K Shortcut for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('vault-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredAssets = assets.filter((ast) =>
    searchQuery.trim() === ''
      ? true
      : ast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ast.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ast.serialNumber && ast.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 space-y-8 rounded-3xl border border-slate-800/80 shadow-2xl font-sans">
      
      {/* 1. Header & Global Command Search (Ctrl + K) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Vault Encrypted
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2">
            AssetDoctor Vault <span className="text-emerald-400">2.0</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            आपके एसेट्स, वारंटी और डॉक्युमेंट्स का ऑल-इन-वन स्मार्ट कंट्रोल सेंटर।
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              id="vault-search"
              type="text"
              placeholder="Search assets, RC, bills... (Ctrl + K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-12 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded">
              Ctrl K
            </kbd>
          </div>

          <button 
            onClick={() => typeof onOpenAddModal === 'function' ? onOpenAddModal() : typeof onOpenOCRModal === 'function' ? onOpenOCRModal() : alert('Opening Add Asset...')}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition shrink-0 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Asset</span>
          </button>
        </div>
      </div>

      {/* 2. Top Vault Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>Total Vault Asset Value</span>
            <div className="p-2 bg-slate-800/60 rounded-lg text-emerald-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">₹{totalValuation.toLocaleString('en-IN')}</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">100% Protected</span>
            <span>• {assets.length > 0 ? assets.length : 1} Tracked</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>Active Warranties</span>
            <div className="p-2 bg-slate-800/60 rounded-lg text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">{activeCount} Covered</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-blue-400 font-medium">Verified Proofs</span>
            <span>• Digital Invoice Vault</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>Upcoming Expiry Timeline</span>
            <div className="p-2 bg-slate-800/60 rounded-lg text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">{expiringCount} Urgent</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-amber-400 font-medium">Next Due:</span>
            <span>Regular Maintenance Schedule</span>
          </div>
        </div>
      </div>

      {/* 3. AI Quick Invoice OCR Upload Zone */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-900/80 border border-emerald-500/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              AI Bill & Warranty Scanner
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full">Fast Scan</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              अपनी गाड़ी, मोबाइल या इलेक्ट्रॉनिक सामान के बिल की फ़ोटो अपलोड करें। AI खुद डिटेल्स निकाल लेगा।
            </p>
          </div>
        </div>
        <button 
          onClick={() => typeof onOpenOCRModal === 'function' ? onOpenOCRModal() : alert('Opening AI OCR Scanner...')}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer"
        >
          <Scan className="w-4 h-4 text-emerald-400" />
          <span>Upload New Bill / Invoice</span>
        </button>
      </div>

      {/* 4. Category-Specific Vault Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            My Assets
            <span className="text-xs font-normal text-slate-500">
              {filteredAssets.length > 0 ? `${filteredAssets.length} Items` : '1 Item'}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {filteredAssets.length > 0 ? (
            filteredAssets.map((ast) => (
              <div 
                key={ast.id}
                onClick={() => typeof onSelectAsset === 'function' && onSelectAsset(ast)}
                className="bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-300 shadow-xl relative group cursor-pointer"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition">{ast.name}</h3>
                      <p className="text-xs text-slate-400">{ast.category} • Asset Vault</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold rounded-full">
                    {ast.status || 'Active'}
                  </span>
                </div>

                {/* Custom Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mt-5 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-medium">Asset Valuation</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block">₹{(ast.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-medium">Service Milestone</span>
                    <span className="text-sm font-bold text-emerald-400 mt-0.5 block">5,000 KM</span>
                  </div>
                </div>

                {/* Document Attachments Status */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" /> Bill & RC Stored
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" /> Maintenance On Track
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition border border-slate-700/50 flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>View Asset Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button 
                    title="Download / View Bill"
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700/50 flex items-center justify-center cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

              </div>
            ))
          ) : (
            /* Custom Vehicle Glass Card (TVS Ronin) Default */
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-300 shadow-xl relative group">
              
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition">TVS Ronin</h3>
                    <p className="text-xs text-slate-400">Motorcycle • Vehicle Vault</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold rounded-full">
                  Active
                </span>
              </div>

              {/* Custom Metrics Grid for Vehicles */}
              <div className="grid grid-cols-2 gap-3 mt-5 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Asset Valuation</span>
                  <span className="text-sm font-bold text-slate-200 mt-0.5 block">₹1,70,000</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Service Milestone</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">5,000 KM</span>
                </div>
              </div>

              {/* Document Attachments Status */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" /> Bill & RC Stored
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Clock className="w-3.5 h-3.5" /> Maintenance On Track
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition border border-slate-700/50 flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>View Asset Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button 
                  title="Download / View Bill"
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700/50 flex items-center justify-center cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
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

