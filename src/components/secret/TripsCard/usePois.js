import { useEffect, useState } from 'react';

const STORAGE_KEY = 'trips-journal-pois';

const loadPois = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const newId = () => (
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `poi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
);

// Points of interest live in localStorage (the user's choice): personal markers
// like home, a viewpoint, a café. No backend, no cross-device sync — instant and
// private to this browser.
export default function usePois() {
  const [pois, setPois] = useState(loadPois);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pois));
    } catch {
      /* storage unavailable or full — ignore */
    }
  }, [pois]);

  const addPoi = (poi) => {
    const created = { id: newId(), ...poi };
    setPois((prev) => [...prev, created]);
    return created;
  };

  const updatePoi = (id, patch) => {
    setPois((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removePoi = (id) => {
    setPois((prev) => prev.filter((p) => p.id !== id));
  };

  return { pois, addPoi, updatePoi, removePoi };
}
