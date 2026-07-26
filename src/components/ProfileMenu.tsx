import React from 'react';
import { useAuth } from '../context/AuthContext';

export const ProfileMenu: React.FC = () => {
  const { user } = useAuth(); // Firebase currentUser

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-lg border border-emerald-500/30 shrink-0">
        {user?.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || 'User Avatar'} className="w-full h-full object-cover" />
        ) : (
          user?.displayName?.charAt(0) || 'U'
        )}
      </div>

      <div className="min-w-0 flex-1">
        {/* Real Logged In Name */}
        <h3 className="font-bold text-white text-base flex items-center gap-1.5 truncate">
          <span className="truncate">{user?.displayName || 'Vault Owner'}</span>
          <span className="text-emerald-400 text-xs bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.5 rounded-full shrink-0 font-normal">
            ✓ Verified
          </span>
        </h3>
        
        {/* Real Logged In Email */}
        <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
          {user?.email || 'No email registered'}
        </p>

        {/* Real Phone or Fallback */}
        <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
          {user?.phoneNumber || 'No phone added'}
        </p>
      </div>
    </div>
  );
};

export default ProfileMenu;
