import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  AlertTriangle,
  PackageX,
  QrCode,
  Calendar,
  Building2,
  Hash,
  FileText,
  Download,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  Wrench,
  Plus,
  History,
  TrendingDown,
  DollarSign,
  Clock,
  Tag,
  ChevronRight,
  Info,
  Check,
  Car,
  Siren,
} from 'lucide-react';
import { Asset, ServiceLogEntry } from '../types';
import { VehicleDocuments } from './EmergencyModal';
import { formatINR, calculateResaleValue, calculateExpiryDays } from '../utils/assetUtils';
import { AssetImageWithFallback } from './AssetImageWithFallback';

interface AssetDetailModalProps {
  asset: Asset | null;
  onClose: () => void;
  onOpenClaimModal: (asset: Asset) => void;
  onUpdateAsset?: (asset: Asset) => void;
  onOpenEmergencyModal?: (data: VehicleDocuments) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onOpenClaimModal,
  onUpdateAsset,
  onOpenEmergencyModal,
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'service' | 'resale'>('vault');

  // Service Log Form state
  const [showAddLogForm, setShowAddLogForm] = useState(false);
  const [serviceType, setServiceType] = useState('Periodic Maintenance & Cleaning');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceCost, setServiceCost] = useState<number>(1500);
  const [serviceProvider, setServiceProvider] = useState('');
  const [replacedParts, setReplacedParts] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');

  if (!asset) return null;

  const resale = calculateResaleValue(asset);
  const serviceLogs = asset.serviceLogs || [];
  const totalServiceSpent = serviceLogs.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  const handleAddServiceLog = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: ServiceLogEntry = {
      id: `slog-${Date.now()}`,
      date: serviceDate || new Date().toISOString().split('T')[0],
      serviceType: serviceType || 'Routine Maintenance',
      cost: Number(serviceCost) || 0,
      provider: serviceProvider || asset.vendor || 'Authorized Service Station',
      replacedParts: replacedParts || 'None',
      notes: serviceNotes || 'Maintenance completed successfully.',
    };

    const updatedAsset: Asset = {
      ...asset,
      serviceDate: newLog.date,
      serviceLogs: [newLog, ...serviceLogs],
    };

    if (onUpdateAsset) {
      onUpdateAsset(updatedAsset);
    }

    // Reset Form
    setShowAddLogForm(false);
    setServiceCost(1500);
    setServiceProvider('');
    setReplacedParts('');
    setServiceNotes('');
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div
        id="asset-detail-modal-container"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {asset.name}
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>{asset.brand || 'Brand Asset'}</span>
                  <span>•</span>
                  <span>{asset.category}</span>
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

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800/80">
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-slate-800 text-emerald-400 shadow-md border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Warranty Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('service')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'service'
                  ? 'bg-slate-800 text-teal-400 shadow-md border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Service History ({serviceLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resale')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'resale'
                  ? 'bg-slate-800 text-cyan-400 shadow-md border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Resale & Valuation</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* TAB 1: WARRANTY VAULT & CERTIFICATE */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              {/* Certificate Header Banner */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/30 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield className="w-32 h-32 text-emerald-400" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      {asset.category} • SER VIVAULT VERIFIED
                    </span>
                    <h1 className="text-xl font-black text-white mt-2">
                      {asset.name}
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Purchased from: <strong className="text-slate-200">{asset.vendor || 'Authorized Merchant'}</strong></span>
                    </p>
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Valuation</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                      {formatINR(asset.price)}
                    </span>
                  </div>
                </div>

                {/* Certificate Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Serial / IMEI</span>
                    <span className="text-xs font-mono font-bold text-slate-200 block truncate mt-0.5">
                      {asset.serialNumber || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Purchase Date</span>
                    <span className="text-xs font-bold text-slate-200 block mt-0.5">
                      {asset.purchaseDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Warranty Duration</span>
                    <span className="text-xs font-bold text-slate-200 block mt-0.5">
                      {asset.warrantyMonths} Months
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Expiration Date</span>
                    <span className="text-xs font-bold text-slate-200 block mt-0.5">
                      {asset.expiryDate}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[11px] font-medium text-slate-400 block">Warranty Status</span>
                    <div className="mt-1">
                      {asset.status === 'active' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active Protection ({asset.daysRemaining} days left)
                        </span>
                      )}
                      {asset.status === 'expiring_soon' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                          Expiring Soon ({asset.daysRemaining} days left)
                        </span>
                      )}
                      {asset.status === 'expired' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          <PackageX className="w-3.5 h-3.5" />
                          Expired ({Math.abs(asset.daysRemaining)} days ago)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vehicle Compliance Box */}
                {(asset.category === 'Vehicles' || asset.insuranceExpiryDate || asset.pucExpiryDate) && (
                  <div className="mt-5 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between text-cyan-400 font-bold text-xs">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-cyan-400" />
                        <span>Vehicle Insurance & PUC Compliance Tracking</span>
                      </div>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono">
                        Active Policy
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Insurance Expiry</span>
                          <span className="text-xs font-bold text-slate-200">{asset.insuranceExpiryDate || 'Not Configured'}</span>
                        </div>
                        {asset.insuranceExpiryDate && (() => {
                          const { daysRemaining, status } = calculateExpiryDays(asset.insuranceExpiryDate);
                          if (status === 'expired') {
                            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">Expired ({Math.abs(daysRemaining || 0)}d ago)</span>;
                          } else if (status === 'expiring_soon') {
                            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">Expiring ({daysRemaining}d)</span>;
                          } else {
                            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Valid ({daysRemaining}d)</span>;
                          }
                        })()}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">PUC Certificate Expiry</span>
                          <span className="text-xs font-bold text-slate-200">{asset.pucExpiryDate || 'Not Configured'}</span>
                        </div>
                        {asset.pucExpiryDate && (() => {
                          const { daysRemaining, status } = calculateExpiryDays(asset.pucExpiryDate);
                          if (status === 'expired') {
                            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">Expired ({Math.abs(daysRemaining || 0)}d ago)</span>;
                          } else if (status === 'expiring_soon') {
                            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">Expiring ({daysRemaining}d)</span>;
                          } else {
                            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Valid ({daysRemaining}d)</span>;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Code Security Seal */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white text-slate-950 shrink-0">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        Vault Verification Hash
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                        SV-HASH-8839210-ASSET-{asset.id}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                      AUTHENTIC
                    </span>
                    <span className="text-[10px] text-slate-500">AssetDoctor Vault</span>
                  </div>
                </div>
              </div>

              {/* Notes & Receipt Preview */}
              {asset.notes && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-slate-300">Warranty Coverage Notes:</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{asset.notes}</p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300">Original Invoice / Asset Image:</h4>
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <AssetImageWithFallback
                    src={asset.receiptImageUrl}
                    alt={asset.name}
                    category={asset.category}
                    name={asset.name}
                    className="w-full h-44 object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICE HISTORY & MAINTENANCE LOG */}
          {activeTab === 'service' && (
            <div className="space-y-6">
              {/* Header Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Maintenance Cost
                    </span>
                    <span className="text-xl font-black text-teal-400 font-mono mt-0.5 block">
                      {formatINR(totalServiceSpent)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Last Serviced On
                    </span>
                    <span className="text-sm font-bold text-slate-200 mt-1 block font-mono">
                      {asset.serviceDate || asset.purchaseDate}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAddLogForm(!showAddLogForm)}
                    className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Service</span>
                  </button>
                </div>
              </div>

              {/* Add New Service Record Form */}
              {showAddLogForm && (
                <form
                  onSubmit={handleAddServiceLog}
                  className="p-5 rounded-2xl bg-slate-950 border border-teal-500/40 space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-teal-400" /> Log Maintenance / Part Replacement
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddLogForm(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Service / Repair Type
                      </label>
                      <input
                        type="text"
                        required
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        placeholder="e.g. Engine Oil Change, Screen Replacement"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Service Date
                      </label>
                      <input
                        type="date"
                        required
                        value={serviceDate}
                        onChange={(e) => setServiceDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Total Cost Incurred (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={serviceCost}
                        onChange={(e) => setServiceCost(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-teal-300 font-mono text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Service Provider / Technician
                      </label>
                      <input
                        type="text"
                        value={serviceProvider}
                        onChange={(e) => setServiceProvider(e.target.value)}
                        placeholder="e.g. Authorized Brand Service Center"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Replaced Parts / Spares (Optional)
                    </label>
                    <input
                      type="text"
                      value={replacedParts}
                      onChange={(e) => setReplacedParts(e.target.value)}
                      placeholder="e.g. Battery, Oil Filter, Spark Plug"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Notes / Observations
                    </label>
                    <textarea
                      rows={2}
                      value={serviceNotes}
                      onChange={(e) => setServiceNotes(e.target.value)}
                      placeholder="Enter technician advice or warranty remarks..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 cursor-pointer"
                    >
                      Save Service Record
                    </button>
                  </div>
                </form>
              )}

              {/* Service Logs List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-teal-400" /> Previous Service Logs:
                </h4>

                {serviceLogs.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                    <Wrench className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-300">No Service Logs Recorded Yet</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Keep track of oil changes, screen repairs, battery health, or routine filter replacements.
                    </p>
                    <button
                      onClick={() => setShowAddLogForm(true)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-teal-500/30 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Log First Service
                    </button>
                  </div>
                ) : (
                  serviceLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                            <Wrench className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-xs font-bold text-white">
                            {log.serviceType}
                          </span>
                        </div>
                        <span className="text-xs font-bold font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {formatINR(log.cost)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>Date: <strong className="text-slate-300">{log.date}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span className="truncate">{log.provider || 'Authorized Station'}</span>
                        </div>
                      </div>

                      {log.replacedParts && log.replacedParts !== 'None' && (
                        <div className="text-[11px] text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>Replaced Spares: <strong className="text-cyan-300">{log.replacedParts}</strong></span>
                        </div>
                      )}

                      {log.notes && (
                        <p className="text-[11px] text-slate-400 italic pt-0.5">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RESALE & DEPRECIATION ANALYTICS */}
          {activeTab === 'resale' && (
            <div className="space-y-6">
              {/* Valuation Dashboard Header */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <TrendingDown className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Real-Time Asset Resale & Depreciation Calculator
                      </h3>
                      <p className="text-xs text-slate-400">
                        Category standard depreciation ({resale.annualDepreciationRate}% / year)
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                    {resale.retainedPercentage}% Value Retained
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Original Invoice Price
                    </span>
                    <span className="text-base font-black text-slate-200 font-mono mt-1 block">
                      {formatINR(asset.price)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Current Resale Worth
                    </span>
                    <span className="text-lg font-black text-cyan-300 font-mono mt-1 block">
                      {formatINR(resale.currentValue)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Estimated Depreciation
                    </span>
                    <span className="text-base font-black text-amber-300 font-mono mt-1 block">
                      - {formatINR(resale.depreciatedAmount)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar Gauge */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Asset Age: {resale.ageInYears} Years</span>
                    <span className="text-cyan-400 font-bold">{resale.retainedPercentage}% Retained Market Value</span>
                  </div>
                  <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex p-0.5">
                    <div
                      style={{ width: `${resale.retainedPercentage}%` }}
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Category Trade-In Guidance */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Smart Trade-In & Resale Advice for {asset.category}:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Optimal Trade-In Window:</strong> Devices in {asset.category} retain maximum resale value within 18–24 months of purchase.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Impact of Maintenance Logs:</strong> Including verified service logs and tax invoices in ServiVault increases buyer trust and resale value by 10–15%.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrintCertificate}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Print / Save Vault PDF</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenEmergencyModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEmergencyModal({
                    assetName: asset.name,
                    registrationNumber: asset.registrationNumber || 'MH-12-AB-1234',
                    rcUrl: asset.rcCopyUrl || asset.receiptImageUrl,
                    insuranceUrl: asset.insurancePolicyUrl || asset.receiptImageUrl,
                    insurancePolicyNo: asset.insurancePolicyNo || 'POL-8839210',
                    insuranceProvider: asset.insuranceProvider || 'HDFC ERGO / Digit',
                    insuranceExpiry: asset.insuranceExpiryDate,
                    pucUrl: asset.pucCertificateUrl,
                    pucExpiry: asset.pucExpiryDate,
                    brandName: asset.brand,
                    roadsideAssistanceNumber: '18002587111',
                    customerCareNumber: '18001029001',
                  });
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Siren className="w-4 h-4 animate-pulse" />
                <span>Emergency Mode</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onOpenClaimModal(asset);
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Support & Warranty Claim Hub</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
