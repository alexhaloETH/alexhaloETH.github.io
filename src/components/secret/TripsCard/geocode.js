// Client-side geocoding for points of interest. Tries, in order:
//   1. raw "lat, lng" coordinates
//   2. coordinates embedded in a Google Maps URL
//   3. a free-text address / postcode via OpenStreetMap Nominatim
// Returns { latitude, longitude, address }. Throws a friendly Error on failure.

export function parseCoords(input) {
  const s = (input || '').trim();

  const pair = s.match(/^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (pair) {
    const lat = parseFloat(pair[1]);
    const lng = parseFloat(pair[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { latitude: lat, longitude: lng };
    }
  }

  // https://www.google.com/maps/.../@51.604,-2.987,17z
  const at = s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) return { latitude: parseFloat(at[1]), longitude: parseFloat(at[2]) };

  // ...!3d51.604!4d-2.987 (place data form)
  const bang = s.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (bang) return { latitude: parseFloat(bang[1]), longitude: parseFloat(bang[2]) };

  // ?q=51.604,-2.987
  const q = s.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (q) return { latitude: parseFloat(q[1]), longitude: parseFloat(q[2]) };

  return null;
}

export async function geocode(query) {
  const direct = parseCoords(query);
  if (direct) return { ...direct, address: query };

  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  let res;
  try {
    res = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch {
    throw new Error('Could not reach the geocoding service. Paste coordinates or a Google Maps link instead.');
  }
  if (!res.ok) {
    throw new Error('Geocoding failed. Try a more specific address, or paste coordinates.');
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No match for that address. Add a town/postcode, or paste coordinates.');
  }
  const hit = data[0];
  return {
    latitude: parseFloat(hit.lat),
    longitude: parseFloat(hit.lon),
    address: hit.display_name || query,
  };
}
