import React from 'react';
import { Login } from './Login';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userData: { name: string; email: string; phone: string; location?: string }) => void;
  canDismiss?: boolean;
  initialMode?: 'SIGN_UP' | 'SIGN_IN';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  canDismiss = true,
  initialMode = 'SIGN_UP',
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (canDismiss && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Login
        initialMode={initialMode}
        onClose={onClose}
        onAuthSuccess={onAuthSuccess}
        canDismiss={canDismiss}
      />
    </div>
  );
};
