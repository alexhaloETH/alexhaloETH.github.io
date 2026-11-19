// The background scene: a capital ship in deep space, a ring megastructure far off,
// layered stars, drifting dust and the odd shooting star. The camera moves between
// "shots" as the reader scrolls, one shot per element marked with data-shot.
//
// Loaded lazily after the page is interactive (see main.jsx), so none of this delays
// the content. Colours come from the --scene-* tokens in tokens.css.
import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  CubeCamera,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Fog,
  Float32BufferAttribute,
  Group,
  HalfFloatType,
  HemisphereLight,
  LineSegments,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  UnsignedByteType,
  Vector3,
  WebGLCubeRenderTarget,
  WebGLRenderer,
} from 'three';
import { createDebris } from './debris';
import { createSquadrons } from './fighters';
import { dressShip, loadModel } from './models';
import { buildShip } from './ship';
import { createVisitor } from './warp';
import { glowTexture, seeded } from './textures';

const TOKENS = {
  space: '--scene-space',
  hull: '--scene-hull',
  hullDark: '--scene-hull-dark',
  ion: '--scene-ion',
  ionHot: '--scene-ion-hot',
  sun: '--scene-sun',
  key: '--scene-key',
  rim: '--scene-rim',
  windowWarm: '--scene-window',
  navPort: '--scene-nav-port',
  navStarboard: '--scene-nav-starboard',
  strobe: '--scene-strobe',
  ringOuter: '--scene-ring-outer',
  ringInner: '--scene-ring-inner',
  ringEdge: '--scene-ring-edge',
  nebulaA: '--scene-nebula-a',
  nebulaB: '--scene-nebula-b',
  nebulaC: '--scene-nebula-c',
  starCool: '--scene-star-cool',
  starWhite: '--scene-star-white',
  starWarm: '--scene-star-warm',
  meteor: '--scene-meteor',
  fighter: '--scene-fighter',
  fighterDark: '--scene-fighter-dark',
  rock: '--scene-rock',
  warp: '--scene-warp',
};

// Camera shots. az: degrees around the ship from the nose (negative swings to port),
// el: degrees above it, dist: distance from its centre, sx/sy: where the ship sits on
// screen (-0.5 to 0.5, +sy is lower). `wide` is landscape screens, `tall` is portrait.
const SHOTS = {
  hero: {
    wide: { az: -36, el: 12, dist: 96, sx: 0.29, sy: -0.06 },
    tall: { az: -38, el: 16, dist: 150, sx: 0.02, sy: -0.2 },
  },
  award: {
    wide: { az: -92, el: 4, dist: 118, sx: 0.26, sy: 0.02 },
    tall: { az: -96, el: 6, dist: 200, sx: 0, sy: -0.26 },
  },
  chart: {
    wide: { az: -146, el: 22, dist: 135, sx: -0.25, sy: -0.31 },
    tall: { az: -146, el: 24, dist: 200, sx: 0, sy: -0.33 },
  },
  contact: {
    wide: { az: -178, el: 8, dist: 92, sx: 0.24, sy: 0.08 },
    tall: { az: -178, el: 9, dist: 150, sx: 0, sy: -0.26 },
  },
};
const SHOT_KEYS = ['az', 'el', 'dist', 'sx', 'sy'];
const DEG = Math.PI / 180;

function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const palette = {};
  for (const [key, prop] of Object.entries(TOKENS)) palette[key] = style.getPropertyValue(prop).trim();
  return palette;
}

// sRGB components 0-255 (for canvas drawing) or 0-1 (for raw shader output).
function srgb(css, scale = 255) {
  const out = { r: 0, g: 0, b: 0 };
  new Color(css).getRGB(out, SRGBColorSpace);
  return [out.r * scale, out.g * scale, out.b * scale];
}

function smoothstep(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

// Round, soft points for stars and dust. Colours are written as display sRGB.
function pointMaterial({ twinkle = 1 }) {
  return new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uTwinkle: { value: twinkle },
      uDrift: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute float size;
      attribute float phase;
      attribute vec3 tint;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uTwinkle;
      uniform float uDrift;
      varying vec3 vTint;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float tw = 1.0 - uTwinkle * 0.4 * (0.5 + 0.5 * sin(uTime * (0.5 + phase * 1.6) + phase * 40.0));
        vTint = tint;
        vAlpha = tw;
        gl_PointSize = size * uPixelRatio;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vTint;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = 1.0 - smoothstep(0.0, 1.0, d);
        a = pow(a, 1.6) * vAlpha;
        gl_FragColor = vec4(vTint * a, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}

function starField({ count, radius, palette, rand }) {
  const pos = [];
  const size = [];
  const phase = [];
  const tint = [];
  const colours = [
    [srgb(palette.starWhite, 1), 0.6],
    [srgb(palette.starCool, 1), 0.28],
    [srgb(palette.starWarm, 1), 0.12],
  ];
  for (let i = 0; i < count; i += 1) {
    // Bias some stars towards a galactic band, the rest uniform over the sphere.
    let y = rand() * 2 - 1;
    if (rand() < 0.45) y = (rand() - 0.5) * 0.36 + 0.12 * Math.sin(i);
    const theta = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - y * y);
    pos.push(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius);
    // Mostly faint pinpoints, a few bright ones.
    const s = rand();
    size.push(s > 0.985 ? 5 + rand() * 2.5 : s > 0.86 ? 3.2 + rand() * 1.3 : 2.1 + rand() * 1.2);
    phase.push(rand());
    let pick = rand();
    let c = colours[0][0];
    for (const [rgb, weight] of colours) {
      if (pick < weight) {
        c = rgb;
        break;
      }
      pick -= weight;
    }
    const dim = 0.55 + rand() * 0.45;
    tint.push(c[0] * dim, c[1] * dim, c[2] * dim);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geometry.setAttribute('size', new Float32BufferAttribute(size, 1));
  geometry.setAttribute('phase', new Float32BufferAttribute(phase, 1));
  geometry.setAttribute('tint', new Float32BufferAttribute(tint, 3));
  const points = new Points(geometry, pointMaterial({}));
  points.frustumCulled = false;
  return points;
}

// Space dust streaming past as short streaks: the cue that the ship is under way.
// Each particle is a line from its head to a tail trailing upstream.
const SHIP_SPEED = 26;

function dustStreaks({ count, palette, rand }) {
  const pos = [];
  const tail = [];
  const tint = [];
  const c = srgb(palette.starCool, 1);
  for (let i = 0; i < count; i += 1) {
    const x = (rand() - 0.5) * 320;
    const y = (rand() - 0.5) * 160;
    const z = (rand() - 0.5) * 220;
    const dim = 0.3 + rand() * 0.45;
    for (const end of [0, 1]) {
      pos.push(x, y, z);
      tail.push(end);
      tint.push(c[0] * dim, c[1] * dim, c[2] * dim);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geometry.setAttribute('tail', new Float32BufferAttribute(tail, 1));
  geometry.setAttribute('tint', new Float32BufferAttribute(tint, 3));
  const material = new ShaderMaterial({
    uniforms: { uDrift: { value: 0 }, uStreak: { value: 4.5 } },
    vertexShader: /* glsl */ `
      attribute float tail;
      attribute vec3 tint;
      uniform float uDrift;
      uniform float uStreak;
      varying vec3 vTint;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        // Wrap the head first, then hang the tail off it, so a streak never spans the box.
        p.x = mod(p.x - uDrift + 160.0, 320.0) - 160.0 + tail * uStreak;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float depth = -mv.z;
        vAlpha = (1.0 - tail) * smoothstep(8.0, 40.0, depth) * (1.0 - smoothstep(180.0, 320.0, depth));
        vTint = tint;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vTint;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(vTint * vAlpha, vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const lines = new LineSegments(geometry, material);
  lines.frustumCulled = false;
  return lines;
}

// The sky behind the stars: a faint galactic band and cold nebula, computed per pixel
// from smooth noise so there are no texels to step, then dithered against banding.
function skyDome(palette, sunDir) {
  const material = new ShaderMaterial({
    uniforms: {
      uA: { value: new Color(palette.nebulaA) },
      uB: { value: new Color(palette.nebulaB) },
      uC: { value: new Color(palette.nebulaC) },
      uSun: { value: sunDir },
      uSunColor: { value: new Color(palette.sun) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uA;
      uniform vec3 uB;
      uniform vec3 uC;
      uniform vec3 uSun;
      uniform vec3 uSunColor;
      varying vec3 vDir;
      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }
      float noise(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 3; i++) {
          v += a * noise(p);
          p *= 2.03;
          a *= 0.5;
        }
        return v;
      }
      void main() {
        vec3 d = normalize(vDir);
        float lon = atan(d.z, d.x);
        float bandY = 0.04 + 0.16 * sin(lon + 0.6);
        float band = exp(-pow((d.y - bandY) / 0.16, 2.0));
        // Two noise stacks only: this runs for every pixel of the sky, every frame.
        float clouds = fbm(d * 3.2);
        float tint = fbm(d * 1.7 + 9.0);
        vec3 col = mix(uA, uB, smoothstep(0.3, 0.65, tint));
        col = mix(col, uC, smoothstep(0.55, 0.75, clouds * tint * 1.8) * 0.6);
        float density = band * smoothstep(0.3, 0.72, clouds) * (0.55 + 0.7 * tint);
        density += 0.16 * smoothstep(0.5, 0.75, clouds * tint * 1.7);
        vec3 sky = col * density * 0.11;
        // Scattered light around the sun.
        float s = max(dot(d, uSun), 0.0);
        sky += uSunColor * (pow(s, 32.0) * 0.04 + pow(s, 8.0) * 0.003);
        gl_FragColor = vec4(sky, 1.0);
        #include <colorspace_fragment>
        // Dither by about one 8-bit step so the faint gradients do not band.
        gl_FragColor.rgb += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
      }
    `,
    side: BackSide,
    depthWrite: false,
  });
  return new Mesh(new SphereGeometry(4200, 48, 24), material);
}

// The ring: an open band lit by the sun, with segment seams and bright rim walls.
function ringStructure({ palette, sunDir, radius, width }) {
  const geometry = new CylinderGeometry(radius, radius, width, 480, 1, true);
  const material = new ShaderMaterial({
    uniforms: {
      uSun: { value: sunDir },
      uOuter: { value: new Color(palette.ringOuter) },
      uInner: { value: new Color(palette.ringInner) },
      uEdge: { value: new Color(palette.ringEdge) },
      uSpace: { value: new Color(palette.space) },
      uLights: { value: new Color(palette.windowWarm) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun;
      uniform vec3 uOuter;
      uniform vec3 uInner;
      uniform vec3 uEdge;
      uniform vec3 uSpace;
      uniform vec3 uLights;
      varying vec3 vNormal;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      // A line pattern that fades out before it gets thinner than a pixel, so it never shimmers.
      float lines(float x, float count, float width) {
        float f = abs(fract(x * count) - 0.5);
        float w = fwidth(x * count);
        return smoothstep(width + w, width, 0.5 - f) * clamp(1.0 - w * 4.0, 0.0, 1.0);
      }
      void main() {
        bool inner = !gl_FrontFacing;
        vec3 n = inner ? -vNormal : vNormal;
        float light = max(dot(n, uSun), 0.0);
        vec3 base = inner ? uInner : uOuter;
        vec3 col = base * (0.08 + light * 1.0);
        // Structural sections and a few longitudinal bands.
        col *= 1.0 - 0.45 * lines(vUv.x, 64.0, 0.02);
        col *= 1.0 - 0.25 * lines(vUv.y, 5.0, 0.03);
        // Raised rims catch the sun.
        float wall = smoothstep(0.08, 0.0, min(vUv.y, 1.0 - vUv.y));
        col += uEdge * wall * (0.05 + light * 0.8);
        // Sparse lights on the inner face, showing mostly on its night side.
        if (inner) {
          vec2 cell = floor(vec2(vUv.x * 900.0, vUv.y * 14.0));
          float on = step(0.985, hash(cell));
          col += uLights * on * 0.6 * (1.0 - light) * clamp(1.0 - fwidth(vUv.x * 900.0), 0.0, 1.0);
        }
        // Distance haze: the ring sits far behind everything, so it leans towards the sky.
        col = mix(uSpace, col, 0.6);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
    side: DoubleSide,
  });
  return new Mesh(geometry, material);
}

// An environment map with the sun in it, so the metal hull has something to reflect.
function environment(renderer, palette, sunDir) {
  const envScene = new Scene();
  const material = new ShaderMaterial({
    uniforms: {
      uSun: { value: sunDir },
      uSunColor: { value: new Color(palette.sun) },
      uRim: { value: new Color(palette.rim) },
      uSpace: { value: new Color(palette.space) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun;
      uniform vec3 uSunColor;
      uniform vec3 uRim;
      uniform vec3 uSpace;
      varying vec3 vDir;
      void main() {
        float s = max(dot(normalize(vDir), uSun), 0.0);
        vec3 col = uSpace * 0.6;
        col += uSunColor * (pow(s, 60.0) * 14.0 + pow(s, 6.0) * 0.5);
        col += uRim * pow(max(dot(normalize(vDir), -uSun), 0.0), 3.0) * 0.35;
        col += uRim * 0.05 * (0.5 + 0.5 * vDir.y);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: BackSide,
  });
  envScene.add(new Mesh(new SphereGeometry(10, 32, 16), material));
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(envScene, 0.02).texture;
  pmrem.dispose();
  return env;
}

// Shooting stars, drawn in screen space on top of the scene.
function meteorShower({ palette }) {
  const scene = new Scene();
  const camera = new OrthographicCamera(0, 1, 1, 0, -1, 1);
  const color = new Color(palette.meteor);
  const geometry = new PlaneGeometry(1, 1);
  const pool = [0, 1, 2].map(() => {
    const material = new ShaderMaterial({
      uniforms: { uColor: { value: color }, uOpacity: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
          float a = pow(vUv.x, 2.6) * smoothstep(0.0, 1.0, across);
          a += smoothstep(0.95, 1.0, vUv.x) * across * 0.9;
          a *= uOpacity;
          gl_FragColor = vec4(uColor * a, a);
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
      side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, active: false };
  });

  let width = 1;
  let height = 1;
  let next = 1.2;
  const rand = seeded(Date.now() % 100000);

  function resize(w, h) {
    width = w;
    height = h;
    camera.right = w;
    camera.top = h;
    camera.updateProjectionMatrix();
  }

  function spawn(t) {
    const m = pool.find((p) => !p.active);
    if (!m) return;
    const down = 0.22 + rand() * 0.35;
    const leftward = rand() < 0.75;
    m.dir = new Vector3(leftward ? -Math.cos(down) : Math.cos(down), -Math.sin(down), 0);
    m.start = new Vector3(width * (leftward ? 0.35 + rand() * 0.7 : -0.05 + rand() * 0.6), height * (0.55 + rand() * 0.45), 0);
    m.travel = Math.max(width, height) * (0.22 + rand() * 0.2);
    m.length = 90 + rand() * 150;
    m.duration = 0.75 + rand() * 0.5;
    m.born = t;
    m.active = true;
    m.mesh.visible = true;
    m.mesh.rotation.z = Math.atan2(m.dir.y, m.dir.x);
  }

  function update(t) {
    if (t > next) {
      spawn(t);
      next = t + 1.4 + rand() * 3.6;
    }
    for (const m of pool) {
      if (!m.active) continue;
      const p = (t - m.born) / m.duration;
      if (p >= 1) {
        m.active = false;
        m.mesh.visible = false;
        continue;
      }
      const len = m.length * Math.min(1, p * 2.5);
      const head = m.start.clone().addScaledVector(m.dir, m.travel * p);
      m.mesh.position.copy(head).addScaledVector(m.dir, -len / 2);
      m.mesh.scale.set(len, 1.6, 1);
      m.mesh.material.uniforms.uOpacity.value = Math.sin(Math.PI * p);
    }
  }

  return { scene, camera, resize, update };
}

export async function startScene(canvas) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const low = coarse || (navigator.hardwareConcurrency || 8) <= 4;
  const palette = readPalette();
  const rand = seeded(1234);
  let stopped = false;

  // The capital ship and fighter models download while the sky is baked. The canvas
  // stays hidden behind the CSS sky until they arrive; if either fails or takes over
  // 15 seconds, the procedural version stands in.
  // In development, ?procedural shows the code-built ships instead, for comparison.
  const procedural = import.meta.env.DEV && new URLSearchParams(window.location.search).has('procedural');
  const capitalLoad = procedural ? Promise.resolve(null) : loadModel('capital', 15000);
  const fighterLoad = procedural ? Promise.resolve(null) : loadModel('fighter', 15000);

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !low, powerPreference: 'high-performance' });
  } catch {
    canvas.dataset.state = 'failed';
    return { stop() {} };
  }
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.autoClear = false;
  renderer.setClearColor(new Color(palette.space), 1);

  const maxDpr = low ? 1.5 : 2;
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const sunDir = new Vector3(-0.72, -0.02, 0.69).normalize();
  scene.environment = environment(renderer, palette, sunDir);

  // The sky never changes, so it is drawn once into a cube map at startup and used as
  // the background. Drawn live, its noise was the most expensive thing on screen.
  // Half-float storage where the device can render to it, so faint gradients do not band.
  const skyScene = new Scene();
  skyScene.add(skyDome(palette, sunDir));
  const halfFloat = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const skyTarget = new WebGLCubeRenderTarget(low ? 512 : 1024, {
    type: halfFloat ? HalfFloatType : UnsignedByteType,
    generateMipmaps: false,
  });
  new CubeCamera(1, 10000, skyTarget).update(renderer, skyScene);
  scene.background = skyTarget.texture;
  const stars = starField({ count: low ? 3200 : 6000, radius: 3600, palette, rand });
  scene.add(stars);

  const glow = glowTexture();
  const sunCore = new Sprite(
    new SpriteMaterial({ map: glow, color: palette.sun, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
  );
  sunCore.position.copy(sunDir).multiplyScalar(3200);
  sunCore.scale.setScalar(260);
  const sunGlare = new Sprite(
    new SpriteMaterial({
      map: glow,
      color: palette.sun,
      blending: AdditiveBlending,
      depthWrite: false,
      opacity: 0.035,
      toneMapped: false,
    }),
  );
  // The sun sits beyond the haze below, and must not be dimmed by it.
  sunCore.material.fog = false;
  sunGlare.material.fog = false;
  sunGlare.position.copy(sunCore.position);
  sunGlare.scale.setScalar(900);
  scene.add(sunCore, sunGlare);

  // The ring sits in a group that turns with the camera at a slower rate, so it stays
  // in the backdrop of every shot while still showing some parallax.
  const ringPivot = new Group();
  // Far out and scaled up to match, so it reads as a distant structure, not a hoop.
  // The shaded band is drawn at once; the ring model (public/models/ring.glb, built at
  // a 1,000 m radius) replaces it when it has loaded.
  const ring = new Group();
  const ringBand = ringStructure({ palette, sunDir, radius: 2000, width: 120 });
  ring.add(ringBand);
  const ringTilt = new Group();
  ringTilt.position.set(-4400, -520, 2200);
  ringTilt.rotation.set(1.18, 0.2, 0.42);
  ringTilt.add(ring);
  // A faint distance haze. It starts well beyond the ships, so only the ring leans
  // towards the colour of space. The shader-drawn sky, stars and band ignore fog.
  scene.fog = new Fog(palette.space, 2500, 11000);
  ringPivot.add(ringTilt);
  scene.add(ringPivot);

  // Light: a warm key from the camera side, a cool rim from the sun, a little fill.
  const key = new DirectionalLight(palette.key, 3.0);
  const rim = new DirectionalLight(palette.rim, 2.2);
  rim.position.copy(sunDir).multiplyScalar(100);
  scene.add(key, rim, new HemisphereLight(palette.rim, palette.hullDark, 0.45));

  const anisotropy = Math.min(low ? 4 : 8, renderer.capabilities.getMaxAnisotropy());
  const [capitalModel, fighterModel] = await Promise.all([capitalLoad, fighterLoad]);
  const ship = capitalModel
    ? dressShip(capitalModel, { palette, glow, anisotropy, rand: seeded(7), singleSided: true })
    : buildShip({ palette, glow, anisotropy, detail: low ? 'low' : 'high' });
  scene.add(ship.group);

  const dust = dustStreaks({ count: low ? 260 : 520, palette, rand });
  scene.add(dust);

  const flightRand = seeded(Date.now() % 100003);
  const makeCraft = fighterModel
    ? () => dressShip(fighterModel.clone(true), { palette, glow, anisotropy, rand: flightRand, small: true })
    : null;
  const squadrons = createSquadrons({ palette, glow, rand: flightRand, makeCraft });
  scene.add(squadrons.group);
  const debris = createDebris({ palette, count: low ? 26 : 44, rand, speed: SHIP_SPEED * 0.55 });
  scene.add(debris.mesh);
  const visitor = createVisitor({ palette, glow, rand: seeded(Date.now() % 9973) });
  scene.add(visitor.group);
  // The ship that drops out of warp loads after the rest. Reduced motion never shows
  // it, so it is not downloaded there. Without its model, a smaller copy of the
  // capital ship stands in.
  if (!reduceMotion) {
    loadModel('visitor', 30000).then((model) => {
      if (stopped) return;
      if (model) {
        const dressed = dressShip(model, { palette, glow, anisotropy, rand: seeded(11) });
        visitor.setShip({ object: dressed.group, update: dressed.update });
      } else {
        visitor.setShip({ object: ship.group.clone(true), size: 0.42 });
      }
    });
  }

  loadModel('ring', 30000).then((model) => {
    if (stopped || !model) return;
    model.scale.setScalar(2);
    model.traverse((node) => {
      if (!node.isMesh) return;
      // Repeated modules are instanced; never let culling drop one at the screen edge.
      node.frustumCulled = false;
      node.material.envMapIntensity = 0.5;
      node.material.emissiveIntensity = 1.6;
      for (const key of ['map', 'normalMap', 'emissiveMap', 'roughnessMap']) {
        if (node.material[key]) node.material[key].anisotropy = anisotropy;
      }
    });
    ring.remove(ringBand);
    ringBand.geometry.dispose();
    ringBand.material.dispose();
    ring.add(model);
    if (reduceMotion) render();
  });

  const meteors = meteorShower({ palette });

  const camera = new PerspectiveCamera(30, 1, 0.5, 9000);
  const target = new Vector3(-2, 1, 0);

  // Scroll anchors: the scroll position at which each shot is centred on screen.
  let anchors = [];
  let width = 1;
  let height = 1;
  let tall = false;

  function measure() {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    anchors = [...document.querySelectorAll('[data-shot]')]
      .filter((el) => SHOTS[el.dataset.shot])
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const centre = rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2;
        return { y: Math.min(max, Math.max(0, centre)), shot: el.dataset.shot };
      })
      .sort((a, b) => a.y - b.y);
    if (!anchors.length) anchors = [{ y: 0, shot: 'hero' }];
  }

  function shotAt(scrollY) {
    const pick = (name) => SHOTS[name][tall ? 'tall' : 'wide'];
    if (scrollY <= anchors[0].y) return { ...pick(anchors[0].shot) };
    for (let i = 0; i < anchors.length - 1; i += 1) {
      const a = anchors[i];
      const b = anchors[i + 1];
      if (scrollY <= b.y) {
        const t = smoothstep((scrollY - a.y) / Math.max(1, b.y - a.y));
        const sa = pick(a.shot);
        const sb = pick(b.shot);
        const out = {};
        for (const k of SHOT_KEYS) out[k] = sa[k] + (sb[k] - sa[k]) * t;
        return out;
      }
    }
    return { ...pick(anchors[anchors.length - 1].shot) };
  }

  const current = { az: 0, el: 0, dist: 100, sx: 0, sy: 0 };
  const view = { az: 0, el: 0, dist: 100, sx: 0, sy: 0 };

  // On a mouse, the camera leans a few degrees towards the pointer.
  const lean = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (event) => {
    lean.tx = event.clientX / window.innerWidth - 0.5;
    lean.ty = event.clientY / window.innerHeight - 0.5;
  };
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer && !reduceMotion) window.addEventListener('pointermove', onPointer, { passive: true });

  function placeCamera(shot) {
    const az = shot.az * DEG;
    const el = shot.el * DEG;
    camera.position.set(
      target.x + Math.cos(el) * Math.cos(az) * shot.dist,
      target.y + Math.sin(el) * shot.dist,
      target.z + Math.cos(el) * Math.sin(az) * shot.dist,
    );
    camera.lookAt(target);

    // Shift the frame (like a lens shift) so the ship sits at sx/sy on screen.
    const fullW = width * (1 + 2 * Math.abs(shot.sx));
    const fullH = height * (1 + 2 * Math.abs(shot.sy));
    const offX = shot.sx > 0 ? 0 : fullW - width;
    const offY = shot.sy > 0 ? 0 : fullH - height;
    const baseFov = tall ? 40 : 30;
    camera.fov = (2 * Math.atan(Math.tan((baseFov * DEG) / 2) * (fullH / height))) / DEG;
    camera.aspect = fullW / fullH;
    camera.setViewOffset(fullW, fullH, offX, offY, width, height);
    camera.updateProjectionMatrix();

    // The key light rides above and to one side of the camera.
    key.position.copy(camera.position).add(new Vector3(0, shot.dist * 0.6, 0)).sub(target);
    ringPivot.rotation.y = -(shot.az + 34) * DEG * 0.72;
  }

  function resize() {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    tall = width / height < 0.9;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    stars.material.uniforms.uPixelRatio.value = dpr;
    meteors.resize(width, height);
    measure();
  }

  function render() {
    renderer.clear();
    renderer.render(scene, camera);
    if (!reduceMotion) {
      renderer.clearDepth();
      renderer.render(meteors.scene, meteors.camera);
    }
  }

  resize();
  Object.assign(current, shotAt(reduceMotion ? 0 : window.scrollY));
  placeCamera(current);

  const ro = new ResizeObserver(() => {
    resize();
    if (reduceMotion) {
      placeCamera(shotAt(0));
      render();
    }
  });
  ro.observe(canvas);
  const bodyRo = new ResizeObserver(measure);
  bodyRo.observe(document.body);

  let raf = 0;
  let last = performance.now();
  let t = 0;
  let slowFrames = 0;
  let sampled = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;

    // Ease towards the shot for the current scroll position.
    const goal = shotAt(window.scrollY);
    const k = 1 - Math.exp(-dt * 3.2);
    for (const key2 of SHOT_KEYS) current[key2] += (goal[key2] - current[key2]) * k;
    const kl = 1 - Math.exp(-dt * 2.2);
    lean.x += (lean.tx - lean.x) * kl;
    lean.y += (lean.ty - lean.y) * kl;
    Object.assign(view, current);
    view.az += lean.x * 7;
    view.el -= lean.y * 4;
    placeCamera(view);

    // The ship is under way: a slow roll, a little yaw and pitch, a gentle rise and fall.
    ship.group.position.y = Math.sin(t * 0.35) * 0.8;
    ship.group.rotation.x = Math.sin(t * 0.23) * 0.07;
    ship.group.rotation.y = Math.sin(t * 0.13) * 0.05;
    ship.group.rotation.z = Math.sin(t * 0.19) * 0.02;
    ship.update(t);
    ring.rotation.y += dt * 0.012;
    stars.material.uniforms.uTime.value = t;
    dust.material.uniforms.uDrift.value = t * SHIP_SPEED;
    squadrons.update(t, camera.position);
    debris.update(dt, camera.position);
    visitor.update(t, dt, camera, current);
    meteors.update(t);
    render();

    // If frames run long on this device, render at a lower resolution.
    sampled += 1;
    if (dt > 0.026) slowFrames += 1;
    if (sampled >= 90) {
      if (slowFrames > 45 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        resize();
      }
      sampled = 0;
      slowFrames = 0;
    }
  }

  function startLoop() {
    if (raf || reduceMotion) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stopLoop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const onVisibility = () => (document.hidden ? stopLoop() : startLoop());
  document.addEventListener('visibilitychange', onVisibility);

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    stopLoop();
    canvas.dataset.state = 'failed';
  });

  // First frame, then fade the canvas in over the CSS fallback sky. Under reduced
  // motion this is the only frame, so the fighters hold formation without trails.
  ship.update(0);
  squadrons.update(3, camera.position, false);
  debris.update(0, camera.position);
  render();
  canvas.dataset.state = 'ready';
  startLoop();

  return {
    stop() {
      stopped = true;
      stopLoop();
      ro.disconnect();
      bodyRo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      renderer.dispose();
    },
    // For testing: bring the next ship out of warp now.
    warpNow() {
      visitor.trigger();
    },
    // For screenshots and tuning: freeze on one shot.
    debugShot(name) {
      stopLoop();
      Object.assign(current, SHOTS[name][tall ? 'tall' : 'wide']);
      placeCamera(current);
      ship.update(0.5);
      squadrons.update(3, camera.position, false);
      debris.update(0, camera.position);
      meteors.update(0);
      render();
    },
  };
}
