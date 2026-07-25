import React, { useState } from 'react';

export interface RecentScanDoc {
  id: number | string;
  name: string;
  date: string;
  expiry: string;
  status: 'warning' | 'good' | 'expired';
}

export const AssetDoctorUI: React.FC = () => {
  const [scans] = useState<RecentScanDoc[]>([
    { id: 1, name: 'Samsung Fridge Invoice', date: '2026-07-20', expiry: 'In 12 Days', status: 'warning' },
    { id: 2, name: 'TVS Ronin RC & Insurance', date: '2026-05-15', expiry: 'Valid', status: 'good' },
  ]);

  // File Upload / Camera Trigger Handlers
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Document captured: ${file.name}`);
      // Yahan OCR ya Firebase processing logic lagayein
    }
  };

  return (
    <div className="app-container bg-slate-900 text-slate-100 font-sans p-4 max-w-md mx-auto min-h-screen">
      
      {/* 1. HERO SECTION: Quick Access Scan & Upload */}
      <section className="bg-slate-950/80 rounded-3xl p-6 shadow-xl border border-slate-800/80 mb-6 backdrop-blur-md">
        <div className="text-center mb-5">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full">
            AssetDoctor Instant Scan
          </span>
          <h1 className="text-2xl font-black mt-2 text-white tracking-tight">Manage Warranties Fast</h1>
          <p className="text-xs text-slate-400 mt-1">Scan invoice or upload document directly</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Camera Scan Button */}
          <label className="scan-btn-primary text-slate-950 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">
            <svg className="w-7 h-7 mb-1 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h0.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-extrabold text-sm">Scan Doc</span>
            {/* Opens Native Camera on Mobile */}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCameraCapture} />
          </label>

          {/* File Upload Button */}
          <label className="bg-slate-800 hover:bg-slate-700/80 text-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition border border-slate-700 active:scale-95">
            <svg className="w-7 h-7 mb-1 text-slate-300 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="font-bold text-sm">Upload File</span>
            {/* Opens File Manager/Gallery */}
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleCameraCapture} />
          </label>
        </div>
      </section>

      {/* 2. COMPACT DASHBOARD: Expiry Alerts & Recent Scans */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-bold text-white">Recent Documents</h2>
          <span className="text-xs font-semibold text-emerald-400 cursor-pointer hover:underline">View All</span>
        </div>

        {/* Scan List Cards */}
        <div className="space-y-3">
          {scans.map((doc) => (
            <div key={doc.id} className="recent-card bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${doc.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{doc.name}</h3>
                  <p className="text-xs text-slate-400">Added: {doc.date}</p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                doc.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}>
                {doc.expiry}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AssetDoctorUI;
