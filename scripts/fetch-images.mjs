/**
 * Fetches the full brand image set from Pollinations.ai (free, no account)
 * and writes optimized WebP files into public/images at the paths the
 * data layer references. Rerun-safe: skips files that already exist unless
 * called with --force.
 *
 *   node scripts/fetch-images.mjs [--force]
 */
import sharp from "sharp";
import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "public/images");
const CACHE = path.resolve(process.cwd(), "scripts/.image-cache");
const FORCE = process.argv.includes("--force");

const STYLE =
  ", warm cream and chocolate brown palette with gold accents, soft studio lighting, premium food photography, photorealistic";
const NOTEXT = ", no text, no words, no watermark";

const HIKEY =
  ", on a clean bright white background, high-key studio lighting, fresh and airy, warm yellow-gold accents, premium food photography, photorealistic";

/** [relPath, prompt, width, height, seed] */
const IMAGES = [
  // ── Hero (bright, white background) ──────────────────────
  ["hero/packet.webp", "A premium kraft and gold stand-up pouch of dry fruits standing upright, elegant minimal packaging design, a few cashews scattered at its base" + HIKEY + NOTEXT, 1024, 1280, 501],
  ["hero/cashew.webp", "Generous pile of whole ivory cashew kernels, appetizing and fresh, one or two kernels in sharp foreground focus" + HIKEY + NOTEXT, 1280, 960, 503],
  ["hero/almond.webp", "Generous pile of raw brown-skinned almonds, a few scattered around, appetizing and fresh" + HIKEY + NOTEXT, 1280, 960, 507],
  ["hero/walnut.webp", "Golden walnut kernel halves piled and scattered, one cracked walnut shell beside" + HIKEY + NOTEXT, 1280, 960, 509],
  ["hero/pistachio.webp", "Pile of roasted pistachios with naturally split shells showing green kernels, a few loose green kernels in front" + HIKEY + NOTEXT, 1280, 960, 511],
  ["hero/raisin.webp", "Golden-green long seedless raisins piled and scattered, glistening and plump" + HIKEY + NOTEXT, 1280, 960, 521],
  ["hero/dates.webp", "Soft dark plump dates arranged in a small pile, one split open showing caramel flesh" + HIKEY + NOTEXT, 1280, 960, 523],
  ["hero/mix-pour.webp", "Luxurious mix of cashews almonds walnuts pistachios raisins and dates cascading and scattered in an elegant arc, kernels in gentle motion" + HIKEY + NOTEXT, 1280, 960, 541],
  // ── Products (square stages) ─────────────────────────────
  ["products/appu-kaju-classic.webp", "Luxury product photography, premium dark chocolate brown stand-up pouch of cashew nuts with elegant gold foil typography, scattered whole ivory cashew kernels on warm cream linen, golden glow, shallow depth of field, high end food brand advertising", 1024, 1024, 42],
  ["products/rimmee-kaju.webp", "Extra large premium jumbo cashew kernels overflowing from a gold-rimmed ceramic bowl, uniform ivory white nuts, dark chocolate brown backdrop, dramatic soft light, luxury food photography" + NOTEXT, 1024, 1024, 7],
  ["products/kuber-kaju.webp", "Large burlap jute sack filled with cashew nuts in a warm rustic factory, cashews spilling out generously, golden hour light through windows" + NOTEXT, 1024, 1024, 11],
  ["products/kashmiri-badam.webp", "Raw almonds with brown skin piled in a hammered brass bowl on dark walnut wood, a few scattered almonds, warm moody light" + NOTEXT, 1024, 1024, 13],
  ["products/kashmiri-akhrot.webp", "Light golden walnut halves and cracked walnut shells arranged on grey stone surface, soft window light, rustic elegance" + NOTEXT, 1024, 1024, 17],
  ["products/royale-pista.webp", "Roasted pistachios with naturally split shells revealing vivid green kernels, light dusting of pink salt, dark slate background, macro food photography" + NOTEXT, 1024, 1024, 19],
  ["products/sangli-kishmish.webp", "Long golden-green seedless raisins in a clear glass jar and scattered on cream ceramic plate, honey tones, bright airy natural light" + NOTEXT, 1024, 1024, 23],
  ["products/medjool-khajoor.webp", "Soft dark plump dates arranged on a handmade ceramic plate, one date split open showing glossy caramel flesh, moody warm light" + NOTEXT, 1024, 1024, 29],
  ["products/premium-mix.webp", "Luxurious mix of cashews almonds walnuts pistachios golden raisins and dates overflowing from an ornate brass bowl onto cream linen, abundant, golden light" + NOTEXT, 1024, 1024, 31],
  ["products/utsav-hamper.webp", "Elegant festive gift hamper box with cloth lining holding small kraft pouches of dry fruits, gold ribbon, warm diya candle bokeh in background, indian festive luxury" + NOTEXT, 1024, 1024, 37],
  // ── Recipes ──────────────────────────────────────────────
  ["recipes/kaju-katli.webp", "Diamond-shaped kaju katli indian cashew sweets topped with delicate silver leaf on an antique brass plate, festive styling" + NOTEXT, 1280, 960, 101],
  ["recipes/badam-milk.webp", "Kesar badam milk, saffron almond milk in a tall glass garnished with saffron strands and pistachio slivers, warm indian kitchen" + NOTEXT, 1280, 960, 103],
  ["recipes/dry-fruit-ladoo.webp", "Round date and nut ladoo energy balls rolled in desiccated coconut on a ceramic plate, rustic warm kitchen" + NOTEXT, 1280, 960, 107],
  ["recipes/pista-kulfi.webp", "Pistachio kulfi indian ice cream on wooden sticks crusted with crushed green pistachios, slightly melting, chilled metal tray" + NOTEXT, 1280, 960, 109],
  ["recipes/date-walnut-cake.webp", "Sliced dark date and walnut loaf tea cake on a wooden board with walnut halves on top, cozy afternoon light" + NOTEXT, 1280, 960, 113],
  ["recipes/masala-kaju.webp", "Spice-roasted masala cashews with crispy curry leaves and red chilli powder in a black ceramic bowl, scattered spices around" + NOTEXT, 1280, 960, 127],
  // ── Blog ─────────────────────────────────────────────────
  ["blog/cashew-grades.webp", "Overhead shot of cashew kernels sorted into neat rows by size on a wooden grading tray, comparison layout, daylight" + NOTEXT, 1280, 960, 201],
  ["blog/soaked-almonds.webp", "Peeled soaked almonds in a small steel bowl of water on a kitchen counter, soft morning light, a few almond skins beside" + NOTEXT, 1280, 960, 203],
  ["blog/gifting-guide.webp", "Elegant flat lay of a dry fruit gift box with gold ribbon and a blank letterpress note card, top view, styled composition" + NOTEXT, 1280, 960, 207],
  ["blog/small-batch.webp", "Small vintage nut roasting drum machine in an artisan workshop, warm industrial light, copper tones" + NOTEXT, 1280, 960, 211],
  ["blog/daily-handful.webp", "A small 30 gram handful portion of mixed nuts on a wooden desk beside a glass storage jar and an open notebook, natural light" + NOTEXT, 1280, 960, 223],
  // ── Gallery ──────────────────────────────────────────────
  ["gallery/roasting-drum.webp", "Artisan nut roasting drum mid-roast with cashews tumbling, warm glow from the roaster, small family factory atmosphere" + NOTEXT, 960, 1280, 301],
  ["gallery/grading-table.webp", "Hands sorting ivory cashew kernels on a brightly lit grading table under daylight lamps, careful handwork" + NOTEXT, 1280, 960, 307],
  ["gallery/cashew-macro.webp", "Extreme macro photograph of premium ivory cashew kernels, natural texture and sheen, shallow focus" + NOTEXT, 1280, 960, 311],
  ["gallery/kashmir-orchard.webp", "Almond orchard in full pink-white blossom with snow-capped mountains behind, kashmir valley spring, dreamy light" + NOTEXT, 960, 1280, 313],
  ["gallery/packing-line.webp", "Sealed kraft paper pouches of dry fruits lined up on a small packing table, hands sealing one pouch, tidy workshop" + NOTEXT, 1280, 960, 317],
  ["gallery/pista-batch.webp", "Freshly roasted pistachios cooling on a large steel tray, gentle steam, warm workshop light" + NOTEXT, 1280, 960, 331],
  ["gallery/hamper-making.webp", "Hands tying a gold silk ribbon bow on a festive cloth-lined gift hamper of dry fruits, warm workshop" + NOTEXT, 960, 1280, 337],
  ["gallery/konkan-yard.webp", "Cashew drying yard on the indian konkan coast, cashews spread on woven mats, palm trees and warm coastal light" + NOTEXT, 1280, 960, 347],
  ["gallery/premium-mix.webp", "Mixed dry fruits pouring from a brass scoop into a large bowl, kernels in motion, golden light, abundance" + NOTEXT, 1280, 960, 349],
];

const exists = (f) => access(f).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchImage(prompt, width, height, seed) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + STYLE)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 10_000) throw new Error(`suspiciously small (${buf.length}B)`);
  return buf;
}

let ok = 0;
let skipped = 0;
const failed = [];

for (const [rel, prompt, w, h, seed] of IMAGES) {
  const target = path.join(OUT, rel);
  const marker = path.join(CACHE, rel.replace(/[\\/]/g, "__") + ".done");
  await mkdir(path.dirname(target), { recursive: true });
  await mkdir(CACHE, { recursive: true });
  if (!FORCE && (await exists(marker))) {
    skipped++;
    continue;
  }
  let done = false;
  for (let attempt = 1; attempt <= 3 && !done; attempt++) {
    try {
      const buf = await fetchImage(prompt, w, h, seed + (attempt - 1) * 1000);
      await sharp(buf).webp({ quality: 82 }).toFile(target);
      // Marker so reruns skip finished AI images (placeholders lack it).
      await writeFile(marker, new Date().toISOString());
      ok++;
      done = true;
      console.log(`✓ ${rel}`);
    } catch (err) {
      console.warn(`  retry ${attempt} for ${rel}: ${err.message}`);
      await sleep(5000 * attempt);
    }
  }
  if (!done) failed.push(rel);
  await sleep(6000); // be polite to the free API
}

console.log(`\nDone: ${ok} fetched, ${skipped} already present, ${failed.length} failed`);
if (failed.length) {
  console.log("Failed:", failed.join(", "));
  process.exitCode = 1;
}
