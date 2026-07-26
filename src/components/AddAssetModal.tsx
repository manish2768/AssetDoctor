import React, { useState } from 'react';
import { X, Plus, Sparkles, Tag, IndianRupee, Calendar, ShieldCheck, Building2, Hash, FileText, Car, ShieldAlert, Lock } from 'lucide-react';
import { Asset, AssetCategory } from '../types';
import { calculateWarrantyStatus, formatINR } from '../utils/assetUtils';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (newAsset: Asset) => void;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({
  isOpen,
  onClose,
  onAddAsset,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Electronics');
  const [price, setPrice] = useState<number | ''>('');
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [warrantyMonths, setWarrantyMonths] = useState<number>(12);
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [pucExpiryDate, setPucExpiryDate] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('');
  const [maintenanceDueDate, setMaintenanceDueDate] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleResetForm = () => {
    setName('');
    setBrand('');
    setPrice('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setWarrantyMonths(12);
    setInsuranceExpiryDate('');
    setChassisNumber('');
    setRegistrationNumber('');
    setPucExpiryDate('');
    setMaintenanceType('');
    setMaintenanceDueDate('');
    setSerialNumber('');
    setVendor('');
    setNotes('');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter the asset name (e.g. MacBook Pro, Honda City).');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Please enter a valid purchase price greater than ₹0.');
      return;
    }
    if (!purchaseDate) {
      setErrorMsg('Please select a valid purchase date.');
      return;
    }

    setErrorMsg('');
    const numericPrice = Number(price);
    const { expiryDate, daysRemaining, status } = calculateWarrantyStatus(
      purchaseDate,
      warrantyMonths
    );

    const isVehicle = category === 'Vehicles';

    const newAsset: Asset = {
      id: `ast-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim() || 'Generic Brand',
      category,
      price: numericPrice,
      purchaseDate,
      warrantyMonths: Number(warrantyMonths),
      expiryDate,
      daysRemaining,
      status,
      insuranceExpiryDate: isVehicle && insuranceExpiryDate ? insuranceExpiryDate : undefined,
      chassisNumber: isVehicle && chassisNumber.trim() ? chassisNumber.trim() : undefined,
      registrationNumber: isVehicle && registrationNumber.trim() ? registrationNumber.trim() : undefined,
      pucExpiryDate: isVehicle && pucExpiryDate ? pucExpiryDate : undefined,
      maintenanceType: maintenanceType || (isVehicle ? 'Vehicle Annual Service' : 'Routine Maintenance Check'),
      maintenanceDueDate: maintenanceDueDate || expiryDate,
      serialNumber: serialNumber.trim() || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      vendor: vendor.trim() || 'Direct Purchase',
      notes: notes.trim() || 'Registered in AssetDoctor Vault',
    };

    onAddAsset(newAsset);
    handleResetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div
        id="add-asset-modal-container"
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Add Asset to Vault
              </h2>
              <p className="text-xs text-slate-400">
                Register a new high-value item, appliance, or vehicle
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg('')}
                className="p-1 hover:bg-rose-500/20 rounded-lg text-rose-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Trust & Security Badge */}
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-slate-300 font-bold text-[11px]">
                End-to-End Encrypted & Offline Private
              </span>
            </div>
            <span className="text-[10px] text-[#10B981] font-mono font-bold">
              AES-256 Vault
            </span>
          </div>

          {/* Asset Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Asset Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Asset Name <span className="text-rose-500 font-black">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TVS Ronin 225, MacBook Air M2, Daikin AC"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Brand / Make */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-teal-400" /> Brand / Manufacturer
              </label>
              <input
                type="text"
                placeholder="e.g. Honda, Daikin, Kent RO, TVS, Sony, Apple"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Category <span className="text-rose-500 font-black">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Vehicles">Vehicles & Insurance (Car / Bike / Scooter)</option>
                <option value="Appliances">Appliances</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Home">Home</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Price in INR */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-cyan-400" /> Price (₹ INR) <span className="text-rose-500 font-black">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 85000"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Purchase Date <span className="text-rose-500 font-black">*</span>
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Warranty Months */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Warranty (Months) <span className="text-rose-500 font-black">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="120"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Vendor / Retailer */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> Merchant / Showroom
              </label>
              <input
                type="text"
                placeholder="e.g. Croma, Apple Store, TVS Motors"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" /> Serial / IMEI / Engine Number
              </label>
              <input
                type="text"
                placeholder="e.g. SN-991203"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

          </div>

          {/* Dynamic Vehicle Compliance Fields */}
          {category === 'Vehicles' && (
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-cyan-400 font-bold text-xs">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-cyan-400" />
                  <span>Vehicle Registration, Chassis & Insurance Details</span>
                </div>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono">
                  Auto-Alert Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Registration Number (Vehicle No.)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UP32 AB 1234"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Chassis / VIN Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ME4MD123456789"
                    value={chassisNumber}
                    onChange={(e) => setChassisNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> Insurance Expiry Date
                  </label>
                  <input
                    type="date"
                    value={insuranceExpiryDate}
                    onChange={(e) => setInsuranceExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" /> PUC Expiry Date
                  </label>
                  <input
                    type="date"
                    value={pucExpiryDate}
                    onChange={(e) => setPucExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Maintenance / Service Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-cyan-400" /> Maintenance / Service Type
              </label>
              <input
                type="text"
                placeholder="e.g. RO Filter Change, Bike Service, Insurance Renewal"
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Next Maintenance Due Date
              </label>
              <input
                type="date"
                value={maintenanceDueDate}
                onChange={(e) => setMaintenanceDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Notes / Extended AMC
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Includes extended panel protection plan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Reset Form
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Asset to Vault</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
