import React, { useState } from 'react';
import { Bell, MessageSquare, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

interface NotificationTriggerProps {
  assetName?: string;
  expiryDays?: number;
}

export const NotificationTrigger: React.FC<NotificationTriggerProps> = ({ 
  assetName = "MacBook Pro M3", 
  expiryDays = 7 
}) => {
  const [pushEnabled, setPushEnabled] = useState<boolean>(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  // Request Native Push Notification Permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support push notifications.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        new Notification('AssetDoctor Push Alerts Active! 🔔', {
          body: `You will get timely reminders before your ${assetName} warranty expires.`,
          icon: '/logo.png'
        });
      } else {
        alert('Notification permission denied.');
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
  };

  // Generate direct WhatsApp Alert Link
  const sendWhatsAppAlert = () => {
    const phoneNumber = "919918288299"; // Manish's WhatsApp support number
    const textMessage = `⚠️ *AssetDoctor Expiry Reminder*\n\nHi Manish, your *${assetName}* warranty is expiring in *${expiryDays} days*!\n\nCheck your bill & claim warranty before expiry.`;
    const encodedText = encodeURIComponent(textMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 text-slate-100">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Automated Warranty Expiry Alerts</h3>
          <p className="text-xs text-slate-400">Never miss a warranty claim again.</p>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {/* Push Notification Toggle Button */}
        <button
          onClick={requestNotificationPermission}
          className={`w-full py-3 px-4 rounded-2xl font-medium text-xs flex items-center justify-between transition-all cursor-pointer ${
            pushEnabled 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
              : 'bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>{pushEnabled ? 'Push Notifications Enabled' : 'Enable Web Push Notifications'}</span>
          </div>
          {pushEnabled ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4 text-slate-400" />}
        </button>

        {/* WhatsApp Alert Button */}
        <button
          onClick={sendWhatsAppAlert}
          className="w-full py-3 px-4 rounded-2xl font-medium text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>Send Test WhatsApp Alert</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationTrigger;
