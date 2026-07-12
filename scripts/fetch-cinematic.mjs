/**
 * Fetches the hero's cinematic "table film" photo set — moody, warm-lit
 * full-bleed scenes on dark wood — from Pollinations (free) and converts
 * to WebP. Rerun-safe via scripts/.cinematic-cache markers.
 *
 *   node scripts/fetch-cinematic.mjs [--force]
 */
import sharp from "sharp";
import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "public/images/cinematic");
const CACHE = path.resolve(process.cwd(), "scripts/.cinematic-cache");
const FORCE = process.argv.includes("--force");

const MOOD =
  ", on a dark walnut wood table, warm golden side lighting from the left, dramatic soft shadows, moody cinematic food photography, shallow depth of field, rich deep tones, photorealistic, no text, no people";

/** [name, prompt, seed] — all 1344×768 landscape. */
const SCENES = [
  [
    "table",
    "Overhead cinematic shot of assorted premium dry fruits — cashews, almonds, walnuts, pistachios, golden raisins and dates — arranged in small aged brass bowls" + MOOD,
    801,
  ],
  [
    "cashew",
    "Cinematic close-up of a generous heap of premium whole ivory cashew nuts spilling across the frame" + MOOD,
    802,
  ],
  [
    "dates",
    "Cinematic close-up of soft glossy dark medjool dates piled in an aged brass bowl, one date torn open showing caramel flesh" + MOOD,
    803,
  ],
  [
    "almond",
    "Cinematic close-up of raw brown-skinned almonds scattered in a drift across the frame" + MOOD,
    804,
  ],
  [
    "walnut",
    "Cinematic close-up of golden walnut kernel halves heaped beside two cracked walnut shells" + MOOD,
    805,
  ],
  [
    "pistachio",
    "Cinematic close-up of roasted pistachios in split shells, vivid green kernels showing" + MOOD,
    806,
  ],
  [
    "raisin",
    "Cinematic close-up of long golden-green sultana raisins heaped on dark slate" + MOOD,
    807,
  ],
  [
    "mix",
    "Cinematic shot of a premium dry fruit mix — cashews, almonds, pistachios, raisins — pouring in motion from a tilted aged brass scoop" + MOOD,
    808,
  ],
];

const exists = (f) => access(f).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchImage(prompt, seed) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1344&height=768&nologo=true&seed=${seed}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(150_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 20_000) throw new Error(`too small (${buf.length}B)`);
      return buf;
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(6000 * attempt);
    }
  }
}

await mkdir(OUT, { recursive: true });
await mkdir(CACHE, { recursive: true });

for (const [name, prompt, seed] of SCENES) {
  const marker = path.join(CACHE, `${name}.done`);
  if (!FORCE && (await exists(marker))) continue;
  const src = await fetchImage(prompt, seed);
  await sharp(src).webp({ quality: 80 }).toFile(path.join(OUT, `${name}.webp`));
  await writeFile(marker, new Date().toISOString());
  console.log(`✓ ${name}.webp`);
  await sleep(6000);
}

console.log("Cinematic set done.");
