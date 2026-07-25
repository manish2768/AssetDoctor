import React, { useState } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleWhatsAppSupport = () => {
    // मनीष भाई का WhatsApp नंबर जोड़ दिया गया है
    const phoneNumber = "919918288299"; 
    const message = encodeURIComponent("नमस्ते! मुझे AssetDoctor ऐप में एक समस्या / सुझाव देना है:");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleSubmitFeedback = () => {
    alert("आपका फ़ीडबैक दर्ज कर लिया गया है। धन्यवाद!");
    setFeedbackText('');
    setShowFeedbackModal(false);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-6 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Ashutosh Rai Credit */}
          <div>
            <p className="text-sm font-medium text-slate-200">
              Conceptualized &amp; Supervised by <span className="text-indigo-400 font-bold">Ashutosh Rai</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              AssetDoctor &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Feedback & Report Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleWhatsAppSupport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Help
            </button>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Report Issue
            </button>
          </div>
        </div>
      </div>

      {/* Simple Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Report Problem / Suggestion</h3>
            <p className="text-xs text-slate-400 mb-4">
              अगर आपको ऐप में कोई भी समस्या आ रही है, तो कृपया नीचे बताएं:
            </p>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="अपनी समस्या यहाँ विस्तार से लिखें..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 mb-4"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg text-white cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
