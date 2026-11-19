// A loose debris field the ship is flying through: tumbling rocks at many depths,
// drifting astern. They give the scene parallax and a sense of speed.
import { Color, IcosahedronGeometry, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from 'three';

const FIELD = { x: 230, y: 90, z: 170 };
// Rocks shrink away inside this distance from the camera rather than fill the screen.
const NEAR = { start: 34, end: 14 };
// Rocks are recycled from the back of the field to the front. Over this distance at
// each end they fade from the dark of space and grow, so none pops in or out.
const EDGE = 70;

// A lumpy rock: an icosphere pushed in and out by a hash of each vertex position.
// Shared vertices get the same push, so the surface has no cracks.
function rockGeometry() {
  const geometry = new IcosahedronGeometry(1, 1);
  const pos = geometry.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    const k = Math.sin(Math.round(v.x * 1000) * 12.9898 + Math.round(v.y * 1000) * 78.233 + Math.round(v.z * 1000) * 37.719) * 43758.5453;
    const n = k - Math.floor(k);
    v.multiplyScalar(0.72 + 0.5 * n);
    pos.setXYZ(i, v.x * 1.15, v.y * 0.82, v.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function createDebris({ palette, count, rand, speed }) {
  const material = new MeshStandardMaterial({ color: palette.rock, roughness: 0.95, metalness: 0.05, flatShading: true });
  const mesh = new InstancedMesh(rockGeometry(), material, count);
  mesh.frustumCulled = false;

  const rocks = [];
  for (let i = 0; i < count; i += 1) {
    const p = new Vector3();
    // Keep clear of the hull itself.
    do {
      p.set((rand() - 0.5) * 2 * FIELD.x, (rand() - 0.5) * 2 * FIELD.y, (rand() - 0.5) * 2 * FIELD.z);
    } while (Math.abs(p.y) < 16 && Math.abs(p.z) < 20);
    const big = rand() > 0.88;
    rocks.push({
      p,
      size: big ? 3.5 + rand() * 3 : 0.5 + rand() ** 2 * 2.4,
      axis: new Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
      spin: 0.08 + rand() * 0.45,
      angle: rand() * Math.PI * 2,
      drift: speed * (0.55 + rand() * 0.5),
    });
  }

  const tint = new Color();
  const q = new Quaternion();
  const s = new Vector3();
  const m = new Matrix4();

  function update(dt, cameraPosition) {
    for (let i = 0; i < count; i += 1) {
      const r = rocks[i];
      r.p.x -= r.drift * dt;
      if (r.p.x < -FIELD.x) r.p.x += FIELD.x * 2;
      r.angle += r.spin * dt;
      q.setFromAxisAngle(r.axis, r.angle);
      const d = r.p.distanceTo(cameraPosition);
      const near = Math.min(1, Math.max(0, (d - NEAR.end) / (NEAR.start - NEAR.end)));
      const edge = Math.min(1, (FIELD.x - Math.abs(r.p.x)) / EDGE);
      const fade = edge * edge * (3 - 2 * edge);
      s.setScalar(r.size * near * (0.35 + 0.65 * fade));
      m.compose(r.p, q, s);
      mesh.setMatrixAt(i, m);
      // Instance colour multiplies the rock colour: black blends into the night sky.
      mesh.setColorAt(i, tint.setScalar(fade));
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
  }

  return { mesh, update };
}
