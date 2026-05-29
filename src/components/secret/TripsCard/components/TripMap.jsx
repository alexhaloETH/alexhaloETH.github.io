import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// We deliberately do NOT use react-leaflet's MapContainer here. In React 19
// StrictMode every component mounts → cleanup → re-mounts, which interacts
// badly with the way MapContainer caches its Leaflet instance: the cleanup
// can tear down the DOM while keeping the stale map reference, then the
// second mount renders new tiles on top of the first set at a different
// zoom — the scattered "tiles from all over the world" look.
//
// Using Leaflet imperatively with a clean cleanup gives us a deterministic
// mount/unmount lifecycle that StrictMode can re-run without leaving
// orphaned DOM.

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

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const buildPopupHtml = (waypoint) => {
  const title = escapeHtml(waypoint.label || `Stop ${waypoint.sequenceOrder + 1}`);
  const score = waypoint.score != null
    ? `<div>Score: ${waypoint.score}/10</div>`
    : '';
  const notes = waypoint.notes
    ? `<div class="trip-popup-notes">${escapeHtml(waypoint.notes)}</div>`
    : '';
  return `<div class="trip-popup"><strong>${title}</strong>${score}${notes}</div>`;
};

function TripMap({
  trips = [],
  trip = null,
  selectedWaypointId = null,
  onWaypointClick,
  height = 420,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef({ polylines: [], markers: [] });

  // 1. Initialize the Leaflet map exactly once per mount, and clean it up on
  //    unmount. StrictMode will run this twice in dev — the cleanup makes
  //    the second run see a clean container.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // If a previous mount left a marker, scrub it so Leaflet doesn't refuse
    // to re-initialize this DOM node.
    if (container._leaflet_id) {
      container._leaflet_id = null;
      container.innerHTML = '';
    }

    const map = L.map(container, {
      center: UK_CENTER,
      zoom: UK_ZOOM,
      scrollWheelZoom: true,
      worldCopyJump: true,
    });

    const tileLayer = L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      subdomains: ['a', 'b', 'c'],
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Force the tile layer to re-evaluate which tiles it needs once the
    // container has its real size. We do this on the next frame AND once
    // more after layout has fully settled, because the parent flex/grid
    // can finish sizing several frames after mount.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      map.invalidateSize({ animate: false });
      tileLayer.redraw();
      raf2 = requestAnimationFrame(() => {
        map.invalidateSize({ animate: false });
        tileLayer.redraw();
      });
    });

    const observer = new ResizeObserver(() => {
      mapRef.current?.invalidateSize({ animate: false });
      tileLayer.redraw();
    });
    observer.observe(container);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      overlayRef.current = { polylines: [], markers: [] };
    };
  }, []);

  // 2. Sync the polyline + waypoint marker layers whenever the trips change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    // Tear down previous overlay layers.
    for (const layer of overlayRef.current.polylines) map.removeLayer(layer);
    for (const layer of overlayRef.current.markers) map.removeLayer(layer);

    const list = trip ? [trip] : trips;
    const polylines = [];
    const markers = [];
    const allPoints = [];

    for (const t of list) {
      const positions = tripPolylinePositions(t);
      if (positions && positions.length >= 2) {
        polylines.push(
          L.polyline(positions, {
            color: colorForTrip(t.id),
            weight: 4,
            opacity: 0.85,
          }).addTo(map),
        );
        allPoints.push(...positions);
      }
    }

    if (trip) {
      for (const w of trip.waypoints || []) {
        const isSelected = selectedWaypointId === w.id;
        const marker = L.circleMarker([w.latitude, w.longitude], {
          radius: isSelected ? 9 : 6,
          color: isSelected ? '#facc15' : '#e2e8f0',
          fillColor: isSelected ? '#facc15' : colorForTrip(trip.id),
          fillOpacity: 0.95,
          weight: 2,
        }).addTo(map);
        marker.bindPopup(buildPopupHtml(w));
        if (onWaypointClick) {
          marker.on('click', () => onWaypointClick(w));
        }
        markers.push(marker);
      }
    }

    overlayRef.current = { polylines, markers };

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 11 });
      }
    }

    return undefined;
  }, [trips, trip, selectedWaypointId, onWaypointClick]);

  return (
    <div
      className="trip-map-container"
      style={{ height }}
      ref={containerRef}
    />
  );
}

export default TripMap;
