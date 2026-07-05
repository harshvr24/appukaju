import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "appu-kaju-classic",
    slug: "appu-kaju-classic",
    name: "Appu Kaju Classic",
    line: "Signature",
    category: "cashew",
    shortDescription: "The original. Crunchy, creamy W240 kernels since 1998.",
    description:
      "Our founding product and still our best seller. Whole W240 cashew kernels from the Konkan coast, slow-dried and hand-graded in our Lucknow factory for the buttery crunch three generations of families trust.",
    story:
      "In 1998 we roasted our first batch in a single-room factory in Lucknow. The recipe hasn't changed — only the number of homes it reaches.",
    variants: [
      { id: "250g", label: "250 g", grams: 250, price: 243 },
      { id: "1kg", label: "1 kg", grams: 1000, price: 972 },
    ],
    badges: ["Best Seller", "Since 1998"],
    featured: true,
    isRealSku: true,
    image: "/images/products/appu-kaju-classic.webp",
    accent: "#e8d8c3",
    nutrition: { calories: 553, protein: 18, fat: 44, carbs: 30, fiber: 3.3 },
    rating: 4.8,
    reviewCount: 412,
    pairsWith: ["rimmee-kaju", "premium-mix"],
  },
  {
    id: "rimmee-kaju",
    slug: "rimmee-kaju",
    name: "Rimmee Kaju",
    line: "Reserve",
    category: "cashew",
    shortDescription: "Large W180 'king-size' kernels for those who notice.",
    description:
      "Rimmee is our reserve grade: W180 king-size kernels, uniformly ivory, with a fuller bite and a sweeter, creamier finish. Chosen kernel by kernel for weddings, gifting and the festival table.",
    story:
      "Named inside the family, graded above everything else we sell. When a kernel is too good for the Classic line, it becomes Rimmee.",
    variants: [
      { id: "250g", label: "250 g", grams: 250, price: 300 },
      { id: "1kg", label: "1 kg", grams: 1000, price: 1200 },
      { id: "10kg", label: "10 kg", grams: 10000, price: 12000 },
    ],
    badges: ["Reserve Grade", "W180"],
    featured: true,
    isRealSku: true,
    image: "/images/products/rimmee-kaju.webp",
    accent: "#f5efe4",
    nutrition: { calories: 553, protein: 18, fat: 44, carbs: 30, fiber: 3.3 },
    rating: 4.9,
    reviewCount: 287,
    pairsWith: ["appu-kaju-classic", "royale-pista"],
  },
  {
    id: "kuber-kaju",
    slug: "kuber-kaju",
    name: "Kuber Kaju",
    line: "Heritage",
    category: "cashew",
    shortDescription: "Bulk 10 kg packs for sweet shops, hotels and events.",
    description:
      "The workhorse of Lucknow's halwais. Kuber is our trade pack: consistent, fresh-batch cashews at wholesale value, delivered factory-direct in sealed 10 kg liners.",
    story:
      "Half the kaju katli in our city starts as a Kuber pack. Ask any sweet shop on Aminabad's lanes.",
    variants: [{ id: "10kg", label: "10 kg", grams: 10000, price: 8760 }],
    badges: ["Wholesale", "Factory Direct"],
    featured: false,
    isRealSku: true,
    image: "/images/products/kuber-kaju.webp",
    accent: "#eae0d0",
    nutrition: { calories: 553, protein: 18, fat: 44, carbs: 30, fiber: 3.3 },
    rating: 4.7,
    reviewCount: 96,
    pairsWith: ["rimmee-kaju"],
  },
  {
    id: "kashmiri-badam",
    slug: "kashmiri-badam",
    name: "Kashmiri Badam",
    line: "Reserve",
    category: "almond",
    shortDescription: "Small, intensely sweet valley almonds with skin on.",
    description:
      "True Kashmiri kernels — smaller than imported almonds and twice the flavour. Skin-on, oil-rich, perfect for the traditional overnight soak.",
    story:
      "Sourced each October from family orchards in the valley, before the first snow closes the passes.",
    variants: [
      { id: "250g", label: "250 g", grams: 250, price: 425 },
      { id: "500g", label: "500 g", grams: 500, price: 799 },
      { id: "1kg", label: "1 kg", grams: 1000, price: 1499 },
    ],
    badges: ["Single Origin", "Skin-On"],
    featured: true,
    isRealSku: false,
    image: "/images/products/kashmiri-badam.webp",
    accent: "#d9b98d",
    nutrition: { calories: 579, protein: 21, fat: 50, carbs: 22, fiber: 12.5 },
    rating: 4.8,
    reviewCount: 154,
    pairsWith: ["kashmiri-akhrot", "premium-mix"],
  },
  {
    id: "kashmiri-akhrot",
    slug: "kashmiri-akhrot",
    name: "Kashmiri Akhrot Halves",
    line: "Reserve",
    category: "walnut",
    shortDescription: "Hand-cracked light halves, sweet with zero bitterness.",
    description:
      "Light-coloured kernel halves cracked by hand in Anantnag so they arrive whole. Mild, sweet, and rich in omega-3 — nothing like the dark, bitter kernels machines produce.",
    story:
      "Each shell is tapped open on a river stone, the way it has been done for a hundred years.",
    variants: [
      { id: "250g", label: "250 g", grams: 250, price: 549 },
      { id: "500g", label: "500 g", grams: 500, price: 1049 },
    ],
    badges: ["Hand-Cracked", "Light Halves"],
    featured: false,
    isRealSku: false,
    image: "/images/products/kashmiri-akhrot.webp",
    accent: "#b08968",
    nutrition: { calories: 654, protein: 15, fat: 65, carbs: 14, fiber: 6.7 },
    rating: 4.7,
    reviewCount: 118,
    pairsWith: ["kashmiri-badam", "medjool-khajoor"],
  },
  {
    id: "royale-pista",
    slug: "royale-pista",
    name: "Pista Royale",
    line: "Celebration",
    category: "pistachio",
    shortDescription: "Naturally-opened, lightly roasted and salted pistachios.",
    description:
      "Vivid green kernels in naturally split shells, roasted in small batches with a whisper of pink salt. The snack bowl that empties first at every gathering.",
    story:
      "We roast pista twice a week, never more than 40 kg at a time, so the batch on your shelf is always days old — not months.",
    variants: [
      { id: "250g", label: "250 g", grams: 250, price: 475 },
      { id: "500g", label: "500 g", grams: 500, price: 899 },
    ],
    badges: ["Small Batch", "Lightly Salted"],
    featured: true,
    isRealSku: false,
    image: "/images/products/royale-pista.webp",
    accent: "#a8c49a",
    nutrition: { calories: 560, protein: 20, fat: 45, carbs: 28, fiber: 10.6 },
    rating: 4.9,
    reviewCount: 203,
    pairsWith: ["premium-mix", "appu-kaju-classic"],
  },
  {
    id: "sangli-kishmish",
    slug: "sangli-kishmish",
    name: "Sangli Golden Kishmish",
    line: "Heritage",
    category: "raisin",
    shortDescription: "Long golden raisins, shade-dried and honey-sweet.",
    description:
      "Seedless long raisins from Sangli's vineyards, dried slowly in shade to keep their golden-green colour and plump bite. No sulphur burn, no added sugar — just the grape.",
    story:
      "Dried on rope racks under tin roofs, turned by hand every morning for three weeks.",
    variants: [
      { id: "250g", label: "250 g", grams: 250, price: 165 },
      { id: "500g", label: "500 g", grams: 500, price: 299 },
    ],
    badges: ["Shade-Dried", "No Added Sugar"],
    featured: false,
    isRealSku: false,
    image: "/images/products/sangli-kishmish.webp",
    accent: "#c9a227",
    nutrition: { calories: 299, protein: 3, fat: 0.5, carbs: 79, fiber: 3.7 },
    rating: 4.6,
    reviewCount: 89,
    pairsWith: ["medjool-khajoor", "premium-mix"],
  },
  {
    id: "medjool-khajoor",
    slug: "medjool-khajoor",
    name: "Kutch Khajoor",
    line: "Heritage",
    category: "dates",
    shortDescription: "Soft, toffee-fleshed dates with a clean caramel finish.",
    description:
      "Dark, generous dates from Kutch orchards — soft enough to spread, sweet enough to replace sugar in your kitchen. Pitted with care, packed the same week they arrive.",
    story:
      "Our khajoor supplier has sent us the same week-one harvest allocation for eleven years running.",
    variants: [
      { id: "400g", label: "400 g", grams: 400, price: 349 },
      { id: "800g", label: "800 g", grams: 800, price: 649 },
    ],
    badges: ["Naturally Sweet", "Week-One Harvest"],
    featured: false,
    isRealSku: false,
    image: "/images/products/medjool-khajoor.webp",
    accent: "#7a4a2b",
    nutrition: { calories: 277, protein: 1.8, fat: 0.2, carbs: 75, fiber: 6.7 },
    rating: 4.8,
    reviewCount: 134,
    pairsWith: ["kashmiri-akhrot", "sangli-kishmish"],
  },
  {
    id: "premium-mix",
    slug: "premium-mix",
    name: "Appu Premium Mix",
    line: "Signature",
    category: "mix",
    shortDescription: "Six-fruit signature blend — our whole story in one pack.",
    description:
      "Cashew, almond, walnut, pistachio, golden raisin and date in the proportion we serve our own family: more nuts than fruit, nothing roasted in oil, nothing coated. A complete handful of nutrition, twice a day.",
    story:
      "Blended fresh every Monday and Thursday. The ratio took us two years of family arguments to settle — and it was worth every one.",
    variants: [
      { id: "250g", label: "250 g", grams: 250, price: 399 },
      { id: "500g", label: "500 g", grams: 500, price: 749 },
      { id: "1kg", label: "1 kg", grams: 1000, price: 1399 },
    ],
    badges: ["Signature Blend", "6 Fruits"],
    featured: true,
    isRealSku: false,
    image: "/images/products/premium-mix.webp",
    accent: "#c6a15b",
    nutrition: { calories: 520, protein: 15, fat: 38, carbs: 38, fiber: 6.2 },
    rating: 4.9,
    reviewCount: 326,
    pairsWith: ["rimmee-kaju", "royale-pista"],
  },
  {
    id: "utsav-gift-hamper",
    slug: "utsav-gift-hamper",
    name: "Utsav Gift Hamper",
    line: "Celebration",
    category: "gifting",
    shortDescription: "Four reserve packs in a keepsake box, ribbon-tied.",
    description:
      "Rimmee Kaju, Kashmiri Badam, Pista Royale and the Premium Mix in 250 g reserve packs, nested in a cloth-lined keepsake box with a hand-tied ribbon and your gift note in letterpress.",
    story:
      "Built for Diwali, adopted for weddings, birthdays and 'just because'. We pack each hamper to order — never in advance.",
    variants: [
      { id: "classic", label: "Classic (4 × 250 g)", grams: 1000, price: 1599 },
      { id: "grand", label: "Grand (6 × 250 g)", grams: 1500, price: 2299 },
    ],
    badges: ["Gift Ready", "Packed to Order"],
    featured: true,
    isRealSku: false,
    image: "/images/products/utsav-hamper.webp",
    accent: "#d4af37",
    nutrition: { calories: 545, protein: 17, fat: 42, carbs: 32, fiber: 6.0 },
    rating: 5.0,
    reviewCount: 74,
    pairsWith: ["premium-mix", "rimmee-kaju"],
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const featuredProducts = products.filter((p) => p.featured);

export const getVariant = (productId: string, variantId: string) => {
  const product = products.find((p) => p.id === productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : undefined;
};
