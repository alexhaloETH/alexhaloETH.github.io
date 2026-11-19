// Escort fighters: two squadrons flying loops and figure-eights around the capital
// ship. Each fighter banks into its turns and draws a short fading engine trail.
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
} from 'three';
import { loft } from './ship';

// A small strike craft, nose along +x, about 4 units long against the capital ship's 50.
const BODY = [
  { x: -1.7, w: 0.42, top: 0.3, bottom: 0.26, y: 0 },
  { x: -0.7, w: 0.58, top: 0.42, bottom: 0.3, y: 0 },
  { x: 0.9, w: 0.36, top: 0.26, bottom: 0.2, y: -0.03 },
  { x: 2.2, w: 0.05, top: 0.04, bottom: 0.05, y: -0.06 },
];

// Flight paths around the capital ship, as functions of an angle. Squadron A circles
// the hull on a tilted ellipse; squadron B flies a faster figure-eight. Both stay
// inside 70 units of the hull: the closest camera shot sits at about 92.
const SQUADRONS = [
  {
    period: 24,
    phase: 0.4,
    tilt: 0.24,
    path: (a, out) => out.set(Math.cos(a) * 60, 7 + Math.sin(2 * a) * 6, Math.sin(a) * 38),
    slots: [
      [0, 0, 0],
      [-3.4, 0.5, 3],
      [-3.4, 0.5, -3],
    ],
  },
  {
    period: 18,
    phase: 2.2,
    tilt: -0.12,
    path: (a, out) => out.set(Math.sin(a) * 66, 13 + Math.cos(2 * a) * 8, Math.sin(2 * a) * 36),
    slots: [
      [0, 0, 0],
      [-3.2, -0.4, 2.8],
    ],
  },
];

const TRAIL_POINTS = 26;
const TAU = Math.PI * 2;

// Smooth, never-repeating wander in about -1..1: three sines at unrelated rates, with
// phases unique to each fighter. It is what stops a formation moving as one block.
function wobble(phases, t) {
  return (Math.sin(t + phases[0]) + 0.6 * Math.sin(t * 1.73 + phases[1]) + 0.35 * Math.sin(t * 2.91 + phases[2])) / 1.95;
}

const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10);
const UP = new Vector3(0, 1, 0);
// How strongly fighters bank into a turn (a stand-in for gravity in a coordinated turn).
const BANK_G = 4;

function trailMaterial(color) {
  return new ShaderMaterial({
    uniforms: { uColor: { value: color } },
    vertexShader: /* glsl */ `
      attribute float fade;
      varying float vFade;
      void main() {
        vFade = fade;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vFade;
      void main() {
        float a = vFade * 0.7;
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

// A ribbon through the last few positions of an engine, turned to face the camera.
function makeTrail(material, width) {
  const positions = new Float32Array(TRAIL_POINTS * 2 * 3);
  const fade = new Float32Array(TRAIL_POINTS * 2);
  const index = [];
  for (let i = 0; i < TRAIL_POINTS; i += 1) {
    const f = (1 - i / (TRAIL_POINTS - 1)) ** 1.6;
    fade[i * 2] = f;
    fade[i * 2 + 1] = f;
    if (i < TRAIL_POINTS - 1) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geometry = new BufferGeometry();
  const posAttr = new BufferAttribute(positions, 3);
  posAttr.setUsage(DynamicDrawUsage);
  geometry.setAttribute('position', posAttr);
  geometry.setAttribute('fade', new BufferAttribute(fade, 1));
  geometry.setIndex(index);
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;

  const history = Array.from({ length: TRAIL_POINTS }, () => new Vector3());
  let filled = 0;
  const tangent = new Vector3();
  const toCam = new Vector3();
  const side = new Vector3();

  function update(head, cameraPosition) {
    // Shift the history along by one and put the newest point at the front.
    const last = history.pop();
    last.copy(head);
    history.unshift(last);
    filled = Math.min(TRAIL_POINTS, filled + 1);
    for (let i = 0; i < TRAIL_POINTS; i += 1) {
      const p = history[Math.min(i, filled - 1)];
      const q = history[Math.min(i + 1, filled - 1)];
      tangent.subVectors(p, q);
      if (tangent.lengthSq() < 1e-6) tangent.set(1, 0, 0);
      toCam.subVectors(cameraPosition, p);
      side.crossVectors(tangent, toCam).normalize().multiplyScalar(width * (1 - i / TRAIL_POINTS));
      positions.set([p.x + side.x, p.y + side.y, p.z + side.z, p.x - side.x, p.y - side.y, p.z - side.z], i * 6);
    }
    posAttr.needsUpdate = true;
  }

  function reset() {
    filled = 0;
  }

  return { mesh, update, reset };
}

// `makeCraft`, when given, returns a dressed fighter model ({ group, update }) for each
// craft; without it the fighters are built from code.
export function createSquadrons({ palette, glow, rand, makeCraft = null }) {
  const group = new Group();
  const bodyGeo = loft(BODY);
  const wingGeo = new BoxGeometry(1.5, 0.07, 2.6);
  const bodyMat = new MeshStandardMaterial({
    color: palette.fighter,
    metalness: 0.5,
    roughness: 0.42,
    flatShading: true,
    vertexColors: true,
    envMapIntensity: 0.9,
  });
  const wingMat = new MeshStandardMaterial({ color: palette.fighterDark, metalness: 0.5, roughness: 0.5, flatShading: true });
  const glowMat = new SpriteMaterial({ map: glow, color: palette.ion, blending: AdditiveBlending, depthWrite: false, transparent: true });
  const trailMat = trailMaterial(new Color(palette.ion));

  // Each visit starts the squadrons somewhere different along their loops, and each
  // squadron surges and eases its speed on its own rhythm.
  const squadrons = SQUADRONS.map((sq) => ({
    ...sq,
    phase: sq.phase + rand() * TAU,
    surge: { amount: 0.35 + rand() * 0.2, rate: 0.13 + rand() * 0.1, phase: rand() * TAU },
  }));
  const phases = () => [rand() * TAU, rand() * TAU, rand() * TAU];

  const fighters = [];
  for (const squadron of squadrons) {
    for (const [index, slot] of squadron.slots.entries()) {
      const craft = new Group();
      const model = makeCraft ? makeCraft() : null;
      if (model) {
        craft.add(model.group);
      } else {
        craft.add(new Mesh(bodyGeo, bodyMat));
        for (const s of [1, -1]) {
          const w = new Mesh(wingGeo, wingMat);
          w.position.set(-0.75, -0.06, 1.15 * s);
          w.rotation.y = 0.42 * s;
          craft.add(w);
        }
        const engine = new Sprite(glowMat);
        engine.position.set(-1.95, 0, 0);
        engine.scale.setScalar(2.2);
        craft.add(engine);
      }
      craft.matrixAutoUpdate = false;
      const trail = makeTrail(trailMat, 0.32);
      group.add(craft, trail.mesh);
      fighters.push({
        craft,
        model,
        trail,
        squadron,
        slot,
        // Wingmen trail the leader along the path by a fraction of a second, so the
        // formation stretches through turns instead of pivoting like one object.
        lag: index * (0.12 + rand() * 0.1),
        drift: [phases(), phases(), phases(), phases()],
        nextRoll: 6 + rand() * 14,
        rollStart: -1,
      });
    }
  }

  // Scratch objects, reused every frame.
  const p0 = new Vector3();
  const p1 = new Vector3();
  const pm = new Vector3();
  const forward = new Vector3();
  const accel = new Vector3();
  const up = new Vector3();
  const right = new Vector3();
  const pos = new Vector3();
  const tail = new Vector3();
  const tmp = new Vector3();
  const basis = new Matrix4();
  const h = 0.05;

  function pathAt(squadron, t, out) {
    const { surge } = squadron;
    const a = (t / squadron.period) * TAU + squadron.phase + surge.amount * Math.sin(t * surge.rate + surge.phase);
    squadron.path(a, out);
    // Tilt the whole loop about x so it is not flat to the camera.
    const c = Math.cos(squadron.tilt);
    const s = Math.sin(squadron.tilt);
    const y = out.y * c - out.z * s;
    out.z = out.y * s + out.z * c;
    out.y = y;
    return out;
  }

  // Roll the frame about the direction of travel.
  function roll(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    tmp.copy(up).multiplyScalar(c).addScaledVector(right, s);
    right.multiplyScalar(c).addScaledVector(up, -s);
    up.copy(tmp);
  }

  function update(t, cameraPosition, withTrails = true) {
    for (const f of fighters) {
      const { squadron, slot, drift } = f;
      const tf = t - f.lag;
      pathAt(squadron, tf - h, pm);
      pathAt(squadron, tf, p0);
      pathAt(squadron, tf + h, p1);
      forward.subVectors(p1, pm).normalize();
      // Lateral acceleration tilts the lift vector: that is the bank.
      accel.copy(p1).add(pm).addScaledVector(p0, -2).divideScalar(h * h);
      accel.addScaledVector(forward, -accel.dot(forward));
      up.copy(UP).multiplyScalar(BANK_G).add(accel).normalize();
      right.crossVectors(forward, up).normalize();
      up.crossVectors(right, forward);
      // Each pilot holds formation loosely: a slow wander around its slot.
      pos
        .copy(p0)
        .addScaledVector(forward, slot[0] + wobble(drift[0], t * 0.4) * 0.9)
        .addScaledVector(up, slot[1] + wobble(drift[1], t * 0.5) * 0.8)
        .addScaledVector(right, slot[2] + wobble(drift[2], t * 0.45) * 1.1);

      // A little independent roll, and now and then a full barrel roll.
      let angle = wobble(drift[3], t * 0.8) * 0.16;
      if (withTrails) {
        if (f.rollStart < 0 && t >= f.nextRoll) f.rollStart = t;
        if (f.rollStart >= 0) {
          const p = (t - f.rollStart) / 1.3;
          if (p >= 1) {
            f.rollStart = -1;
            f.nextRoll = t + 9 + rand() * 16;
          } else {
            angle += TAU * smoother(p);
          }
        }
      }
      roll(angle);
      basis.makeBasis(forward, up, right).setPosition(pos);
      f.craft.matrix.copy(basis);
      f.craft.matrixWorldNeedsUpdate = true;
      if (f.model) f.model.update(t);
      if (withTrails) {
        tail.copy(pos).addScaledVector(forward, -2);
        f.trail.update(tail, cameraPosition);
      }
      f.trail.mesh.visible = withTrails;
    }
  }

  return { group, update };
}
