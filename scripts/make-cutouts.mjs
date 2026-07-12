/**
 * Builds the hero's layered-photography assets:
 *  - a packet cutout with a crisp composited APPU KAJU label, split into
 *    lid + base layers (the lid peels open on scroll)
 *  - 12 single-nut cutouts (2 variants × 6 ingredients) that fall from it
 *
 * Sources come from Pollinations (free) on near-white backgrounds; sharp
 * keys the white away to alpha locally. Rerun-safe via scripts/.cutout-cache.
 *
 *   node scripts/make-cutouts.mjs [--force]
 */
import sharp from "sharp";
import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "public/images/cutouts");
const CACHE = path.resolve(process.cwd(), "scripts/.cutout-cache");
const FORCE = process.argv.includes("--force");

const ISOLATED =
  " isolated and centered on a solid pure white background, no shadow, no reflection, product photography, studio light, photorealistic, no text";

/** [name, prompt, width, height, seed, maxSize] */
const NUTS = [
  ["cashew-1", "One single whole ivory cashew kernel, curved kidney crescent shape" + ISOLATED, 640, 640, 653, 320],
  ["cashew-2", "One single whole ivory cashew kernel, slightly curved, different angle" + ISOLATED, 640, 640, 607, 320],
  ["almond-1", "One single raw almond with brown skin" + ISOLATED, 640, 640, 611, 300],
  ["almond-2", "One single raw brown almond, tilted at an angle" + ISOLATED, 640, 640, 613, 300],
  ["walnut-1", "One single golden walnut kernel half" + ISOLATED, 640, 640, 617, 320],
  ["walnut-2", "One single walnut kernel half, different angle" + ISOLATED, 640, 640, 619, 320],
  ["pistachio-1", "One single roasted pistachio in a split shell showing green kernel" + ISOLATED, 640, 640, 623, 300],
  ["pistachio-2", "One single green pistachio kernel without shell" + ISOLATED, 640, 640, 629, 280],
  ["raisin-1", "One single golden green raisin, plump" + ISOLATED, 640, 640, 631, 260],
  ["raisin-2", "One single golden raisin, wrinkled, different angle" + ISOLATED, 640, 640, 641, 260],
  ["dates-1", "One single soft dark brown date fruit" + ISOLATED, 640, 640, 643, 320],
  ["dates-2", "One single dark date fruit, glossy, different angle" + ISOLATED, 640, 640, 647, 320],
];

const PACKET = [
  "packet-src",
  "A tall matte dark espresso brown stand-up pouch bag for premium dry fruits, front facing, perfectly symmetrical, plain blank front with no label, crimped seal fold at top, commercial packshot cutout isolated and centered on a solid pure white background, high key lighting, no shadow, no reflection, no environment, photorealistic, no text",
  832,
  1216,
  727,
];

const exists = (f) => access(f).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPng(prompt, width, height, seed) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 8_000) throw new Error(`too small (${buf.length}B)`);
      return buf;
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(5000 * attempt);
    }
  }
}

/**
 * Keys near-white (and desaturated pale grey, i.e. soft shadows) to alpha.
 * Keeps saturated / darker pixels — the subject.
 */
async function whiteKey(buf) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = data;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const maxc = Math.max(r, g, b);
    const minc = Math.min(r, g, b);
    const luma = (r + g + b) / 3;
    const sat = maxc === 0 ? 0 : (maxc - minc) / maxc;
    const distWhite = 255 - minc;

    // Base key: how far from pure white.
    let a = Math.min(1, Math.max(0, (distWhite - 14) / 36));
    // Kill pale desaturated pixels (paper background + soft shadows).
    if (sat < 0.1 && luma > 176) a = 0;
    else if (sat < 0.16 && luma > 208) a *= 0.25;

    px[i + 3] = Math.round(a * 255);
  }
  const keyed = await sharp(px, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
  return sharp(keyed).trim({ threshold: 8 });
}

/**
 * Crisp brand label — real typography on an opaque parchment card, pasted
 * onto the dark pouch like a paper label.
 */
function labelSvg(w) {
  const h = Math.round(w * 1.16);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect x="0" y="0" width="${w}" height="${h}" rx="${w * 0.04}" fill="#f6efe1"/>
  <rect x="${w * 0.035}" y="${w * 0.035}" width="${w * 0.93}" height="${h - w * 0.07}" rx="${w * 0.025}" fill="none" stroke="#2e4a34" stroke-width="${w * 0.006}"/>
  <g text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">
    <circle cx="${w / 2}" cy="${h * 0.17}" r="${w * 0.1}" fill="none" stroke="#c96f4a" stroke-width="${w * 0.008}"/>
    <text x="${w / 2}" y="${h * 0.155}" font-size="${w * 0.052}" font-weight="700" fill="#c96f4a">EST.</text>
    <text x="${w / 2}" y="${h * 0.21}" font-size="${w * 0.06}" font-weight="700" fill="#c96f4a">1998</text>
    <text x="${w / 2}" y="${h * 0.42}" font-size="${w * 0.185}" font-weight="700" fill="#2e4a34" letter-spacing="${w * 0.004}">APPU</text>
    <text x="${w / 2}" y="${h * 0.58}" font-size="${w * 0.185}" font-weight="700" fill="#2e4a34" letter-spacing="${w * 0.004}">KAJU</text>
    <line x1="${w * 0.14}" y1="${h * 0.655}" x2="${w * 0.86}" y2="${h * 0.655}" stroke="#c96f4a" stroke-width="${w * 0.006}"/>
    <text x="${w / 2}" y="${h * 0.73}" font-size="${w * 0.052}" font-weight="600" fill="#6b4a2e" letter-spacing="${w * 0.012}">PREMIUM KAJU</text>
    <text x="${w / 2}" y="${h * 0.79}" font-size="${w * 0.052}" font-weight="600" fill="#6b4a2e" letter-spacing="${w * 0.012}">&amp; DRY FRUITS</text>
    <text x="${w / 2}" y="${h * 0.9}" font-size="${w * 0.042}" fill="#6b4a2e" letter-spacing="${w * 0.01}">LUCKNOW · INDIA</text>
  </g>
</svg>`);
}

/**
 * Background removal for the packet: flood-fills from the image border,
 * eating desaturated (grey/white) pixels and the dark floor shadow. Only
 * border-connected pixels are removed, so the pouch face — saturated brown —
 * can never get interior holes. Works whatever grey the studio backdrop is.
 */
async function edgeKey(buf) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const px = data;

  const isBackground = (i) => {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    const maxc = Math.max(r, g, b);
    const minc = Math.min(r, g, b);
    const sat = maxc === 0 ? 0 : (maxc - minc) / maxc;
    const luma = (r + g + b) / 3;
    // Grey/white backdrop, or the dark desaturated floor shadow.
    return sat < 0.11 || (sat < 0.22 && luma < 110);
  };

  const bg = new Uint8Array(W * H);
  const queue = [];
  const push = (x, y) => {
    const p = y * W + x;
    if (bg[p] || !isBackground(p * 4)) return;
    bg[p] = 1;
    queue.push(p);
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (queue.length) {
    const p = queue.pop();
    const x = p % W, y = (p / W) | 0;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }

  // Feather the cut edge, then apply as alpha.
  const mask = Buffer.alloc(W * H);
  for (let p = 0; p < W * H; p++) mask[p] = bg[p] ? 0 : 255;
  const { data: feathered, info: fi } = await sharp(mask, {
    raw: { width: W, height: H, channels: 1 },
  })
    .blur(1.2)
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let p = 0; p < W * H; p++) {
    px[p * 4 + 3] = Math.min(px[p * 4 + 3], feathered[p * fi.channels]);
  }

  const keyed = await sharp(px, {
    raw: { width: W, height: H, channels: 4 },
  })
    .png()
    .toBuffer();
  return sharp(keyed).trim({ threshold: 8 });
}

async function done(marker) {
  return !FORCE && (await exists(marker));
}

await mkdir(OUT, { recursive: true });
await mkdir(CACHE, { recursive: true });

// ── Nuts ────────────────────────────────────────────────────
for (const [name, prompt, w, h, seed, maxSize] of NUTS) {
  const marker = path.join(CACHE, `${name}.done`);
  if (await done(marker)) continue;
  const src = await fetchPng(prompt, w, h, seed);
  const keyed = await whiteKey(src);
  await keyed
    .resize(maxSize, maxSize, { fit: "inside" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, `${name}.png`));
  await writeFile(marker, new Date().toISOString());
  console.log(`✓ ${name}.png`);
  await sleep(5000);
}

// ── Packet ──────────────────────────────────────────────────
const packetMarker = path.join(CACHE, "packet.done");
if (!(await done(packetMarker))) {
  const [, prompt, w, h, seed] = PACKET;
  // Prefer a locally cached, visually approved source over refetching.
  const srcCache = path.join(CACHE, "packet-src.png");
  const src = (await exists(srcCache))
    ? await sharp(srcCache).png().toBuffer()
    : await fetchPng(prompt, w, h, seed);
  const keyedBuf = await (await edgeKey(src)).png().toBuffer();
  const meta = await sharp(keyedBuf).metadata();

  // Paste the parchment label card onto the pouch face, then clip the
  // result back to the pouch silhouette so no label overhangs its edge.
  const labelW = Math.round(meta.width * 0.56);
  const label = await sharp(labelSvg(labelW)).png().toBuffer();
  const alpha = await sharp(keyedBuf).extractChannel("alpha").png().toBuffer();
  const composited = await sharp(keyedBuf)
    .composite([
      {
        input: label,
        left: Math.round((meta.width - labelW) / 2),
        top: Math.round(meta.height * 0.32),
        blend: "over",
      },
    ])
    .png()
    .toBuffer();
  const labeled = await sharp(composited)
    .removeAlpha()
    .joinChannel(alpha)
    .png()
    .toBuffer();

  const full = sharp(labeled).resize(900, 1200, { fit: "inside" });
  const fullBuf = await full.png().toBuffer();
  const fm = await sharp(fullBuf).metadata();

  const lidH = Math.round(fm.height * 0.16);
  await sharp(fullBuf)
    .extract({ left: 0, top: 0, width: fm.width, height: lidH })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "packet-lid.png"));
  await sharp(fullBuf)
    .extract({ left: 0, top: lidH, width: fm.width, height: fm.height - lidH })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "packet-base.png"));
  await sharp(fullBuf)
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "packet-full.png"));
  await writeFile(packetMarker, new Date().toISOString());
  console.log("✓ packet-lid.png / packet-base.png / packet-full.png");
}

console.log("Cutouts done.");
