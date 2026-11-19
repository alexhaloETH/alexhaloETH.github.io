// Places on the travel map. To add one, copy a line and set its coordinates.
//
//   kind: 'home'    where you are based now (one place)
//         'worked'  places you have worked from
//         'visited' places you went for work trips: conferences and meetups
//
// Coordinates are decimal degrees (search "<city> coordinates"). They must sit inside
// the map bounds in scripts/build-world-dots.mjs: longitude -130 to 155, latitude -45 to 72.
// No rebuild step is needed; the map draws these on top of the precomputed land.

export const places = [
  { name: 'Cardiff', lat: 51.4816, lon: -3.1791, kind: 'home' },

  { name: 'London', lat: 51.5074, lon: -0.1278, kind: 'worked' },
  { name: 'New York', lat: 40.7128, lon: -74.006, kind: 'worked' },
  { name: 'Catania', lat: 37.5079, lon: 15.083, kind: 'worked' },

  { name: 'Lisbon', lat: 38.7223, lon: -9.1393, kind: 'visited' },
  { name: 'Budapest', lat: 47.4979, lon: 19.0402, kind: 'visited' },
  { name: 'Brussels', lat: 50.8503, lon: 4.3517, kind: 'visited' },
  { name: 'Nice', lat: 43.7102, lon: 7.262, kind: 'visited' },
  { name: 'Milan', lat: 45.4642, lon: 9.19, kind: 'visited' },
  { name: 'Napoli', lat: 40.8518, lon: 14.2681, kind: 'visited' },
  { name: 'Istanbul', lat: 41.0082, lon: 28.9784, kind: 'visited' },
  { name: 'Bangkok', lat: 13.7563, lon: 100.5018, kind: 'visited' },
  { name: 'Bali', lat: -8.4095, lon: 115.1889, kind: 'visited' },
];
