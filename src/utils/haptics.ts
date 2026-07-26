/**
 * Triggers native haptic vibration feedback on mobile devices
 */
export function triggerHaptic(pattern: number | number[] = 15): void {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch (err) {
    // Silent catch if haptics are disabled or unsupported
  }
}

export default triggerHaptic;
