import { LAND_PATH, WORLD } from '../data/worldDots';

// The land is precomputed (scripts/build-world-dots.mjs). Places are drawn on top
// with plain arithmetic, so nothing heavy ever runs in the browser.

// Class names are spelled out in full so a search for a class finds its use.
const PIN_CLASS = { home: 'pin pin-home', worked: 'pin pin-worked', visited: 'pin pin-visited' };
// Draw order: visited underneath, home on top of the crowded European cluster.
const LAYER = { visited: 0, worked: 1, home: 2 };
// Half the pin size, in viewBox units (10 per degree).
const HALF = { visited: 22, worked: 26, home: 26 };
const RING_HALF = 50;

function project(lon, lat) {
  const { bounds, unit } = WORLD;
  return [(lon - bounds.west) * unit, (bounds.north - lat) * unit];
}

function inBounds({ lon, lat }) {
  const { bounds } = WORLD;
  return lon >= bounds.west && lon <= bounds.east && lat <= bounds.north && lat >= bounds.south;
}

export default function WorldMap({ places }) {
  if (import.meta.env.DEV) {
    places.filter((p) => !inBounds(p)).forEach((p) => {
      console.warn(`WorldMap: ${p.name} is outside the map bounds and will not show.`);
    });
  }

  const pins = places.filter(inBounds).sort((a, b) => LAYER[a.kind] - LAYER[b.kind]);

  return (
    <svg
      className="map"
      viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <path className="map-land" d={LAND_PATH} />
      {pins.map((place) => {
        const [x, y] = project(place.lon, place.lat);
        const half = HALF[place.kind];
        return (
          <g key={place.name}>
            {place.kind === 'home' ? (
              <rect className="pin-ring" x={x - RING_HALF} y={y - RING_HALF} width={RING_HALF * 2} height={RING_HALF * 2} />
            ) : null}
            <rect className={PIN_CLASS[place.kind]} x={x - half} y={y - half} width={half * 2} height={half * 2}>
              <title>{place.name}</title>
            </rect>
          </g>
        );
      })}
    </svg>
  );
}
