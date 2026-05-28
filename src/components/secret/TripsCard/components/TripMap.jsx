import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const UK_CENTER = [54.5, -3.0];
const UK_ZOOM = 6;

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const trackColors = [
  '#38bdf8',
  '#a78bfa',
  '#f472b6',
  '#fbbf24',
  '#34d399',
  '#fb7185',
  '#60a5fa',
  '#facc15',
];

const colorForTrip = (id) => trackColors[Math.abs(id ?? 0) % trackColors.length];

const geometryToLatLngs = (geometry) => {
  if (!geometry || geometry.type !== 'LineString' || !Array.isArray(geometry.coordinates)) {
    return null;
  }
  // GeoJSON coords are [lon, lat]; Leaflet wants [lat, lon].
  return geometry.coordinates.map(([lng, lat]) => [lat, lng]);
};

const waypointsToLatLngs = (waypoints) => (
  (waypoints || []).map((w) => [w.latitude, w.longitude])
);

const tripPolylinePositions = (trip) => (
  geometryToLatLngs(trip.routeGeometry) || waypointsToLatLngs(trip.waypoints)
);

function FitBoundsOnTrips({ trips }) {
  const map = useMap();
  useEffect(() => {
    const points = [];
    for (const trip of trips) {
      const line = tripPolylinePositions(trip);
      if (line) points.push(...line);
    }
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 11 });
    }
  }, [trips, map]);
  return null;
}

function TripMap({
  trips = [],
  trip = null,
  selectedWaypointId = null,
  onWaypointClick,
  height = 420,
}) {
  const containerRef = useRef(null);
  const list = useMemo(() => (trip ? [trip] : trips), [trip, trips]);

  return (
    <div className="trip-map-container" style={{ height }} ref={containerRef}>
      <MapContainer
        center={UK_CENTER}
        zoom={UK_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        {list.map((t) => {
          const positions = tripPolylinePositions(t);
          if (!positions || positions.length < 2) return null;
          const color = colorForTrip(t.id);
          return (
            <Polyline
              key={`trip-line-${t.id}`}
              positions={positions}
              pathOptions={{ color, weight: 4, opacity: 0.85 }}
            />
          );
        })}
        {trip && (trip.waypoints || []).map((w) => {
          const isSelected = selectedWaypointId === w.id;
          return (
            <CircleMarker
              key={`wp-${w.id}`}
              center={[w.latitude, w.longitude]}
              radius={isSelected ? 9 : 6}
              pathOptions={{
                color: isSelected ? '#facc15' : '#e2e8f0',
                fillColor: isSelected ? '#facc15' : colorForTrip(trip.id),
                fillOpacity: 0.95,
                weight: 2,
              }}
              eventHandlers={onWaypointClick ? {
                click: () => onWaypointClick(w),
              } : undefined}
            >
              <Popup>
                <div className="trip-popup">
                  <strong>{w.label || `Stop ${w.sequenceOrder + 1}`}</strong>
                  {w.score != null && <div>Score: {w.score}/10</div>}
                  {w.notes && <div className="trip-popup-notes">{w.notes}</div>}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        <FitBoundsOnTrips trips={list} />
      </MapContainer>
    </div>
  );
}

export default TripMap;
