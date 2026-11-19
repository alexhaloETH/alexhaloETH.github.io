// Procedural textures for the scene, drawn once on 2D canvases at startup.
// Nothing here is downloaded, so the scene costs no image requests.
import { CanvasTexture, SRGBColorSpace } from 'three';

// Small seeded RNG, so the plating and lights land in the same place on every load.
export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return [canvas, canvas.getContext('2d')];
}

// Comma syntax: older canvas implementations do not parse the space-separated form.
const grey = (v, a = 1) => `rgba(${v}, ${v}, ${v}, ${a})`;
const rgb = ([r, g, b], a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`;

function finish(canvas, { srgb = true } = {}) {
  const texture = new CanvasTexture(canvas);
  texture.flipY = false;
  if (srgb) texture.colorSpace = SRGBColorSpace;
  return texture;
}

// Hull plating and window lights. u runs along the hull, v around it, one band per face.
// `windowFaces` lists the faces that carry rows of lit windows.
export function hullTextures({ faces, windowFaces, seed = 7, width = 1024 }) {
  const rand = seeded(seed);
  const faceH = 32;
  const height = faces * faceH;
  const [plate, p] = makeCanvas(width, height);
  const [glow, g] = makeCanvas(width, height);

  p.fillStyle = grey(170);
  p.fillRect(0, 0, width, height);
  g.fillStyle = grey(0);
  g.fillRect(0, 0, width, height);

  for (let f = 0; f < faces; f += 1) {
    const rows = 3;
    for (let row = 0; row < rows; row += 1) {
      const y0 = f * faceH + (row * faceH) / rows;
      const h = faceH / rows;
      let x = 0;
      while (x < width) {
        const w = 10 + rand() * 54;
        p.fillStyle = grey(164 + Math.floor((rand() - 0.5) * 56));
        p.fillRect(x, y0, w, h);
        p.fillStyle = grey(90, 0.85);
        p.fillRect(x, y0, 1, h);
        x += w;
      }
      p.fillStyle = grey(96, 0.9);
      p.fillRect(0, y0, width, 1);
    }
  }

  // Hatches, vents and darker access panels.
  for (let i = 0; i < 260; i += 1) {
    p.fillStyle = grey(100 + Math.floor(rand() * 50));
    p.fillRect(rand() * width, rand() * height, 2 + rand() * 9, 1 + rand() * 4);
  }
  // A few long service stripes, the kind of marking that sells the scale.
  for (let i = 0; i < 10; i += 1) {
    p.fillStyle = grey(235, 0.6);
    p.fillRect(width * (0.15 + rand() * 0.6), rand() * height, 30 + rand() * 90, 1);
  }

  // Rows of lit windows. Most are warm, a few cool, a third are dark.
  const warm = [255, 214, 160];
  const cool = [196, 228, 255];
  for (const f of windowFaces) {
    const lanes = [0.3, 0.55];
    for (const lane of lanes) {
      const y = Math.round(f * faceH + lane * faceH);
      let x = width * 0.12;
      while (x < width * 0.82) {
        const run = 6 + Math.floor(rand() * 22);
        for (let k = 0; k < run; k += 1) {
          if (rand() > 0.32) {
            g.fillStyle = rgb(rand() > 0.85 ? cool : warm, 0.75 + rand() * 0.25);
            g.fillRect(x, y, 2, 2);
          }
          x += 4;
        }
        x += 10 + rand() * 40;
      }
    }
  }

  const map = finish(plate);
  const emissive = finish(glow);
  return { map, emissive };
}

// A soft round glow for sprites: engine wash, navigation lights, the sun.
export function glowTexture(size = 128) {
  const [canvas, c] = makeCanvas(size, size);
  const r = size / 2;
  const grad = c.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, grey(255, 1));
  grad.addColorStop(0.12, grey(255, 0.85));
  grad.addColorStop(0.32, grey(255, 0.28));
  grad.addColorStop(0.62, grey(255, 0.07));
  grad.addColorStop(1, grey(255, 0));
  c.fillStyle = grad;
  c.fillRect(0, 0, size, size);
  return finish(canvas);
}
