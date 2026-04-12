import { useCallback, useEffect, useMemo, useState } from 'react';

function useAutoRotate(panelIds, {
  enabled = true,
  intervalMs = 300000,
  lockedPanelId = null,
} = {}) {
  const validPanelIds = useMemo(() => (
    Array.isArray(panelIds) && panelIds.length > 0 ? panelIds : ['now']
  ), [panelIds]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lockedIndex = lockedPanelId ? validPanelIds.indexOf(lockedPanelId) : -1;
  const resolvedIndex = lockedIndex >= 0
    ? lockedIndex
    : Math.min(activeIndex, validPanelIds.length - 1);

  const next = useCallback(() => {
    setActiveIndex((current) => (current + 1) % validPanelIds.length);
  }, [validPanelIds.length]);

  const previous = useCallback(() => {
    setActiveIndex((current) => (current - 1 + validPanelIds.length) % validPanelIds.length);
  }, [validPanelIds.length]);

  useEffect(() => {
    if (!enabled || lockedPanelId || isPaused || validPanelIds.length <= 1) {
      return undefined;
    }

    const intervalId = setInterval(next, intervalMs);
    return () => clearInterval(intervalId);
  }, [enabled, intervalMs, isPaused, lockedPanelId, next, validPanelIds.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (lockedPanelId) {
        return;
      }

      if (event.key === 'ArrowRight') {
        next();
      } else if (event.key === 'ArrowLeft') {
        previous();
      } else if (event.key === ' ') {
        event.preventDefault();
        setIsPaused((current) => !current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lockedPanelId, next, previous]);

  return {
    activePanelId: validPanelIds[resolvedIndex] || validPanelIds[0],
    isPaused,
    next,
    previous,
  };
}

export default useAutoRotate;
