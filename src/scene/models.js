// Ship models made in Blender for this site (public/models, see CREDITS.md there).
// Each model carries named empties: engine_N at every nozzle exit, nav_port,
// nav_starboard and strobe_N for the lights, and turret_N objects that turn. The scene
// hangs the same engine glow, exhaust, lights and turret motion on them as it does on
// the procedural ships, which stay as the fallback when a file cannot be loaded.
import {
  AdditiveBlending,
  Box3,
  CircleGeometry,
  Color,
  ConeGeometry,
  FrontSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { plumeMaterial } from './ship';

const BASE = `${import.meta.env.BASE_URL}models/`;

// Resolves to the model's scene, or null if it fails or takes longer than `timeout` ms.
export function loadModel(name, timeout) {
  const load = new GLTFLoader().loadAsync(`${BASE}${name}.glb`).then((gltf) => gltf.scene);
  const late = new Promise((resolve) => {
    setTimeout(() => resolve(null), timeout);
  });
  return Promise.race([load, late]).catch(() => null);
}

// The nozzle's inner radius, read from the hull around an engine empty: the smallest
// ring that several vertices share, just inside the exit.
function nozzleRadius(hull, engine, length) {
  const fallback = length * 0.02;
  if (!hull.isMesh || engine.parent !== hull) return fallback;
  const pos = hull.geometry.attributes.position;
  const { x: ex, y: ey, z: ez } = engine.position;
  const depth = length * 0.03;
  const radii = [];
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    if (x < ex - depth || x > ex + depth * 0.05) continue;
    const r = Math.hypot(pos.getY(i) - ey, pos.getZ(i) - ez);
    if (r > length * 0.002 && r < length * 0.06) radii.push(r);
  }
  radii.sort((a, b) => a - b);
  const tolerance = length * 0.004;
  for (let i = 0; i + 7 < radii.length; i += 1) {
    if (radii[i + 7] - radii[i] < tolerance) return radii[i];
  }
  return fallback;
}

function glowSprite(glow, color, scale) {
  const sprite = new Sprite(
    new SpriteMaterial({ map: glow, color, blending: AdditiveBlending, depthWrite: false, transparent: true }),
  );
  sprite.scale.setScalar(scale);
  return sprite;
}

// Wrap a loaded model in a group and give it engines, lights and turrets that move.
// `small` is for craft that only ever cover a few dozen pixels (the fighters): one
// engine glow instead of a full set per nozzle, no plumes (they draw trails instead),
// no strobes and no normal map. Every sprite is a draw call, and there are five of them.
// `singleSided` culls back faces. The exporter marks every material double-sided, which
// roughly doubled the capital ship's cost on a Pi; rendered from each camera shot both
// ways, its hull differed by a few rim pixels. The visitor keeps both sides: it has thin
// flat panels that would vanish from behind.
export function dressShip(model, { palette, glow, anisotropy, rand, small = false, singleSided = false, emissive = 1.5 }) {
  const group = new Group();
  group.add(model);
  model.updateMatrixWorld(true);
  const length = new Box3().setFromObject(model).getSize(new Vector3()).x;

  const named = {};
  model.traverse((node) => {
    if (node.name) named[node.name] = node;
    if (!node.isMesh) return;
    const m = node.material;
    m.envMapIntensity = 0.8;
    m.emissiveIntensity = emissive;
    if (small) m.normalMap = null;
    if (singleSided) m.side = FrontSide;
    for (const key of ['map', 'normalMap', 'emissiveMap', 'roughnessMap']) {
      if (m[key]) m[key].anisotropy = anisotropy;
    }
  });
  const each = (prefix) => {
    const found = [];
    for (let i = 0; named[`${prefix}${i}`]; i += 1) found.push(named[`${prefix}${i}`]);
    return found;
  };

  // Engines: a hot core across the nozzle exit, a glow around it, a fainter bloom that
  // spills over the hull, and an exhaust plume trailing behind. All are sized from the
  // nozzle and flicker slightly out of step with each other.
  const plumeColor = new Color(palette.ion);
  const coreMaterial = new MeshBasicMaterial({ color: palette.ionHot });
  const nozzles = each('engine_');
  if (small && nozzles.length) {
    // One glow centred between the nozzles, sized like the procedural fighter's.
    const halo = glowSprite(glow, palette.ion, length * 0.55);
    for (const empty of nozzles) halo.position.add(empty.position);
    halo.position.divideScalar(nozzles.length);
    halo.position.x -= length * 0.02;
    nozzles[0].parent.add(halo);
  }
  const engines = (small ? [] : nozzles).map((empty) => {
    const r = nozzleRadius(empty.parent, empty, length);
    const coreGeometry = new CircleGeometry(r * 0.85, 24);
    coreGeometry.rotateY(-Math.PI / 2);
    const core = new Mesh(coreGeometry, coreMaterial);
    core.position.x = -r * 0.02;
    const halo = glowSprite(glow, palette.ion, r * 4.6);
    halo.position.x = -r * 0.4;
    const bloom = glowSprite(glow, palette.ion, r * 9);
    bloom.position.x = -r * 0.6;
    const plumeGeometry = new ConeGeometry(r * 0.9, r * 13, 18, 1, true);
    // Tip pointing back along the exhaust (local -x), base at the nozzle.
    plumeGeometry.rotateZ(Math.PI / 2);
    plumeGeometry.translate(-r * 6.5, 0, 0);
    const plume = new Mesh(plumeGeometry, plumeMaterial(plumeColor));
    empty.add(core, halo, bloom, plume);
    return { halo, bloom, plume, phase: rand() * 10 };
  });

  // Navigation lights: steady red to port and green to starboard, white strobes.
  const lightSize = Math.max(length * 0.03, 0.45);
  for (const [name, color] of [
    ['nav_port', palette.navPort],
    ['nav_starboard', palette.navStarboard],
  ]) {
    if (named[name]) named[name].add(glowSprite(glow, color, lightSize));
  }
  const strobes = (small ? [] : each('strobe_')).map((empty, i) => {
    const sprite = glowSprite(glow, palette.strobe, lightSize * (i === 0 ? 1.6 : 1.1));
    empty.add(sprite);
    return { sprite, offset: (i * 0.8 + rand() * 0.3) % 1.6 };
  });

  const turrets = each('turret_').map((turret, i) => ({ turret, rest: turret.rotation.y, phase: i * 1.9 + rand() }));

  function update(t) {
    for (const { turret, rest, phase } of turrets) {
      turret.rotation.y = rest + Math.sin(t * 0.32 + phase) * 0.75 + Math.sin(t * 0.11 + phase) * 0.25;
    }
    for (const e of engines) {
      const flicker = 0.92 + 0.08 * Math.sin(t * 11 + e.phase) * Math.sin(t * 7.3 + e.phase * 2);
      e.halo.material.opacity = flicker * 0.85;
      e.bloom.material.opacity = flicker * 0.22;
      e.plume.material.uniforms.uPower.value = flicker;
    }
    for (const s of strobes) {
      const p = (t + s.offset) % 1.6;
      s.sprite.material.opacity = p < 0.09 || (p > 0.22 && p < 0.29) ? 1 : 0;
    }
  }

  return { group, update, length };
}
