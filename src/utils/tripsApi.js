import { apiRequest, withErrorContext } from './apiClient';

const parseTags = (tagsField) => {
  if (Array.isArray(tagsField)) return tagsField;
  if (typeof tagsField !== 'string' || !tagsField.trim()) return [];
  try {
    const parsed = JSON.parse(tagsField);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseGeometry = (geometryField) => {
  if (!geometryField) return null;
  if (typeof geometryField === 'object') return geometryField;
  try {
    return JSON.parse(geometryField);
  } catch {
    return null;
  }
};

const transformTrip = (raw) => ({
  id: raw.id,
  name: raw.name,
  description: raw.description ?? '',
  originalUrl: raw.original_url,
  score: raw.score ?? null,
  tags: parseTags(raw.tags),
  startDate: raw.start_date ?? null,
  endDate: raw.end_date ?? null,
  routeGeometry: parseGeometry(raw.route_geometry),
  distanceM: raw.distance_m ?? null,
  durationS: raw.duration_s ?? null,
  createdAt: raw.created_at,
});

const transformWaypoint = (raw) => ({
  id: raw.id,
  tripId: raw.trip_id,
  sequenceOrder: raw.sequence_order,
  dayNumber: raw.day_number ?? null,
  latitude: raw.latitude,
  longitude: raw.longitude,
  label: raw.label ?? '',
  notes: raw.notes ?? '',
  score: raw.score ?? null,
  isOvernight: Boolean(raw.is_overnight),
  createdAt: raw.created_at,
});

const transformTripWithWaypoints = (raw) => ({
  ...transformTrip(raw),
  waypoints: Array.isArray(raw.waypoints) ? raw.waypoints.map(transformWaypoint) : [],
});

export const getAllTrips = () => withErrorContext('Error fetching trips', async () => {
  const data = await apiRequest('/trips');
  return Array.isArray(data) ? data.map(transformTrip) : [];
});

export const getTrip = (id) => withErrorContext(`Error fetching trip ${id}`, async () => {
  const data = await apiRequest(`/trips/${id}`);
  return transformTripWithWaypoints(data);
});

export const createTrip = (payload) => withErrorContext('Error creating trip', async () => {
  const data = await apiRequest('/trips', {
    method: 'POST',
    body: {
      url: payload.url,
      name: payload.name || null,
      description: payload.description || null,
      tags: payload.tags || [],
      start_date: payload.startDate || null,
      end_date: payload.endDate || null,
    },
  });
  return transformTripWithWaypoints(data);
});

export const updateTrip = (id, payload) => withErrorContext(`Error updating trip ${id}`, () => (
  apiRequest(`/trips/${id}`, {
    method: 'PUT',
    body: {
      name: payload.name,
      description: payload.description ?? null,
      score: payload.score ?? null,
      tags: payload.tags || [],
      start_date: payload.startDate || null,
      end_date: payload.endDate || null,
    },
  })
));

export const deleteTrip = (id) => withErrorContext(`Error deleting trip ${id}`, () => (
  apiRequest(`/trips/${id}`, { method: 'DELETE' })
));

export const updateWaypoint = (tripId, waypointId, payload) => withErrorContext(
  `Error updating waypoint ${waypointId}`,
  () => apiRequest(`/trips/${tripId}/waypoints/${waypointId}`, {
    method: 'PUT',
    body: {
      label: payload.label ?? null,
      notes: payload.notes ?? null,
      score: payload.score ?? null,
      day_number: payload.dayNumber ?? null,
      is_overnight: payload.isOvernight ?? null,
    },
  }),
);

export const parseTripUrl = (url) => withErrorContext('Error parsing URL', async () => {
  const data = await apiRequest('/trips/parse', {
    method: 'POST',
    body: { url },
  });
  return {
    longUrl: data.long_url,
    waypoints: (data.waypoints || []).map((w) => ({
      latitude: w.latitude,
      longitude: w.longitude,
    })),
  };
});
