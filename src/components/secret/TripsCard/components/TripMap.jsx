import { useEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';

// Whole UK (England, Scotland, Wales, NI, surrounding islands) shipped
// statically in /public as a 76 KB GeoJSON MultiPolygon. No network
// dependency at runtime — no OSM tile loading, no rate limits, no race
// conditions with parent layout. Just a crisp SVG outline.
const OUTLINE_URL = '/uk-outline.geo.json';

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

const geometryToLonLats = (geometry) => {
  if (!geometry || geometry.type !== 'LineString' || !Array.isArray(geometry.coordinates)) {
    return null;
  }
  // GeoJSON is already [lon, lat] — exactly what d3-geo wants.
  return geometry.coordinates;
};

const waypointsToLonLats = (waypoints) => (
  (waypoints || []).map((w) => [w.longitude, w.latitude])
);

const tripLonLats = (trip) => (
  geometryToLonLats(trip.routeGeometry) || waypointsToLonLats(trip.waypoints)
);

function TripMap({
  trips = [],
  trip = null,
  selectedWaypointId = null,
  onWaypointClick,
  height = 420,
}) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [outline, setOutline] = useState(null);

  // Watch container size.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height: h } = entry.contentRect;
      setSize({
        w: Math.max(1, Math.floor(width)),
        h: Math.max(1, Math.floor(h)),
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load the UK outline GeoJSON once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(OUTLINE_URL);
        const data = await res.json();
        if (cancelled) return;
        setOutline(data);
      } catch (error) {
        console.error('Failed to load UK outline:', error);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Build a Mercator projection that fits the UK into the container.
  const projection = useMemo(() => {
    if (!outline || size.w < 2 || size.h < 2) return null;
    return geoMercator().fitExtent(
      [[12, 12], [size.w - 12, size.h - 12]],
      outline,
    );
  }, [outline, size.w, size.h]);

  const pathGen = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  );

  const list = trip ? [trip] : trips;

  // Project each trip's route into an SVG path string.
  const tripPaths = useMemo(() => {
    if (!projection || !pathGen) return [];
    const out = [];
    for (const t of list) {
      const lonLats = tripLonLats(t);
      if (!lonLats || lonLats.length < 2) continue;
      const lineFeature = {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: lonLats },
        properties: {},
      };
      const d = pathGen(lineFeature);
      if (d) {
        out.push({
          id: t.id,
          d,
          color: colorForTrip(t.id),
        });
      }
    }
    return out;
  }, [list, projection, pathGen]);

  // Project waypoints to pixel coords (only for a selected single trip).
  const waypointPoints = useMemo(() => {
    if (!projection || !trip) return [];
    return (trip.waypoints || []).map((w) => {
      const xy = projection([w.longitude, w.latitude]);
      if (!xy) return null;
      return {
        id: w.id,
        sequenceOrder: w.sequenceOrder,
        label: w.label,
        notes: w.notes,
        score: w.score,
        x: xy[0],
        y: xy[1],
        isSelected: selectedWaypointId === w.id,
      };
    }).filter(Boolean);
  }, [trip, projection, selectedWaypointId]);

  // Project the UK outline path.
  const outlinePath = useMemo(() => {
    if (!outline || !pathGen) return null;
    return pathGen(outline);
  }, [outline, pathGen]);

  return (
    <div
      className="trip-map-container trip-map-svg"
      style={{ height }}
      ref={containerRef}
    >
      {size.w > 1 && size.h > 1 && (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="trip-map-svg-root"
        >
          {/* UK landmass fill + coast outline */}
          {outlinePath && (
            <>
              <path d={outlinePath} className="trip-map-region-fill" />
              <path d={outlinePath} className="trip-map-region-stroke" />
            </>
          )}

          {/* Trip routes */}
          {tripPaths.map((t) => (
            <path
              key={`trip-${t.id}`}
              d={t.d}
              fill="none"
              stroke={t.color}
              strokeWidth={3}
              strokeOpacity={0.95}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}

          {/* Waypoints (only for a single selected trip) */}
          {waypointPoints.map((wp) => (
            <g
              key={`wp-${wp.id}`}
              transform={`translate(${wp.x},${wp.y})`}
              className={wp.isSelected ? 'trip-waypoint-dot is-selected' : 'trip-waypoint-dot'}
              onClick={onWaypointClick ? () => onWaypointClick({
                id: wp.id,
                sequenceOrder: wp.sequenceOrder,
              }) : undefined}
              style={onWaypointClick ? { cursor: 'pointer' } : undefined}
            >
              <circle
                r={wp.isSelected ? 8 : 5}
                className="trip-waypoint-dot-circle"
              />
              <title>
                {wp.label || `Stop ${wp.sequenceOrder + 1}`}
                {wp.score != null ? ` (${wp.score}/10)` : ''}
                {wp.notes ? `\n${wp.notes}` : ''}
              </title>
            </g>
          ))}
        </svg>
      )}

      {!outline && (
        <div className="trip-map-loading">Loading map…</div>
      )}
    </div>
  );
}

export default TripMap;
