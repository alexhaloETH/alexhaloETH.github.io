import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createWardrobeItem,
  deleteWardrobeItem,
  getAllWardrobeItems,
  getOutfits,
  getPairings,
  updateWardrobeItem,
} from '../../../utils/wardrobeApi';

export const SLOTS = ['tee', 'shirt', 'jumper', 'jacket', 'trousers', 'shoes', 'hat'];

/** Declared layering order, so the UI lists garments top-down like an outfit. */
const SLOT_ORDER = Object.fromEntries(SLOTS.map((slot, index) => [slot, index]));

function useWardrobeData(enabled) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [anchorId, setAnchorId] = useState(null);
  const [pairings, setPairings] = useState(null);
  const [outfits, setOutfits] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [scoringError, setScoringError] = useState('');

  // A stale response from a previous anchor must not overwrite the current one.
  const anchorRequest = useRef(0);

  const loadItems = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError('');
    try {
      setItems(await getAllWardrobeItems());
    } catch (err) {
      setError(err.message || 'Failed to load wardrobe');
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const loadScoring = useCallback(async (id) => {
    if (!id) {
      setPairings(null);
      setOutfits(null);
      return;
    }
    const request = anchorRequest.current + 1;
    anchorRequest.current = request;

    setIsScoring(true);
    setScoringError('');
    try {
      const [pairingResult, outfitResult] = await Promise.all([
        getPairings(id),
        getOutfits(id, 12),
      ]);
      if (anchorRequest.current !== request) return;
      setPairings(pairingResult);
      setOutfits(outfitResult);
    } catch (err) {
      if (anchorRequest.current !== request) return;
      setScoringError(err.message || 'Failed to score this item');
      setPairings(null);
      setOutfits(null);
    } finally {
      if (anchorRequest.current === request) setIsScoring(false);
    }
  }, []);

  const selectAnchor = useCallback((id) => {
    setAnchorId(id);
    loadScoring(id);
  }, [loadScoring]);

  const saveItem = useCallback(async (item) => {
    if (item.id) await updateWardrobeItem(item.id, item);
    else await createWardrobeItem(item);
    await loadItems();
    // A changed garment changes its own scoring, so refresh what is on screen.
    if (anchorId) await loadScoring(anchorId);
  }, [anchorId, loadItems, loadScoring]);

  const removeItem = useCallback(async (id) => {
    await deleteWardrobeItem(id);
    if (anchorId === id) {
      setAnchorId(null);
      setPairings(null);
      setOutfits(null);
    }
    await loadItems();
  }, [anchorId, loadItems]);

  const itemsBySlot = useMemo(() => {
    const grouped = new Map(SLOTS.map((slot) => [slot, []]));
    for (const item of items) {
      if (!grouped.has(item.slot)) grouped.set(item.slot, []);
      grouped.get(item.slot).push(item);
    }
    return [...grouped.entries()]
      .sort((a, b) => (SLOT_ORDER[a[0]] ?? 99) - (SLOT_ORDER[b[0]] ?? 99))
      .filter(([, list]) => list.length > 0);
  }, [items]);

  const anchor = useMemo(
    () => items.find((item) => item.id === anchorId) || null,
    [items, anchorId],
  );

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((item) => item.isActive).length,
    slots: new Set(items.map((item) => item.slot)).size,
  }), [items]);

  return {
    items,
    itemsBySlot,
    stats,
    isLoading,
    error,
    refresh: loadItems,
    anchor,
    anchorId,
    selectAnchor,
    pairings,
    outfits,
    isScoring,
    scoringError,
    saveItem,
    removeItem,
  };
}

export default useWardrobeData;
