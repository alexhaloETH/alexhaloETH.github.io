import { places } from '../data/places';
import Window from './Window';
import WorldMap from './WorldMap';
import './Elsewhere.css';

function namesOf(kind) {
  return places.filter((place) => place.kind === kind).map((place) => place.name);
}

// "London, New York and Catania"
function joinNames(names) {
  if (names.length < 2) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export default function Elsewhere() {
  const home = places.find((place) => place.kind === 'home');
  const worked = namesOf('worked');
  const visited = namesOf('visited');

  return (
    <section className="band" aria-labelledby="elsewhere-title">
      <div className="wrap band-grid">
        <div className="band-copy">
          <h2 id="elsewhere-title" className="band-title">
            Based in {home?.name}
          </h2>
          {worked.length ? <p className="band-lede">I have worked from {joinNames(worked)}.</p> : null}
          {visited.length ? (
            <p className="band-visited">
              <strong>Also visited:</strong> {visited.join(', ')}.
            </p>
          ) : null}
        </div>

        <Window id="world" title="World map" meta={`${places.length} places`} className="map-window">
          <WorldMap places={places} />
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
              Visited
            </li>
          </ul>
        </Window>
      </div>
    </section>
  );
}
