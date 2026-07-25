import { useEffect, useState } from 'react';

export function useSecurityProtection(): boolean {
  const [isScreenProtected, setIsScreenProtected] = useState<boolean>(false);

  useEffect(() => {
    // 1. Detect Visibility Change (User leaves app or switches tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsScreenProtected(true);
      } else {
        setIsScreenProtected(false);
      }
    };

    // 2. Block Screenshot / Print Key Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen') {
        setIsScreenProtected(true);
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText('').catch(() => {});
        }
        alert('Screenshots are blocked inside AssetDoctor Vault for security.');
      }
      // Ctrl+P or Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('Printing or exporting sensitive documents is restricted.');
      }
    };

    // 3. Detect Window Blur & Focus
    const handleBlur = () => {
      setIsScreenProtected(true);
    };
    const handleFocus = () => {
      setIsScreenProtected(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return isScreenProtected;
}

export default useSecurityProtection;
