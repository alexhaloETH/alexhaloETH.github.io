// A procedural capital ship. Everything is built from code: a faceted hull lofted
// through cross-sections, swept wings, a bridge tower, three main engines, plating and
// window textures, and a few hundred small details for scale. Nose points along +x;
// starboard is +z, so the red port light sits on -z as it would on a real vessel.
import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
} from 'three';
import { hullTextures, seeded } from './textures';

// Cross-section shared by every lofted part: an octagon with hard chamfers, listed
// counter-clockwise from the top-right so the faces point outwards.
// Each point is [z, y] as a fraction of the station's half-width and height.
export const PROFILE = [
  [0.45, 1],
  [-0.45, 1],
  [-1, 0.25],
  [-0.86, -0.55],
  [-0.36, -1],
  [0.36, -1],
  [0.86, -0.55],
  [1, 0.25],
];
// Faces 2 and 6 are the flanks; 1 and 7 the upper chamfers. Windows go on those.
const WINDOW_FACES = [1, 2, 6, 7];

// Stations along the main hull, stern to nose: x, half-width, height above and below the
// centreline, and how far the centreline drops towards the prow.
const HULL = [
  { x: -22, w: 3.6, top: 1.9, bottom: 1.8, y: 0 },
  { x: -18, w: 4.4, top: 2.3, bottom: 2.1, y: 0 },
  { x: -9, w: 4.6, top: 2.5, bottom: 2.3, y: 0 },
  { x: 2, w: 4.2, top: 2.2, bottom: 2.0, y: -0.05 },
  { x: 12, w: 3.4, top: 1.6, bottom: 1.6, y: -0.15 },
  { x: 20, w: 2.6, top: 1.0, bottom: 1.15, y: -0.3 },
  { x: 25.5, w: 1.8, top: 0.55, bottom: 0.8, y: -0.4 },
  { x: 27, w: 1.1, top: 0.25, bottom: 0.45, y: -0.45 },
];

// Armoured sponsons along each flank; the aft ends carry the secondary engines.
const SPONSON = [
  { x: -21.5, w: 1.3, top: 1.0, bottom: 1.1, y: -0.3, z: 5.1 },
  { x: -12, w: 1.5, top: 1.25, bottom: 1.3, y: -0.3, z: 5.4 },
  { x: -1, w: 1.1, top: 0.9, bottom: 1.0, y: -0.3, z: 4.9 },
  { x: 4, w: 0.25, top: 0.2, bottom: 0.3, y: -0.3, z: 4.3 },
];

// The hangar bulge under the hull.
const HANGAR = [
  { x: -17, w: 1.4, top: 0.4, bottom: 0.5, y: -2.1 },
  { x: -14, w: 1.9, top: 0.4, bottom: 1.0, y: -2.1 },
  { x: 3, w: 1.7, top: 0.4, bottom: 0.8, y: -1.9 },
  { x: 8, w: 0.4, top: 0.3, bottom: 0.2, y: -1.7 },
];

// The armoured spine that runs along the top of the hull.
const SPINE = [
  { x: -19, w: 1.2, top: 0.9, bottom: 0.2, y: 2.4 },
  { x: -8, w: 1.35, top: 1.05, bottom: 0.2, y: 2.6 },
  { x: 4, w: 1.0, top: 0.7, bottom: 0.2, y: 2.15 },
  { x: 10, w: 0.3, top: 0.1, bottom: 0.2, y: 1.7 },
];

// The bridge tower, raked forward.
const TOWER = [
  { x: -15.5, w: 1.25, top: 2.4, bottom: 0.1, y: 3.4 },
  { x: -11, w: 1.1, top: 2.1, bottom: 0.1, y: 3.6 },
  { x: -7.5, w: 0.55, top: 0.9, bottom: 0.1, y: 3.6 },
  { x: -6.2, w: 0.1, top: 0.1, bottom: 0.1, y: 3.6 },
];

// Interpolate a station at any x, for placing details on the surface.
function stationAt(stations, x) {
  for (let i = 0; i < stations.length - 1; i += 1) {
    const a = stations[i];
    const b = stations[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x);
      const mix = (k) => a[k] + (b[k] - a[k]) * t;
      return { x, w: mix('w'), top: mix('top'), bottom: mix('bottom'), y: mix('y'), z: a.z === undefined ? 0 : mix('z') };
    }
  }
  return stations[x < stations[0].x ? 0 : stations.length - 1];
}

const mirror = (stations) => stations.map((st) => ({ ...st, z: -st.z }));

function point(station, [pz, py]) {
  const y = station.y + (py >= 0 ? py * station.top : py * station.bottom);
  return [station.x, y, (station.z || 0) + pz * station.w];
}

// Build a closed hull through the stations, capped at both ends.
export function loft(stations) {
  const n = PROFILE.length;
  const x0 = stations[0].x;
  const length = stations[stations.length - 1].x - x0;
  const pos = [];
  const uv = [];
  const shade = [];
  // Cheap ambient occlusion: full brightness on the upper deck, darker towards the keel.
  const tone = (py) => 0.4 + 0.6 * Math.pow((py + 1) / 2, 0.9);
  const push = (p, u, v, py = 0) => {
    pos.push(p[0], p[1], p[2]);
    uv.push(u, v);
    const c = tone(py);
    shade.push(c, c, c);
  };

  for (let k = 0; k < stations.length - 1; k += 1) {
    const a = stations[k];
    const b = stations[k + 1];
    const ua = (a.x - x0) / length;
    const ub = (b.x - x0) / length;
    for (let i = 0; i < n; i += 1) {
      const j = (i + 1) % n;
      const a0 = point(a, PROFILE[i]);
      const a1 = point(a, PROFILE[j]);
      const b0 = point(b, PROFILE[i]);
      const b1 = point(b, PROFILE[j]);
      const v0 = i / n;
      const v1 = (i + 1) / n;
      const pi = PROFILE[i][1];
      const pj = PROFILE[j][1];
      push(a0, ua, v0, pi);
      push(b0, ub, v0, pi);
      push(b1, ub, v1, pj);
      push(a0, ua, v0, pi);
      push(b1, ub, v1, pj);
      push(a1, ua, v1, pj);
    }
  }

  // End caps as triangle fans around the centre of each end section.
  // Caps take their texture from a strip at the end of the plating map (u under 0.12
  // or over 0.88, where there are no windows), laid out by the profile's own z and y.
  const cap = (station, facing) => {
    const centre = [station.x, station.y + (station.top - station.bottom) / 2, station.z || 0];
    const u0 = facing < 0 ? 0 : 0.88;
    const capUv = ([pz, py]) => [u0 + (pz + 1) * 0.06, (py + 1) * 0.5];
    const [cu, cv] = capUv([0, 0]);
    for (let i = 0; i < n; i += 1) {
      const j = (i + 1) % n;
      const p0 = point(station, PROFILE[i]);
      const p1 = point(station, PROFILE[j]);
      const [u0i, v0i] = capUv(PROFILE[i]);
      const [u1j, v1j] = capUv(PROFILE[j]);
      // Wound so the stern cap faces -x and the nose cap +x; reversed, both are culled
      // and you see into the hull from behind.
      if (facing < 0) {
        push(centre, cu, cv);
        push(p0, u0i, v0i, PROFILE[i][1]);
        push(p1, u1j, v1j, PROFILE[j][1]);
      } else {
        push(centre, cu, cv);
        push(p1, u1j, v1j, PROFILE[j][1]);
        push(p0, u0i, v0i, PROFILE[i][1]);
      }
    }
  };
  cap(stations[0], -1);
  cap(stations[stations.length - 1], 1);

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geometry.setAttribute('color', new Float32BufferAttribute(shade, 3));
  geometry.computeVertexNormals();
  return geometry;
}

// Exhaust plume: brightest at the nozzle, fading along its length and at its edges.
export function plumeMaterial(color) {
  return new ShaderMaterial({
    uniforms: { uColor: { value: color }, uPower: { value: 1 } },
    vertexShader: /* glsl */ `
      varying float vAlong;
      varying float vFacing;
      void main() {
        vAlong = uv.y;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normal);
        vFacing = abs(dot(n, normalize(-mv.xyz)));
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uPower;
      varying float vAlong;
      varying float vFacing;
      void main() {
        float fade = pow(1.0 - vAlong, 2.2);
        float a = fade * pow(vFacing, 1.6) * 0.55 * uPower;
        gl_FragColor = vec4(uColor * a, a);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });
}

export function buildShip({ palette, glow, anisotropy, detail }) {
  const ship = new Group();
  const rand = seeded(42);

  const { map, emissive } = hullTextures({ faces: PROFILE.length, windowFaces: WINDOW_FACES });
  map.anisotropy = anisotropy;
  emissive.anisotropy = anisotropy;

  const hullMat = new MeshStandardMaterial({
    color: palette.hull,
    map,
    emissive: new Color(1, 1, 1),
    emissiveMap: emissive,
    emissiveIntensity: 1.8,
    metalness: 0.35,
    roughness: 0.56,
    flatShading: true,
    vertexColors: true,
    envMapIntensity: 0.8,
  });
  const darkMat = new MeshStandardMaterial({
    color: palette.hullDark,
    metalness: 0.45,
    roughness: 0.5,
    flatShading: true,
    envMapIntensity: 0.7,
  });

  ship.add(new Mesh(loft(HULL), hullMat));
  ship.add(new Mesh(loft(SPINE), hullMat));
  ship.add(new Mesh(loft(TOWER), hullMat));
  ship.add(new Mesh(loft(SPONSON), hullMat), new Mesh(loft(mirror(SPONSON)), hullMat));
  ship.add(new Mesh(loft(HANGAR), darkMat));

  // Bridge glazing: a thin lit strip on the tower's forward face.
  const glass = new Mesh(new BoxGeometry(1.4, 0.06, 0.8), new MeshBasicMaterial({ color: palette.windowWarm }));
  glass.position.set(-8.9, 4.98, 0);
  glass.rotation.z = -0.33;
  ship.add(glass);

  // Main engines: three nozzles in the stern, with a hot core, a glow and a plume each.
  const engines = [];
  const plumeColor = new Color(palette.ion);
  const nozzleGeo = new CylinderGeometry(1.35, 1.0, 2.4, 14, 1, true);
  nozzleGeo.rotateZ(Math.PI / 2);
  const coreGeo = new CircleGeometry(0.7, 20);
  coreGeo.rotateY(-Math.PI / 2);
  const plumeGeo = new ConeGeometry(1.15, 16, 18, 1, true);
  plumeGeo.rotateZ(Math.PI / 2);
  const nozzleMat = darkMat.clone();
  nozzleMat.side = DoubleSide;
  const coreMat = new MeshBasicMaterial({ color: palette.ionHot });

  const enginePositions = [
    [0.95, 1.75],
    [0.95, -1.75],
    [-0.95, 0],
  ];
  for (const [y, z] of enginePositions) {
    const nozzle = new Mesh(nozzleGeo, nozzleMat);
    nozzle.position.set(-23.1, y, z);
    const core = new Mesh(coreGeo, coreMat);
    core.position.set(-23.9, y, z);
    const plume = new Mesh(plumeGeo, plumeMaterial(plumeColor));
    plume.position.set(-24.1 - 8, y, z);
    const halo = new Sprite(
      new SpriteMaterial({ map: glow, color: palette.ion, blending: AdditiveBlending, depthWrite: false, transparent: true }),
    );
    halo.position.set(-24.6, y, z);
    halo.scale.setScalar(4.4);
    ship.add(nozzle, core, plume, halo);
    engines.push({ plume, halo, phase: rand() * 10 });
  }

  // Secondary engines in the aft end of each sponson.
  const podNozzle = new CylinderGeometry(0.85, 0.65, 1.4, 12, 1, true);
  podNozzle.rotateZ(Math.PI / 2);
  const podCore = new CircleGeometry(0.5, 16);
  podCore.rotateY(-Math.PI / 2);
  for (const side of [1, -1]) {
    const nozzle = new Mesh(podNozzle, nozzleMat);
    nozzle.position.set(-22.1, -0.3, 5.1 * side);
    const core = new Mesh(podCore, coreMat);
    core.position.set(-22.5, -0.3, 5.1 * side);
    const podGlow = new Sprite(
      new SpriteMaterial({ map: glow, color: palette.ion, blending: AdditiveBlending, depthWrite: false, transparent: true }),
    );
    podGlow.position.set(-23, -0.3, 5.1 * side);
    podGlow.scale.setScalar(3.2);
    const podPlume = new Mesh(plumeGeo, plumeMaterial(plumeColor));
    podPlume.scale.set(0.55, 0.6, 0.55);
    podPlume.position.set(-22.8 - 4.8, -0.3, 5.1 * side);
    ship.add(nozzle, core, podGlow, podPlume);
    engines.push({ halo: podGlow, plume: podPlume, phase: rand() * 10 });
  }

  // Two dorsal turrets forward of the bridge.
  const turretBase = new CylinderGeometry(0.75, 0.9, 0.5, 10);
  const barrel = new BoxGeometry(2.6, 0.14, 0.14);
  const turrets = [];
  for (const x of [2.5, 7]) {
    const s = stationAt(SPINE, x);
    const turret = new Group();
    turret.position.set(x, s.y + s.top + 0.25, 0);
    turret.add(new Mesh(turretBase, darkMat));
    for (const dz of [-0.22, 0.22]) {
      const b = new Mesh(barrel, darkMat);
      b.position.set(1.3, 0.17, dz);
      turret.add(b);
    }
    ship.add(turret);
    turrets.push(turret);
  }

  // An antenna mast on the tower.
  const mast = new Mesh(new CylinderGeometry(0.05, 0.08, 2.4, 5), darkMat);
  mast.position.set(-13, 7.1, 0);
  ship.add(mast);

  // Greebles: a few hundred small blocks on the hull, the detail that reads as scale.
  const count = detail === 'low' ? 150 : 280;
  const greebles = new InstancedMesh(new BoxGeometry(1, 1, 1), darkMat, count);
  const dummy = new Object3D();
  const m = new Matrix4();
  for (let i = 0; i < count; i += 1) {
    const x = -19 + rand() * 33;
    const s = stationAt(HULL, x);
    const sx = 0.4 + rand() * 2.2;
    const sy = 0.12 + rand() * 0.42;
    const sz = 0.3 + rand() * 1.1;
    const where = rand();
    dummy.rotation.set(0, 0, 0);
    if (where < 0.4) {
      // On the upper deck, either side of the spine.
      const side = rand() > 0.5 ? 1 : -1;
      const z = side * (0.3 + rand() * 0.14) * s.w;
      dummy.position.set(x, s.y + s.top + sy / 2 - 0.02, z);
      dummy.scale.set(sx, sy, sz);
    } else if (where < 0.75) {
      // On the flanks, set into the plating.
      const side = rand() > 0.5 ? 1 : -1;
      const y = s.y + (rand() * 0.6 - 0.45) * s.top;
      dummy.position.set(x, y, side * (s.w * 0.95 + sy / 2));
      dummy.scale.set(sx, sz * 0.7, sy);
    } else {
      // Underneath.
      const z = (rand() - 0.5) * s.w * 0.7;
      dummy.position.set(x, s.y - s.bottom - sy / 2 + 0.02, z);
      dummy.scale.set(sx, sy, sz);
    }
    dummy.updateMatrix();
    m.copy(dummy.matrix);
    greebles.setMatrixAt(i, m);
  }
  ship.add(greebles);

  // Navigation lights: red to port, green to starboard, white strobes on top and astern.
  const nav = [];
  const navLight = (color, x, y, z, scale, blink) => {
    const sprite = new Sprite(
      new SpriteMaterial({ map: glow, color, blending: AdditiveBlending, depthWrite: false, transparent: true }),
    );
    sprite.position.set(x, y, z);
    sprite.scale.setScalar(scale);
    ship.add(sprite);
    nav.push({ sprite, blink, scale });
  };
  navLight(palette.navPort, -12, -0.3, -6.95, 1.5, null);
  navLight(palette.navStarboard, -12, -0.3, 6.95, 1.5, null);
  navLight(palette.strobe, -13, 8.35, 0, 2.4, { period: 1.6, offset: 0 });
  navLight(palette.strobe, 27.2, -0.45, 0, 1.6, { period: 1.6, offset: 0.8 });

  // Per-frame life: engines breathe, strobes flash.
  function update(t) {
    turrets.forEach((turret, i) => {
      turret.rotation.y = Math.sin(t * 0.32 + i * 1.9) * 0.75 + Math.sin(t * 0.11 + i) * 0.25;
    });
    for (const e of engines) {
      const flicker = 0.92 + 0.08 * Math.sin(t * 11 + e.phase) * Math.sin(t * 7.3 + e.phase * 2);
      e.halo.material.opacity = flicker * 0.75;
      if (e.plume) e.plume.material.uniforms.uPower.value = flicker;
    }
    for (const n of nav) {
      if (!n.blink) continue;
      const phase = (t + n.blink.offset) % n.blink.period;
      const on = phase < 0.09 || (phase > 0.22 && phase < 0.29);
      n.sprite.material.opacity = on ? 1 : 0;
    }
  }

  return { group: ship, update };
}
