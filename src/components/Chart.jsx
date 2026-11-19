import { places } from '@data/places';
import { LAND_PATH, WORLD } from '@data/worldDots';
import './Interlude.css';
import './Chart.css';

// The land is precomputed by the real site's scripts/build-world-dots.mjs; places
// are projected on top with plain arithmetic, so nothing heavy runs in the browser.
const R = { visited: 16, worked: 24, home: 26 };
const LAYER = { visited: 0, worked: 1, home: 2 };

function project(lon, lat) {
  const { bounds, unit } = WORLD;
  return [(lon - bounds.west) * unit, (bounds.north - lat) * unit];
}

function inBounds({ lon, lat }) {
  const { bounds } = WORLD;
  return lon >= bounds.west && lon <= bounds.east && lat <= bounds.north && lat >= bounds.south;
}

function joinNames(names) {
  if (names.length < 2) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function StarMap() {
  const pins = places.filter(inBounds).sort((a, b) => LAYER[a.kind] - LAYER[b.kind]);
  return (
    <svg className="starmap" viewBox={`0 0 ${WORLD.width} ${WORLD.height}`} aria-hidden="true" focusable="false">
      <path className="starmap-land" d={LAND_PATH} />
      {pins.map((place) => {
        const [x, y] = project(place.lon, place.lat);
        return (
          <g key={place.name} className={`pin pin-${place.kind}`}>
            {place.kind === 'home' ? <circle className="pin-orbit" cx={x} cy={y} r={R.home * 2.6} /> : null}
            <circle cx={x} cy={y} r={R[place.kind]}>
              <title>{place.name}</title>
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

export default function Chart() {
  const home = places.find((place) => place.kind === 'home');
  const worked = places.filter((place) => place.kind === 'worked').map((place) => place.name);
  const visited = places.filter((place) => place.kind === 'visited').map((place) => place.name);

  return (
    <section className="interlude interlude-chart" data-shot="chart" aria-labelledby="chart-title">
      <div className="wrap chart-grid">
        <div className="chart-copy">
          <h2 id="chart-title" className="statement">
            Based in {home?.name}
          </h2>
          {worked.length ? <p className="interlude-text">I have worked from {joinNames(worked)}.</p> : null}
          {visited.length ? (
            <p className="chart-visited">
              <span className="label">Conferences and meetups</span> {visited.join(', ')}
            </p>
          ) : null}
        </div>
        <figure className="panel chart-panel">
          <StarMap />
          <figcaption>
            <ul className="legend" aria-label="Map key">
              <li>
                <span className="key key-home" aria-hidden="true" />
                Home
              </li>
              <li>
                <span className="key key-worked" aria-hidden="true" />
                Worked from
              </li>
              <li>
                <span className="key key-visited" aria-hidden="true" />
                Conferences and meetups
              </li>
            </ul>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
