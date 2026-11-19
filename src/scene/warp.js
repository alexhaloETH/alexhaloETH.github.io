// Now and then another ship drops out of warp in the distance: a streak of light, a
// flash, a slow cruise across the frame, then it jumps away again.
import { AdditiveBlending, Color, CylinderGeometry, Group, Mesh, Sprite, SpriteMaterial, Vector3 } from 'three';
import { plumeMaterial } from './ship';

const DISTANCE = 340;
const TIMING = { in: 0.7, cruise: 11, out: 0.55 };
const CRUISE_SPEED = 9;

// The ship itself arrives through setShip, once its model has loaded (or the scene has
// given up on it and passed a stand-in). Until then nobody drops out of warp.
export function createVisitor({ palette, glow, rand }) {
  const holder = new Group();
  holder.visible = false;

  let ship = null;
  let scale = 1;
  let animate = null;

  function setShip({ object, size = 1, update = null }) {
    if (ship) holder.remove(ship);
    ship = object;
    scale = size;
    animate = update;
    ship.position.set(0, 0, 0);
    ship.rotation.set(0, 0, 0);
    ship.scale.setScalar(scale);
    holder.add(ship);
  }

  // The light streak behind the ship while it is in warp: a tube from -1 to 0 on x,
  // brightest at the ship end.
  const streakGeo = new CylinderGeometry(1.4, 1.4, 1, 10, 1, true);
  streakGeo.rotateZ(Math.PI / 2);
  streakGeo.translate(-0.5, 0, 0);
  const streak = new Mesh(streakGeo, plumeMaterial(new Color(palette.warp)));
  holder.add(streak);

  const flash = new Sprite(
    new SpriteMaterial({
      map: glow,
      color: palette.warp,
      blending: AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0,
      toneMapped: false,
    }),
  );
  flash.scale.setScalar(70);
  holder.add(flash);

  let state = 'wait';
  let next = 7 + rand() * 4;
  let t0 = 0;
  const dir = new Vector3();
  const right = new Vector3();
  const up = new Vector3();
  const forward = new Vector3();
  const side = new Vector3();

  function setStreak(length, power) {
    streak.visible = length > 0.5;
    streak.scale.set(length, 1, 1);
    streak.material.uniforms.uPower.value = power;
  }

  // Arrive on the half of the screen away from the capital ship. The point is picked in
  // screen space and projected into the scene, because the camera's frame is shifted
  // (see placeCamera) and its centre line is not the middle of the screen.
  function spawn(t, camera, shot) {
    camera.matrixWorld.extractBasis(right, up, forward);
    const away = shot.sx > 0.05 ? -1 : shot.sx < -0.05 ? 1 : rand() < 0.5 ? -1 : 1;
    // Near the middle and high up, in open sky rather than behind the copy's scrim.
    const nx = away * (0.12 + rand() * 0.25);
    // Portrait shots keep the ship at the top, so arrive just below it, above the copy.
    const ny = shot.sy < -0.1 ? 0.05 + rand() * 0.2 : 0.42 + rand() * 0.3;
    side.set(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize();
    holder.position.copy(camera.position).addScaledVector(side, DISTANCE);
    // Travel across the screen towards the middle, a little away from the camera.
    forward.negate();
    dir.copy(right).multiplyScalar(-away).addScaledVector(forward, 0.35).normalize();
    side.crossVectors(dir, up).normalize();
    const yAxis = new Vector3().crossVectors(side, dir);
    holder.matrix.makeBasis(dir, yAxis, side).setPosition(holder.position);
    holder.matrix.decompose(holder.position, holder.quaternion, holder.scale);
    holder.visible = true;
    state = 'in';
    t0 = t;
  }

  function update(t, dt, camera, shot) {
    if (state === 'wait') {
      if (ship && t > next) spawn(t, camera, shot);
      return;
    }
    if (animate) animate(t);
    const p = (t - t0) / TIMING[state];
    if (state === 'in') {
      const e = 1 - (1 - Math.min(1, p)) ** 3;
      ship.position.x = -(1 - e) * 260;
      ship.scale.set(scale * (1 + 22 * (1 - e)), scale, scale);
      setStreak(220 * (1 - e) + 10 * (1 - p), 1 - p * 0.6);
      flash.material.opacity = Math.max(0, (p - 0.65) / 0.35);
      if (p >= 1) {
        state = 'cruise';
        t0 = t;
      }
    } else if (state === 'cruise') {
      holder.position.addScaledVector(dir, CRUISE_SPEED * dt);
      ship.position.x = 0;
      ship.scale.setScalar(scale);
      setStreak(0, 0);
      flash.material.opacity = Math.max(0, 1 - p * 9);
      if (p >= 1) {
        state = 'out';
        t0 = t;
      }
    } else if (state === 'out') {
      const e = Math.min(1, p) ** 3;
      ship.position.x = e * 520;
      ship.scale.set(scale * (1 + 26 * e), scale, scale);
      setStreak(Math.min(260, e * 520 + 20 * p), 1 - e * 0.5);
      flash.material.opacity = Math.max(0, 1 - p * 4);
      flash.position.set(0, 0, 0);
      if (p >= 1) {
        holder.visible = false;
        state = 'wait';
        next = t + 15 + rand() * 13;
      }
    }
    // The streak trails the ship wherever it is along the jump.
    streak.position.x = ship.position.x;
  }

  // For testing: jump on the next frame instead of waiting.
  function trigger() {
    if (state === 'wait') next = 0;
  }

  return { group: holder, update, trigger, setShip };
}
