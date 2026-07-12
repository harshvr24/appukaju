/**
 * Fetches the "Appu Story" cinematic stills — the elephant prologue that
 * opens the site — from Pollinations (free) and converts to WebP.
 * Rerun-safe via scripts/.story-cache markers.
 *
 *   node scripts/fetch-story.mjs [--force]
 */
import sharp from "sharp";
import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "public/images/story");
const CACHE = path.resolve(process.cwd(), "scripts/.story-cache");
const FORCE = process.argv.includes("--force");

const MOOD =
  ", golden hour, volumetric light rays through mist, floating dust particles, cinematic film still, shallow depth of field, photorealistic, rich deep tones, no text, no people";

/** [name, prompt, seed] — all 1344×768 landscape. */
const SCENES = [
  [
    "dawn",
    "Dark ancient Indian jungle at sunrise, dense banyan and teak trees, golden sun rays breaking through morning mist over a forest path" + MOOD,
    901,
  ],
  [
    "appu",
    "A majestic wild Indian elephant with small tusks walking slowly toward the camera on a misty jungle path, low angle, ultra realistic wrinkled skin texture, calm wise eyes, golden sunrise behind it" + MOOD,
    902,
  ],
  [
    "offering",
    "A majestic Indian elephant with trunk gently raised, green leaves and whole cashews and almonds floating suspended in golden light around the trunk, magical realism" + MOOD,
    903,
  ],
  [
    "gift",
    "A handcrafted carved dark teak wooden gift box standing open on green forest moss, a matte dark brown pouch nestled inside, warm golden glow emanating from the box, luxury product photography" + MOOD,
    904,
  ],
  [
    "orchard",
    "A magical miniature orchard glowing inside warm light: flourishing cashew trees with red cashew apples, almond branches, pistachio clusters, grape vines with golden raisins, tilt-shift macro" + MOOD,
    905,
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

console.log("Story stills done.");
