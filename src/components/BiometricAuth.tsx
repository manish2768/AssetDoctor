import React from 'react';
import { SecurityLockScreen } from './SecurityLockScreen';

interface BiometricAuthProps {
  onAuthenticated: () => void;
  isOpen?: boolean;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({ onAuthenticated, isOpen = true }) => {
  return <SecurityLockScreen isOpen={isOpen} onUnlocked={onAuthenticated} />;
};

export default BiometricAuth;
