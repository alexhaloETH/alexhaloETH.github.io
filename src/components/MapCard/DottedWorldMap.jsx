import React, { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import { geoContains, geoEquirectangular } from "d3-geo";
import { motion } from "framer-motion";

export default function DottedWorldMap({
  places = [],
  dotStepDeg = 2.5,
  className = "",
  onReady,
  activePlaceId,
}) {
  const [land, setLand] = useState(null);
  const [size, setSize] = useState({ w: 1, h: 1 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({
        w: Math.max(1, Math.floor(width)),
        h: Math.max(1, Math.floor(height)),
      });
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json"
      );
      const world = await res.json();
      const landFeature = feature(world, world.objects.land);
      if (!cancelled) setLand(landFeature);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const projection = useMemo(() => {
    if (!land || !size.w || !size.h) return null;

    const p = geoEquirectangular().fitSize([size.w, size.h], {
      type: "Sphere",
    });

    return p.scale(p.scale() * 1.08);
  }, [land, size.w, size.h]);

  const bgDots = useMemo(() => {
    if (!land || !projection) return [];
    const dots = [];
    const step = dotStepDeg;

    for (let lat = -60; lat <= 80; lat += step) {
      for (let lon = -180; lon <= 180; lon += step) {
        const coord = [lon, lat];

        if (geoContains(land, coord)) {
          const p = projection(coord);
          if (!p) continue;

          dots.push({
            id: `bg-${lon.toFixed(2)}-${lat.toFixed(2)}`,
            x: p[0],
            y: p[1],
          });
        }
      }
    }

    return dots;
  }, [land, projection, dotStepDeg]);

  const placeDots = useMemo(() => {
    if (!projection) return [];
    return places
      .map((p) => {
        const xy = projection([p.lon, p.lat]);
        if (!xy) return null;
        return { ...p, x: xy[0], y: xy[1] };
      })
      .filter(Boolean);
  }, [places, projection]);

  const ready =
    !!projection && bgDots.length > 0 && size.w > 1 && size.h > 1;

  useEffect(() => {
    if (ready) onReady?.(true);
  }, [ready, onReady]);

  return (
    <div ref={containerRef} className={`dotted-map ${className}`}>
      <svg
  className="world-map-svg"
  width="100%"
  height="100%"
  viewBox={`0 0 ${size.w} ${size.h}`}
  preserveAspectRatio="xMidYMid meet"
>
  <g>
    {bgDots.map((d, i) => (
      <motion.circle
        key={d.id}
        className="bg-dot"
        cx={d.x}
        cy={d.y}
        r={1.4}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: (i % 200) * 0.002 }}
      />
    ))}
  </g>

  <g>
    {placeDots.map((d) => {
      const isActive = d.id === activePlaceId;

      return (
        <motion.circle
          key={d.id}
          className={isActive ? "place-dot is-active" : "place-dot"}
          cx={d.x}
          cy={d.y}
          r={isActive ? 6 : 3.6}
          initial={false}
          animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={
            isActive
              ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.45, ease: "easeInOut" }
          }
        />
      );
    })}
  </g>

  {/* ✅ Active "handoff" ripple */}
  <g>
    {(() => {
      const active = placeDots.find((p) => p.id === activePlaceId);
      if (!active) return null;

      return (
        <motion.circle
          key={`ring-${activePlaceId}`}
          cx={active.x}
          cy={active.y}
          r={10}
          className="active-ring"
          initial={{ opacity: 0.45, scale: 0.6 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      );
    })()}
  </g>
</svg>

    </div>
  );
}
