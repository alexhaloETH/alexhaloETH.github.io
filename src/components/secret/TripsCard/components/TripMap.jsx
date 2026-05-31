import { useEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity } from 'd3-zoom';
import europe from '../data/europe.json';

// The whole of Europe (country borders) is bundled straight into the JS as a
// GeoJSON FeatureCollection — no runtime fetch, no public asset, no 404. Vite
// inlines it at build time, so the map is always present the moment this
// component renders. Pure d3-geo SVG, navigable with d3-zoom (wheel/pinch/drag).
// The projection auto-frames whatever routes are shown; zoom out to reveal the
// rest of the continent.

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
  const svgRef = useRef(null);
  const zoomRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });

  const list = useMemo(() => (trip ? [trip] : trips), [trip, trips]);

  // Watch container size so the projection fits the rendered box.
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

  // The geometry the default view frames: the shown routes if any, else the
  // whole continent. Each route becomes a LineString feature.
  const framing = useMemo(() => {
    const features = [];
    for (const t of list) {
      const lonLats = tripLonLats(t);
      if (lonLats && lonLats.length >= 2) {
        features.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: lonLats },
          properties: {},
        });
      }
    }
    if (features.length === 0) return europe;
    return { type: 'FeatureCollection', features };
  }, [list]);

  // Mercator projection fitting the framing target into the container.
  const projection = useMemo(() => {
    if (size.w < 2 || size.h < 2) return null;
    const pad = 24;
    return geoMercator().fitExtent(
      [[pad, pad], [size.w - pad, size.h - pad]],
      framing,
    );
  }, [size.w, size.h, framing]);

  const pathGen = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  );

  // Pixel bounds of the whole continent, used to bound panning.
  const europeBounds = useMemo(
    () => (pathGen ? pathGen.bounds(europe) : null),
    [pathGen],
  );

  // Attach d3-zoom. Re-attaches (and re-frames to identity) whenever the
  // projection refits — i.e. when size or the shown routes change.
  useEffect(() => {
    if (!svgRef.current || size.w < 2 || size.h < 2) return undefined;
    const svg = select(svgRef.current);
    const zb = d3zoom()
      .scaleExtent([0.12, 24])
      .on('zoom', (event) => {
        const { k, x, y } = event.transform;
        setTransform({ k, x, y });
      });
    if (europeBounds) {
      const [[bx0, by0], [bx1, by1]] = europeBounds;
      const mx = (bx1 - bx0) * 0.4 || 200;
      const my = (by1 - by0) * 0.4 || 200;
      zb.translateExtent([[bx0 - mx, by0 - my], [bx1 + mx, by1 + my]]);
    }
    zoomRef.current = zb;
    svg.call(zb);
    svg.call(zb.transform, zoomIdentity); // start framed on the default view
    return () => { svg.on('.zoom', null); };
  }, [size.w, size.h, framing, europeBounds]);

  const zoomBy = (factor) => {
    if (!svgRef.current || !zoomRef.current) return;
    select(svgRef.current).call(zoomRef.current.scaleBy, factor);
  };

  const resetZoom = () => {
    if (!svgRef.current || !zoomRef.current) return;
    select(svgRef.current).call(zoomRef.current.transform, zoomIdentity);
  };

  // Project each shown trip's route into an SVG path string.
  const tripPaths = useMemo(() => {
    if (!projection || !pathGen) return [];
    const out = [];
    for (const t of list) {
      const lonLats = tripLonLats(t);
      if (!lonLats || lonLats.length < 2) continue;
      const d = pathGen({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: lonLats },
        properties: {},
      });
      if (d) out.push({ id: t.id, d, color: colorForTrip(t.id) });
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

  // Project the continent outline (all country borders) once per projection.
  const outlinePath = useMemo(
    () => (pathGen ? pathGen(europe) : null),
    [pathGen],
  );

  const { k } = transform;

  return (
    <div
      className="trip-map-container trip-map-svg"
      style={{ height }}
      ref={containerRef}
    >
      {size.w > 1 && size.h > 1 && (
        <svg
          ref={svgRef}
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="trip-map-svg-root"
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${k})`}>
            {/* Europe landmass fill + country borders */}
            {outlinePath && (
              <>
                <path d={outlinePath} className="trip-map-region-fill" />
                <path d={outlinePath} className="trip-map-region-stroke" />
              </>
            )}

            {/* Trip routes — non-scaling stroke keeps them crisp at any zoom */}
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
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Waypoints (only for a single selected trip). Radius is divided
                by k so dots stay a constant screen size as you zoom. */}
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
                  r={(wp.isSelected ? 8 : 5) / k}
                  className="trip-waypoint-dot-circle"
                />
                <title>
                  {wp.label || `Stop ${wp.sequenceOrder + 1}`}
                  {wp.score != null ? ` (${wp.score}/10)` : ''}
                  {wp.notes ? `\n${wp.notes}` : ''}
                </title>
              </g>
            ))}
          </g>
        </svg>
      )}

      <div className="trip-map-zoom-controls">
        <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1.5)}>+</button>
        <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.5)}>&minus;</button>
        <button type="button" aria-label="Reset view" className="reset" onClick={resetZoom}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TripMap;
