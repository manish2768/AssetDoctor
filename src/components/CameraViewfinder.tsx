import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Zap, 
  ZapOff, 
  Image as ImageIcon, 
  Sparkles 
} from 'lucide-react';

interface CameraViewfinderProps {
  onClose: () => void;
  onCapture: (capturedDataUrl: string) => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({ onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize Camera Stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        let mediaStream: MediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          });
        } catch {
          mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        }

        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Check Torch capability
        const track = mediaStream.getVideoTracks()[0];
        if (track && 'getCapabilities' in track) {
          const capabilities = (track as any).getCapabilities?.() || {};
          if (capabilities.torch) {
            setTorchSupported(true);
          }
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle Flashlight/Torch
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;
    try {
      await (track as any).applyConstraints({
        advanced: [{ torch: !isTorchOn }]
      });
      setIsTorchOn(!isTorchOn);
    } catch (err) {
      console.warn("Torch failed to toggle:", err);
    }
  };

  // Capture Image Frame from Canvas
  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const capturedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      
      // Stop tracks before passing data
      if (stream) stream.getTracks().forEach(t => t.stop());
      onCapture(capturedDataUrl);
    }
  };

  // Gallery Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (stream) stream.getTracks().forEach(t => t.stop());
        if (event.target?.result) {
          onCapture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none">
      
      {/* Top Floating Controls */}
      <div 
        className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-5 pt-12 pb-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        style={{ paddingTop: 'calc(var(--sat, 0px) + 1rem)' }}
      >
        <button 
          onClick={() => {
            if (stream) stream.getTracks().forEach(t => t.stop());
            onClose();
          }} 
          className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md text-slate-200 border border-slate-700/50 active:scale-95 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-xs font-medium text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>AI Auto-Align</span>
        </div>

        {/* Torch Toggle */}
        <button 
          onClick={toggleTorch}
          disabled={!torchSupported}
          className={`p-2.5 rounded-full backdrop-blur-md border transition-all active:scale-95 cursor-pointer ${
            isTorchOn 
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
              : 'bg-slate-900/60 text-slate-300 border-slate-700/50 opacity-70'
          }`}
        >
          {isTorchOn ? <Zap className="w-6 h-6 fill-amber-400 text-amber-400" /> : <ZapOff className="w-6 h-6" />}
        </button>
      </div>

      {/* Camera Video Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-cover"
      />

      {/* A4 Document Overlay Frame & Grid Guidelines */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-6 pointer-events-none">
        <div className="w-full max-w-xs aspect-[1/1.414] border-2 border-cyan-400/60 rounded-xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
          
          {/* Corner Markers */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-lg"></div>

          {/* Grid Overlay */}
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-20">
            <div className="border border-slate-300"></div>
            <div className="border border-slate-300"></div>
            <div className="border border-slate-300"></div>
            <div className="border border-slate-300"></div>
            <div className="border border-slate-300"></div>
            <div className="border border-slate-300"></div>
            <div className="border border-slate-300"></div>
            <div className="border border-slate-300"></div>
            <div className="border border-slate-300"></div>
          </div>

          <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-slate-300 font-medium tracking-wide bg-slate-900/60 py-1 mx-6 rounded-md backdrop-blur-sm">
            Align Invoice or Receipt inside Frame
          </p>
        </div>
      </div>

      {/* Bottom Shutter Controls */}
      <div 
        className="absolute bottom-0 left-0 w-full z-20 pb-10 pt-6 px-8 flex items-center justify-between bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        style={{ paddingBottom: 'calc(var(--sab, 0px) + 2.5rem)' }}
      >
        
        {/* Gallery Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-3.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-200 active:scale-95 cursor-pointer"
        >
          <ImageIcon className="w-6 h-6" />
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileUpload}
        />

        {/* Shutter Trigger */}
        <button 
          onClick={handleCapture}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 shadow-lg shadow-cyan-500/30 active:scale-90 transition-transform cursor-pointer"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600"></div>
        </button>

        {/* Empty placeholder for alignment balance */}
        <div className="w-12 h-12"></div>
      </div>

    </div>
  );
};

export default CameraViewfinder;
