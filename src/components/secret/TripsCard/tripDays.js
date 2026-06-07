export const DAY_COLORS = [
  '#38bdf8',
  '#34d399',
  '#fbbf24',
  '#f472b6',
  '#a78bfa',
  '#fb923c',
  '#22d3ee',
  '#facc15',
];

export function colorForDay(day) {
  const n = Number(day) || 1;
  return DAY_COLORS[(n - 1 + DAY_COLORS.length) % DAY_COLORS.length];
}

const EARTH_RADIUS_M = 6371000;

function haversineM(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const dLat = lat2 - lat1;
  const dLng = toRad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

function polylineDistanceM(points) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += haversineM(points[i - 1], points[i]);
  }
  return total;
}

function lineStringCoords(geometry) {
  if (
    geometry
    && geometry.type === 'LineString'
    && Array.isArray(geometry.coordinates)
    && geometry.coordinates.length >= 2
  ) {
    return geometry.coordinates;
  }
  return null;
}

function sqDistDeg(a, b) {
  const k = Math.cos((a[1] * Math.PI) / 180);
  const dx = (a[0] - b[0]) * k;
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function mapWaypointsToGeometry(wpLonLat, geom) {
  const idx = [];
  let start = 0;
  for (let i = 0; i < wpLonLat.length; i += 1) {
    let bestIdx = start;
    let bestDist = Infinity;
    for (let j = start; j < geom.length; j += 1) {
      const d = sqDistDeg(wpLonLat[i], geom[j]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = j;
      }
    }
    idx.push(bestIdx);
    start = bestIdx;
  }
  idx[0] = 0;
  idx[idx.length - 1] = geom.length - 1;
  return idx;
}

export function assignDays(orderedWaypoints) {
  let day = 1;
  return orderedWaypoints.map((w) => {
    const computedDay = day;
    if (w.isOvernight) day += 1;
    const hasOverride = w.dayNumber != null && w.dayNumber > 0;
    return {
      ...w,
      computedDay,
      effectiveDay: hasOverride ? w.dayNumber : computedDay,
    };
  });
}

export function buildDaySegments(dayWaypoints, routeGeometry) {
  if (!dayWaypoints || dayWaypoints.length < 2) return [];

  const wpLonLat = dayWaypoints.map((w) => [w.longitude, w.latitude]);
  const geom = lineStringCoords(routeGeometry);

  const legs = [];
  if (geom) {
    const idx = mapWaypointsToGeometry(wpLonLat, geom);
    for (let i = 0; i < dayWaypoints.length - 1; i += 1) {
      const day = dayWaypoints[i + 1].effectiveDay;
      let points = geom.slice(idx[i], idx[i + 1] + 1);
      if (points.length < 2) points = [wpLonLat[i], wpLonLat[i + 1]];
      legs.push({ day, points });
    }
  } else {
    for (let i = 0; i < dayWaypoints.length - 1; i += 1) {
      legs.push({
        day: dayWaypoints[i + 1].effectiveDay,
        points: [wpLonLat[i], wpLonLat[i + 1]],
      });
    }
  }

  const segments = [];
  for (const leg of legs) {
    const prev = segments[segments.length - 1];
    if (prev && prev.day === leg.day) {
      prev.points.push(...leg.points.slice(1));
    } else {
      segments.push({ day: leg.day, points: [...leg.points] });
    }
  }
  for (const seg of segments) {
    seg.color = colorForDay(seg.day);
    seg.distanceM = polylineDistanceM(seg.points);
  }
  return segments;
}

export function summarizeDays(dayWaypoints, segments, totalDurationS, totalDistanceM) {
  const order = [];
  const byDay = new Map();
  for (const w of dayWaypoints) {
    if (!byDay.has(w.effectiveDay)) {
      byDay.set(w.effectiveDay, { day: w.effectiveDay, stops: 0, campLabel: null });
      order.push(w.effectiveDay);
    }
    const entry = byDay.get(w.effectiveDay);
    entry.stops += 1;
    if (w.isOvernight) entry.campLabel = w.label || `Stop ${w.sequenceOrder + 1}`;
  }

  const distByDay = new Map();
  for (const seg of segments) {
    distByDay.set(seg.day, (distByDay.get(seg.day) || 0) + seg.distanceM);
  }
  const summedDist = Array.from(distByDay.values()).reduce((a, b) => a + b, 0);
  const totalDist = totalDistanceM != null && totalDistanceM > 0 ? totalDistanceM : summedDist;

  return order.map((day) => {
    const distanceM = distByDay.get(day) || 0;
    const durationS = totalDurationS != null && totalDist > 0
      ? totalDurationS * (distanceM / totalDist)
      : null;
    const entry = byDay.get(day);
    return {
      day,
      color: colorForDay(day),
      distanceM,
      durationS,
      stops: entry.stops,
      campLabel: entry.campLabel,
    };
  });
}

export function getTripDays(trip) {
  const ordered = [...(trip?.waypoints || [])].sort(
    (a, b) => a.sequenceOrder - b.sequenceOrder,
  );
  const dayWaypoints = assignDays(ordered);
  const segments = buildDaySegments(dayWaypoints, trip?.routeGeometry);
  const summary = summarizeDays(
    dayWaypoints,
    segments,
    trip?.durationS ?? null,
    trip?.distanceM ?? null,
  );
  return { dayWaypoints, segments, summary, dayCount: summary.length };
}
