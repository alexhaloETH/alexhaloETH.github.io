import { useEffect, useState } from 'react';

/**
 * Custom hook to detect user idle state
 * @param {number} timeout - Idle timeout in milliseconds
 * @param {boolean} enabled - Whether idle detection is enabled
 * @returns {boolean} - Whether the user is currently idle
 */
function useIdleDetection(timeout, enabled) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let timeoutId;

    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsIdle(true), timeout);
    };

    // Set up event listeners for user activity
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    // Start the initial timeout
    timeoutId = setTimeout(() => setIsIdle(true), timeout);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearTimeout(timeoutId);
      setIsIdle(false);
    };
  }, [timeout, enabled]);

  return isIdle;
}

export default useIdleDetection;
