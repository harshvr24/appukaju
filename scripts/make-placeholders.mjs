/**
 * Renders branded placeholder art (SVG → WebP via sharp) for every image
 * path referenced in lib/data. Rerun any time: `node scripts/make-placeholders.mjs`.
 * Replace with real photography by overwriting the same paths.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "public/images");

/** [relPath, accent, label, style] */
const IMAGES = [
  // Products
  ["products/appu-kaju-classic.webp", "#e8d8c3", "Appu Kaju Classic", "dark"],
  ["products/rimmee-kaju.webp", "#f5efe4", "Rimmee Kaju", "dark"],
  ["products/kuber-kaju.webp", "#eae0d0", "Kuber Kaju", "dark"],
  ["products/kashmiri-badam.webp", "#d9b98d", "Kashmiri Badam", "dark"],
  ["products/kashmiri-akhrot.webp", "#b08968", "Kashmiri Akhrot", "dark"],
  ["products/royale-pista.webp", "#a8c49a", "Pista Royale", "dark"],
  ["products/sangli-kishmish.webp", "#c9a227", "Sangli Kishmish", "dark"],
  ["products/medjool-khajoor.webp", "#7a4a2b", "Kutch Khajoor", "dark"],
  ["products/premium-mix.webp", "#c6a15b", "Premium Mix", "dark"],
  ["products/utsav-hamper.webp", "#d4af37", "Utsav Hamper", "dark"],
  // Recipes
  ["recipes/kaju-katli.webp", "#e8d8c3", "Kaju Katli", "warm"],
  ["recipes/badam-milk.webp", "#d9b98d", "Badam Milk", "warm"],
  ["recipes/dry-fruit-ladoo.webp", "#c6a15b", "Dry Fruit Ladoo", "warm"],
  ["recipes/pista-kulfi.webp", "#a8c49a", "Pista Kulfi", "warm"],
  ["recipes/date-walnut-cake.webp", "#7a4a2b", "Date & Walnut Cake", "warm"],
  ["recipes/masala-kaju.webp", "#9c6b3f", "Masala Kaju", "warm"],
  // Blog
  ["blog/cashew-grades.webp", "#c6a15b", "Cashew Grades", "light"],
  ["blog/soaked-almonds.webp", "#d9b98d", "Soaked Almonds", "light"],
  ["blog/gifting-guide.webp", "#d4af37", "Gifting Guide", "light"],
  ["blog/small-batch.webp", "#6b4a2e", "Small Batch", "light"],
  ["blog/daily-handful.webp", "#a8c49a", "Daily Handful", "light"],
  // Gallery
  ["gallery/roasting-drum.webp", "#6b4a2e", "The Roasting Drum", "dark"],
  ["gallery/grading-table.webp", "#e8d8c3", "The Grading Table", "warm"],
  ["gallery/cashew-macro.webp", "#f5efe4", "W180 · Up Close", "dark"],
  ["gallery/kashmir-orchard.webp", "#a8c49a", "Kashmir Orchard", "light"],
  ["gallery/packing-line.webp", "#c6a15b", "The Packing Line", "warm"],
  ["gallery/pista-batch.webp", "#a8c49a", "Monday's Pista", "dark"],
  ["gallery/hamper-making.webp", "#d4af37", "Hamper Making", "dark"],
  ["gallery/konkan-yard.webp", "#9c6b3f", "Konkan Drying Yard", "warm"],
  ["gallery/premium-mix.webp", "#c6a15b", "The Thursday Blend", "dark"],
];

const W = 1280;
const H = 960;

/** Deterministic PRNG per image so output is stable. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const PALETTES = {
  dark: { bg0: "#33221a", bg1: "#1c120b", ink: "#f5efe4" },
  warm: { bg0: "#f2e7d5", bg1: "#e2d0b6", ink: "#2b1d14" },
  light: { bg0: "#faf6ef", bg1: "#ece1cd", ink: "#2b1d14" },
};

function kernelCluster(rand, accent, style) {
  // Abstract "nut" ellipses drifting around the lower third.
  let out = "";
  const n = 14;
  for (let i = 0; i < n; i++) {
    const cx = W * (0.12 + rand() * 0.76);
    const cy = H * (0.58 + rand() * 0.34);
    const rx = 26 + rand() * 46;
    const ry = rx * (0.55 + rand() * 0.25);
    const rot = Math.floor(rand() * 180);
    const o = 0.1 + rand() * (style === "dark" ? 0.35 : 0.28);
    out += `<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" transform="rotate(${rot} ${cx.toFixed(0)} ${cy.toFixed(0)})" fill="${accent}" opacity="${o.toFixed(2)}"/>`;
  }
  return out;
}

const xml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildSvg([rel, accent, rawLabel, style], index) {
  const p = PALETTES[style];
  const label = xml(rawLabel);
  const labelUpper = xml(rawLabel.toUpperCase());
  const rand = rng(index * 7919 + 101);
  const initials = label
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .replace(/[^A-Za-zÀ-ž]/g, "")
    .slice(0, 2)
    .toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${p.bg0}"/>
      <stop offset="1" stop-color="${p.bg1}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.34" r="0.75">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="0.55" stop-color="${accent}" stop-opacity="0.14"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.85">
      <stop offset="0.62" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${style === "dark" ? 0.45 : 0.14}"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${kernelCluster(rand, accent, style)}
  <ellipse cx="${W / 2}" cy="${H * 0.78}" rx="${W * 0.3}" ry="${H * 0.045}" fill="#000" opacity="${style === "dark" ? 0.35 : 0.12}"/>
  <circle cx="${W / 2}" cy="${H * 0.4}" r="${H * 0.23}" fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="2"/>
  <circle cx="${W / 2}" cy="${H * 0.4}" r="${H * 0.205}" fill="none" stroke="${accent}" stroke-opacity="0.3" stroke-width="1"/>
  <text x="${W / 2}" y="${H * 0.435}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${H * 0.13}" font-weight="600" fill="${p.ink}" opacity="0.9">${initials}</text>
  <text x="${W / 2}" y="${H * 0.585}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${H * 0.036}" letter-spacing="6" fill="${accent}">${labelUpper}</text>
  <text x="${W / 2}" y="${H * 0.93}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="${H * 0.02}" letter-spacing="8" fill="${p.ink}" opacity="0.4">APPU KAJU · EST. 1998</text>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;
}

let done = 0;
for (const [i, entry] of IMAGES.entries()) {
  const [rel] = entry;
  const target = path.join(OUT, rel);
  await mkdir(path.dirname(target), { recursive: true });
  const svg = buildSvg(entry, i);
  await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(target);
  done++;
}
console.log(`Rendered ${done}/${IMAGES.length} placeholder images into public/images`);
