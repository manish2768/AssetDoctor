import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { processDocumentWithGemini } from '../services/geminiOcrService';

interface OCRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete?: (scannedData: any) => void;
  onAddAsset?: (newAsset: any) => void;
}

export const OCRScannerModal: React.FC<OCRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
  onAddAsset,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Camera handling
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    try {
      setErrorMsg(null);
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } catch {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMsg('Unable to access camera. Please check permissions or upload an image.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImage = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const extractedData = await processDocumentWithGemini(capturedImage);
      if (onScanComplete) {
        onScanComplete(extractedData);
      }
      if (onAddAsset && extractedData.items && extractedData.items.length > 0) {
        const firstItem = extractedData.items[0];
        onAddAsset({
          name: firstItem.itemName || 'Scanned Asset',
          category: firstItem.category || 'Gadgets',
          purchaseDate: extractedData.purchaseDate || new Date().toISOString().split('T')[0],
          price: firstItem.price || extractedData.totalAmount || 0,
          brand: firstItem.brand || extractedData.merchantName || 'Generic',
          serialNumber: firstItem.serialOrImei || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
          warrantyMonths: firstItem.warrantyMonths || 12,
          vendor: extractedData.merchantName || 'Merchant',
          notes: 'Scanned via Gemini AI Document Scanner',
          receiptImageUrl: capturedImage,
        });
      }
      handleClose();
    } catch (err: any) {
      console.error('Gemini OCR Error:', err);
      setErrorMsg(err.message || 'Failed to scan bill. Please check Gemini API Key or connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setErrorMsg(null);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setErrorMsg(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-lg">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white">AI Document Scanner</span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center gap-4">
          {errorMsg && (
            <div className="w-full p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center font-medium">
              {errorMsg}
            </div>
          )}

          {capturedImage ? (
            /* Preview Captured Image */
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-slate-950 shadow-2xl">
              <img
                src={capturedImage}
                alt="Document Preview"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            /* Camera Viewfinder Box */
            <div className="relative w-full max-w-md aspect-[3/4] bg-slate-950 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-400/40 m-6 rounded-xl" />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                onClick={handleReset}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </button>
              <button
                onClick={handleProcessImage}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Scanning with Gemini AI...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Process Document
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <button
                onClick={handleCapture}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 text-sm cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default OCRScannerModal;
