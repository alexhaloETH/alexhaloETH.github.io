import { apiRequest, withErrorContext } from './apiClient';

const num = (value, fallback = 0) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);
const str = (value) => (typeof value === 'string' ? value : '');

/**
 * Garments come back from two shapes: the stored row (snake_case, from the
 * items endpoints) and the scoring view (already camel-ish, with derived
 * `neutral` and `hue_family`). Both are normalised here so components never
 * have to know which endpoint a garment arrived from.
 */
const transformItem = (item) => ({
  id: item.id,
  slot: str(item.slot),
  label: str(item.label),
  hex: str(item.hex),
  hue: num(item.hue),
  lightness: num(item.lightness),
  chroma: num(item.chroma),
  // Only the scoring view carries these; the stored row does not.
  neutral: typeof item.neutral === 'boolean' ? item.neutral : null,
  hueFamily: str(item.hue_family) || null,
  isActive: item.is_active !== undefined ? Boolean(item.is_active) : true,
  createdAt: str(item.created_at),
  updatedAt: str(item.updated_at),
});

const transformToBackend = (item) => ({
  slot: str(item.slot).trim().toLowerCase(),
  label: str(item.label).trim(),
  hex: str(item.hex).trim(),
  is_active: item.isActive === undefined ? true : Boolean(item.isActive),
});

const transformPartner = (partner) => ({
  ...transformItem(partner),
  score: num(partner.score),
  relation: str(partner.relation),
  hueBonus: Boolean(partner.hue_bonus),
  penalty: num(partner.penalty),
  penaltyReasons: Array.isArray(partner.penalty_reasons) ? partner.penalty_reasons : [],
});

const transformOutfit = (outfit) => ({
  score: num(outfit.score),
  valueSpread: num(outfit.value_spread),
  hueFamilies: Array.isArray(outfit.hue_families) ? outfit.hue_families : [],
  base: outfit.base ? transformItem(outfit.base) : null,
  mid: outfit.mid ? transformItem(outfit.mid) : null,
  outer: outfit.outer ? transformItem(outfit.outer) : null,
  trousers: outfit.trousers ? transformItem(outfit.trousers) : null,
  shoes: outfit.shoes ? transformItem(outfit.shoes) : null,
  hat: outfit.hat ? transformItem(outfit.hat) : null,
  pairs: Array.isArray(outfit.pairs) ? outfit.pairs : [],
});

const transformPenalty = (row) => ({
  id: row.id,
  kind: str(row.kind),
  a: str(row.a),
  b: str(row.b),
  penalty: num(row.penalty),
  reason: str(row.reason),
  createdAt: str(row.created_at),
});

export const getAllWardrobeItems = async () => withErrorContext('Error fetching wardrobe items', async () => {
  const data = await apiRequest('/wardrobe/items');
  return Array.isArray(data) ? data.map(transformItem) : [];
});

export const createWardrobeItem = async (item) => withErrorContext('Error creating wardrobe item', () => (
  apiRequest('/wardrobe/items', { method: 'POST', body: transformToBackend(item) })
));

export const updateWardrobeItem = async (id, item) => withErrorContext(`Error updating wardrobe item ${id}`, () => (
  apiRequest(`/wardrobe/items/${id}`, { method: 'PUT', body: transformToBackend(item) })
));

export const deleteWardrobeItem = async (id) => withErrorContext(`Error deleting wardrobe item ${id}`, () => (
  apiRequest(`/wardrobe/items/${id}`, { method: 'DELETE' })
));

export const getPairings = async (id) => withErrorContext(`Error fetching pairings for ${id}`, async () => {
  const data = await apiRequest(`/wardrobe/items/${id}/pairings`);
  return {
    anchor: data?.anchor ? transformItem(data.anchor) : null,
    groups: Array.isArray(data?.groups)
      ? data.groups.map((group) => ({
        slot: str(group.slot),
        partners: Array.isArray(group.partners) ? group.partners.map(transformPartner) : [],
      }))
      : [],
  };
});

export const getOutfits = async (anchorId, limit = 20) => withErrorContext(`Error fetching outfits for ${anchorId}`, async () => {
  // apiRequest takes no query option, so the string is built here.
  const params = new URLSearchParams({ anchor: String(anchorId), limit: String(limit) });
  const data = await apiRequest(`/wardrobe/outfits?${params}`);
  return {
    anchor: data?.anchor ? transformItem(data.anchor) : null,
    count: num(data?.count),
    outfits: Array.isArray(data?.outfits) ? data.outfits.map(transformOutfit) : [],
  };
});

export const getPenalties = async () => withErrorContext('Error fetching pair penalties', async () => {
  const data = await apiRequest('/wardrobe/penalties');
  return Array.isArray(data) ? data.map(transformPenalty) : [];
});

export const createPenalty = async (penalty) => withErrorContext('Error creating pair penalty', () => (
  apiRequest('/wardrobe/penalties', {
    method: 'POST',
    body: {
      kind: str(penalty.kind).trim().toLowerCase(),
      a: str(penalty.a).trim().toLowerCase(),
      b: str(penalty.b).trim().toLowerCase(),
      penalty: num(penalty.penalty),
      reason: str(penalty.reason).trim(),
    },
  })
));

export const deletePenalty = async (id) => withErrorContext(`Error deleting pair penalty ${id}`, () => (
  apiRequest(`/wardrobe/penalties/${id}`, { method: 'DELETE' })
));
