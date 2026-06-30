/**
 * Builds lucid-edge-mouse.json — a Lottie that matches the reference site animation.
 *
 * Key fixes vs previous version:
 *  - shiftY = 0  (no vertical offset; baseline at y=0, letters extend upward with negative y)
 *  - shiftX = 0  (left-edge anchored; layer X position = left edge of glyph)
 *  - Y_POS = 120 (baseline sits at 120px in the 233px canvas; all letters fit within 0-233)
 *  - projects layer + assets restored (images are part of the Lottie, not a separate component)
 */

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const opentype = require('opentype.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Font ───────────────────────────────────────────────────────────────────
const fontBuffer = readFileSync(path.join(__dirname, 'SpaceGrotesk-Bold.ttf'));
const font = opentype.parse(fontBuffer.buffer);

// ── Original Lottie (metadata + mask + projects comp + assets) ─────────────
const original = JSON.parse(readFileSync(path.join(ROOT, 'public/documents/juan-name-mouse.json'), 'utf8'));

const W           = original.w;  // 1916
const H           = original.h;  // 233
const FPS         = original.fr; // 30
const TOTAL_FRAMES = original.op; // 60

// ── Font size ─────────────────────────────────────────────────────────────
// FONT_SIZE=100. Measured advance widths (at fs=155, scaled ×100/155):
//   M=88, a=58, l=27, c=59, o=61, l=27, m=85  → Malcolm neutral (×1.5) = 610px
//   B=66, e=57, d=64, d=64, o=61, w=79, s=52  → Beddows  neutral (×1.5) = 666px
//   Gap for projects image: ~640px (matching original).
//   Total: 610 + 640 + 666 = 1916px — fills canvas exactly.
const FONT_SIZE = 100;

// ── Path converter: opentype commands → Lottie {v, i, o, c} ───────────────
function pathToLottie(opPath) {
  const cmds = opPath.commands;
  const v = [], i = [], o = [];

  for (let ci = 0; ci < cmds.length; ci++) {
    const cmd = cmds[ci];
    if (cmd.type === 'M') {
      v.push([cmd.x, cmd.y]);
      i.push([0, 0]);
      o.push([0, 0]);
    } else if (cmd.type === 'L') {
      v.push([cmd.x, cmd.y]);
      i.push([0, 0]);
      o.push([0, 0]);
    } else if (cmd.type === 'C') {
      const pa = v[v.length - 1];
      o[o.length - 1] = [cmd.x1 - pa[0], cmd.y1 - pa[1]];
      v.push([cmd.x, cmd.y]);
      i.push([cmd.x2 - cmd.x, cmd.y2 - cmd.y]);
      o.push([0, 0]);
    } else if (cmd.type === 'Q') {
      const pa = v[v.length - 1];
      const cp1x = pa[0] + (2/3) * (cmd.x1 - pa[0]);
      const cp1y = pa[1] + (2/3) * (cmd.y1 - pa[1]);
      const cp2x = cmd.x + (2/3) * (cmd.x1 - cmd.x);
      const cp2y = cmd.y + (2/3) * (cmd.y1 - cmd.y);
      o[o.length - 1] = [cp1x - pa[0], cp1y - pa[1]];
      v.push([cmd.x, cmd.y]);
      i.push([cp2x - cmd.x, cp2y - cmd.y]);
      o.push([0, 0]);
    }
    // Z: handled by c:true
  }

  return { v, i, o, c: true };
}

// ── Extract glyph path ─────────────────────────────────────────────────────
// shiftX = 0: left edge of glyph at x=0 (layer position = left edge)
// shiftY = 0: baseline at y=0 (letters extend upward with negative y values)
//             → with Y_POS=120, letters span canvas y 12–151 at neutral scale
function getLetterPath(char) {
  const glyph = font.charToGlyph(char);
  // getPath(x, y, size): x=0 → left edge, y=0 → baseline
  const opPath = glyph.getPath(0, 0, FONT_SIZE);
  return pathToLottie(opPath);
}

// ── Animation keyframes ────────────────────────────────────────────────────
//
// Y_POS = 120: baseline in canvas. At scaleY=150%, letter top = 120 + (-108*1.5) = -42?
// Wait — scale is applied BEFORE position. Lottie applies scale around the anchor point,
// then adds position. So at scaleY=150, the path y=-108 becomes y=-162, then +120 = -42 (above canvas).
//
// But the ORIGINAL Lottie does exactly the same thing and works fine — letters extend
// above the canvas top and are clipped by the SVG viewBox (overflow:hidden on SVG).
// In the reference site the top edges of the letters are clipped too — that's intentional.
// The bottom of the letters (y=0 in path) at Y_POS=120 → always at canvas y=120.
//
// So the visible part of the letter is from canvas y=0 (SVG top clip) to y=120 (baseline).
// That gives ~108px of visible letter height at neutral — which is what we see in the reference.
//
// Y_POS=170: letter top at neutral (150% scale) = 170 - (108×1.5) = 8px — just inside canvas.
// Descender bottom = 170 + (31×1.5) = 216.5px — inside 233px canvas. ✓
const Y_POS = 170;

// Malcolm (7 letters) — scales up as cursor moves right
// Neutral (frame30) x = cumulative advance widths at FONT_SIZE=100, scaleX=150%
// Widths at 150%: M=132, a=87, l=41, c=89, o=92, l=41, m=128
// Positions [x@frame0, x@frame30, x@frame60]
const MALCOLM_POSITIONS = [
  [0,   0,    0   ],  // M — left-anchored
  [18,  132,  211 ],  // a
  [33,  219,  335 ],  // l
  [42,  260,  385 ],  // c
  [65,  349,  479 ],  // o
  [91,  441,  564 ],  // l
  [104, 482,  597 ],  // m
];
const MALCOLM_SCALES = [
  // [scaleX@0, scaleX@30, scaleX@60]  — scaleY fixed at 150
  [30,  150, 360],  // M
  [38,  150, 320],  // a
  [48,  150, 275],  // l
  [58,  150, 240],  // c
  [65,  150, 210],  // o
  [72,  150, 185],  // l
  [82,  150, 155],  // m
];

// Beddows (7 letters) — scales down as cursor moves right
// Neutral (frame30) x starts at 1250 (610px Malcolm end + 640px image gap — matches original)
// Widths at 150%: B=100, e=86, d=96, d=96, o=92, w=118, s=78 → total 666px → ends at 1916
const BEDDOWS_POSITIONS = [
  [600,  1250, 1752],  // B
  [800,  1350, 1808],  // e
  [1000, 1436, 1835],  // d
  [1180, 1532, 1857],  // d
  [1360, 1628, 1875],  // o
  [1510, 1720, 1890],  // w
  [1670, 1838, 1907],  // s
];
const BEDDOWS_SCALES = [
  [190, 150, 95],  // B
  [240, 150, 70],  // e
  [285, 150, 55],  // d
  [320, 150, 45],  // d
  [350, 150, 37],  // o
  [375, 150, 30],  // w
  [395, 150, 25],  // s
];

// ── Easing (from original — near-linear) ──────────────────────────────────
const EI  = { x: 0.999, y: 0.999 };
const EO  = { x: 0.001, y: 0.001 };
const EI3 = { x: [0.999, 0.999, 0.999], y: [1, 1, 1] };
const EO3 = { x: [0.001, 0.001, 0.001], y: [0, 0, 0] };

function makePos(pos) {
  return {
    a: 1,
    k: [
      { i: EI, o: EO, t: 0,  s: [pos[0], Y_POS, 0], to: [0,0,0], ti: [0,0,0] },
      { i: EI, o: EO, t: 30, s: [pos[1], Y_POS, 0], to: [0,0,0], ti: [0,0,0] },
      {                t: 60, s: [pos[2], Y_POS, 0] },
    ],
  };
}

function makeScale(sc) {
  return {
    a: 1,
    k: [
      { i: EI3, o: EO3, t: 0,  s: [sc[0], 150, 100] },
      { i: EI3, o: EO3, t: 30, s: [sc[1], 150, 100] },
      {                  t: 60, s: [sc[2], 150, 100] },
    ],
  };
}

// ── Build letter layer ─────────────────────────────────────────────────────
function buildLayer(char, idx, pos, sc, total) {
  const lottiePath = getLetterPath(char);
  return {
    ddd: 0,
    ind: total - idx,
    ty: 4,
    nm: char,
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: makePos(pos),
      a: { a: 0, k: [0, 0, 0] },
      s: makeScale(sc),
    },
    ao: 0,
    shapes: [{
      ty: 'gr',
      nm: 'Group 1',
      it: [
        { ty: 'sh', nm: 'Path 1', ks: { a: 0, k: lottiePath } },
        { ty: 'fl', nm: 'Fill 1', o: { a: 0, k: 100 }, c: { a: 0, k: [0.863, 1, 0, 1] }, r: 1 },
        {
          ty: 'tr', nm: 'Transform',
          p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 },
          o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 },
        },
      ],
      np: 3,
    }],
    ip: 0, op: TOTAL_FRAMES, st: 0, bm: 0,
  };
}

// ── Assemble layers ────────────────────────────────────────────────────────
const MALCOLM = ['M', 'a', 'l', 'c', 'o', 'l', 'm'];
const BEDDOWS = ['B', 'e', 'd', 'd', 'o', 'w', 's'];
const TOTAL = MALCOLM.length + BEDDOWS.length + 2; // +2 for mask + projects

const layers = [
  ...MALCOLM.map((ch, i) => buildLayer(ch, i, MALCOLM_POSITIONS[i], MALCOLM_SCALES[i], TOTAL)),
  ...BEDDOWS.map((ch, i) => buildLayer(ch, i + MALCOLM.length, BEDDOWS_POSITIONS[i], BEDDOWS_SCALES[i], TOTAL)),
  original.layers.find(l => l.nm === 'Mask'),     // track matte source (td:1) for projects
  original.layers.find(l => l.nm === 'projects'),  // uses Mask as track matte (tt:1)
].filter(Boolean);

// ── Write ──────────────────────────────────────────────────────────────────
const result = {
  v: original.v, fr: FPS, ip: 0, op: TOTAL_FRAMES,
  w: W, h: H, nm: 'lucid-edge-mouse', ddd: 0,
  assets: original.assets, // keep project images
  layers,
};

const outPath = path.join(ROOT, 'public/documents/lucid-edge-mouse.json');
writeFileSync(outPath, JSON.stringify(result));
console.log(`✓ Written: ${outPath}`);
console.log(`  Layers: ${layers.length}`);
