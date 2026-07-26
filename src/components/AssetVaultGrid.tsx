import React, { useState, useMemo } from 'react';
import { Search, Filter, Layers, ArrowUpDown, ShieldAlert, Plus, ScanText, Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { Asset, AssetCategory, WarrantyStatus } from '../types';
import { AssetCard } from './AssetCard';

interface AssetVaultGridProps {
  assets: Asset[];
  activeStatusFilter: string;
  onStatusFilterChange: (status: 'all' | 'active' | 'expiring_soon' | 'expired') => void;
  onSelectAsset: (asset: Asset) => void;
  onClaimAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  onOpenOCR: () => void;
  onOpenAddModal: () => void;
  onSharePostcard?: (asset: Asset) => void;
}

export const AssetVaultGrid: React.FC<AssetVaultGridProps> = ({
  assets,
  activeStatusFilter,
  onStatusFilterChange,
  onSelectAsset,
  onClaimAsset,
  onDeleteAsset,
  onOpenOCR,
  onOpenAddModal,
  onSharePostcard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'value_desc' | 'days_asc' | 'purchase_desc'>('value_desc');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Vehicles', value: 'Vehicles' },
    { label: 'Appliances', value: 'Appliances' },
    { label: 'Gadgets', value: 'Gadgets' },
    { label: 'Home', value: 'Home' },
  ];

  const handleExportCSV = () => {
    setShowExportMenu(false);
    if (assets.length === 0) {
      alert('No assets available to export.');
      return;
    }
    const headers = ['Asset ID', 'Asset Name', 'Category', 'Vendor', 'Price (INR)', 'Purchase Date', 'Warranty Expiry', 'Serial Number', 'Status'];
    const rows = assets.map(a => [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.category}"`,
      `"${a.vendor || ''}"`,
      a.price,
      a.purchaseDate,
      a.expiryDate || '',
      `"${a.serialNumber || ''}"`,
      a.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AssetDoctor_Bills_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    setShowExportMenu(false);
    if (assets.length === 0) {
      alert('No assets available to export.');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF report.');
      return;
    }
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AssetDoctor - Bills & Asset Vault Export</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1e293b; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          h1 { color: #0f172a; font-size: 24px; margin: 0; }
          .subtitle { color: #64748b; font-size: 13px; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; color: #334155; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
          .active { background: #dcfce7; color: #15803d; }
          .expiring { background: #fef3c7; color: #b45309; }
          .expired { background: #ffe4e6; color: #be123c; }
          .total-box { margin-top: 24px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-weight: bold; display: flex; justify-content: space-between; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>🛡️ AssetDoctor - Vault Bills Summary</h1>
            <p class="subtitle">Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
          </div>
          <div style="text-align: right;">
            <strong style="font-size: 16px; color: #10b981;">₹${assets.reduce((sum, a) => sum + a.price, 0).toLocaleString('en-IN')}</strong>
            <div class="subtitle">${assets.length} Total Assets</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Purchase Date</th>
              <th>Price (₹)</th>
              <th>Warranty Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${assets.map((a, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${a.name}</strong>${a.serialNumber ? `<br/><small style="color:#64748b">S/N: ${a.serialNumber}</small>` : ''}</td>
                <td>${a.category}</td>
                <td>${a.vendor || '-'}</td>
                <td>${a.purchaseDate}</td>
                <td>₹${a.price.toLocaleString('en-IN')}</td>
                <td>${a.expiryDate || 'N/A'}</td>
                <td><span class="badge ${a.status === 'active' ? 'active' : a.status === 'expiring_soon' ? 'expiring' : 'expired'}">${a.status.replace('_', ' ')}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <span>Total Asset Valuation: ₹${assets.reduce((sum, a) => sum + a.price, 0).toLocaleString('en-IN')}</span>
          <span style="color: #64748b;">Bank-Grade Encrypted Export</span>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        // Search Filter
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          asset.name.toLowerCase().includes(query) ||
          (asset.vendor && asset.vendor.toLowerCase().includes(query)) ||
          (asset.serialNumber && asset.serialNumber.toLowerCase().includes(query));

        // Category Filter
        const matchesCategory =
          selectedCategory === 'all' || asset.category === selectedCategory;

        // Status Filter
        const matchesStatus =
          activeStatusFilter === 'all' || asset.status === activeStatusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'value_desc') return b.price - a.price;
        if (sortBy === 'days_asc') return a.daysRemaining - b.daysRemaining;
        if (sortBy === 'purchase_desc')
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        return 0;
      });
  }, [assets, searchQuery, selectedCategory, activeStatusFilter, sortBy]);

  return (
    <div id="asset-vault-section" className="space-y-6">
      
      {/* Controls Bar: Search, Category Tabs, Status Filter, Sort */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets, model, serial #..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Badge Pills */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 hidden lg:inline">Status:</span>
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStatusFilter === 'all'
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              All ({assets.length})
            </button>

            <button
              onClick={() => onStatusFilterChange('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStatusFilter === 'active'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-950 text-emerald-400/70 border border-slate-800 hover:bg-emerald-950/30'
              }`}
            >
              🟢 Active ({assets.filter((a) => a.status === 'active').length})
            </button>

            <button
              onClick={() => onStatusFilterChange('expiring_soon')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStatusFilter === 'expiring_soon'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-950 text-amber-400/70 border border-slate-800 hover:bg-amber-950/30'
              }`}
            >
              🟡 Expiring Soon ({assets.filter((a) => a.status === 'expiring_soon').length})
            </button>

            <button
              onClick={() => onStatusFilterChange('expired')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStatusFilter === 'expired'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-950 text-rose-400/70 border border-slate-800 hover:bg-rose-950/30'
              }`}
            >
              🔴 Expired ({assets.filter((a) => a.status === 'expired').length})
            </button>
          </div>

          {/* Sort Dropdown & Export Menu */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
              >
                <option value="value_desc" className="bg-slate-900 text-slate-200">Valuation (High to Low)</option>
                <option value="days_asc" className="bg-slate-900 text-slate-200">Expiry (Earliest First)</option>
                <option value="purchase_desc" className="bg-slate-900 text-slate-200">Newest Purchase First</option>
              </select>
            </div>

            {/* Export All Bills Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Export All Bills & Asset Data"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export All Bills</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-30 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Export Vault Data</div>
                  <button
                    onClick={handleExportCSV}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold">Export as CSV</div>
                      <div className="text-[10px] text-slate-400">Excel / Spreadsheet format</div>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <div className="font-bold">Export as PDF</div>
                      <div className="text-[10px] text-slate-400">Printable Bills Summary</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Category Horizontal Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {assets.length === 0 ? (
        /* Fresh Empty State for New Users */
        <div className="p-10 sm:p-14 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 my-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/5">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-white">
              No Assets Found
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Your AssetDoctor Vault is clean & empty. Add your first asset or scan a purchase invoice to start tracking warranties and depreciation.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenOCR}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <ScanText className="w-4 h-4" />
              <span>Scan Bill / Invoice</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Manual Add Asset</span>
            </button>
          </div>
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="space-y-8">
          {/* Category Section 1: Vehicles & Insurance */}
          {filteredAssets.filter((a) => a.category === 'Vehicles').length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <span>🚗 Vehicles & Insurance</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
                    {filteredAssets.filter((a) => a.category === 'Vehicles').length} Records
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets
                  .filter((a) => a.category === 'Vehicles')
                  .map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onSelect={onSelectAsset}
                      onClaim={onClaimAsset}
                      onDelete={onDeleteAsset}
                      onSharePostcard={onSharePostcard}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Category Section 2: Electronics & Gadgets */}
          {filteredAssets.filter((a) => a.category === 'Electronics' || a.category === 'Gadgets').length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <span>📱 Electronics & Gadgets</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono">
                    {filteredAssets.filter((a) => a.category === 'Electronics' || a.category === 'Gadgets').length} Items
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets
                  .filter((a) => a.category === 'Electronics' || a.category === 'Gadgets')
                  .map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onSelect={onSelectAsset}
                      onClaim={onClaimAsset}
                      onDelete={onDeleteAsset}
                      onSharePostcard={onSharePostcard}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Category Section 3: Home & Appliances */}
          {filteredAssets.filter((a) => a.category === 'Appliances' || a.category === 'Home' || a.category === 'Other').length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <span>🏠 Home, Appliances & General Vault</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 font-mono">
                    {filteredAssets.filter((a) => a.category === 'Appliances' || a.category === 'Home' || a.category === 'Other').length} Items
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets
                  .filter((a) => a.category === 'Appliances' || a.category === 'Home' || a.category === 'Other')
                  .map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onSelect={onSelectAsset}
                      onClaim={onClaimAsset}
                      onDelete={onDeleteAsset}
                      onSharePostcard={onSharePostcard}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Filter Empty State */
        <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Filter className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              No matching assets found in vault
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, category, or status filter.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                onStatusFilterChange('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
