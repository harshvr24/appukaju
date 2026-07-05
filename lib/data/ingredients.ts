import type { Ingredient } from "@/types";

export const ingredients: Ingredient[] = [
  {
    id: "cashew",
    name: "Cashew",
    hindiName: "Kaju",
    tagline: "The crown jewel of our craft since 1998",
    benefits: [
      { title: "High Protein", detail: "18 g of plant protein per 100 g for lasting strength" },
      { title: "Healthy Fats", detail: "Rich in heart-friendly monounsaturated fats" },
      { title: "Heart Friendly", detail: "Zero cholesterol, naturally supports cardiac health" },
      { title: "Energy Booster", detail: "Copper and magnesium for all-day vitality" },
    ],
    description:
      "Hand-graded W180 and W240 kernels, slow-dried to a buttery crunch. The kaju that built our name across Lucknow's kitchens.",
    origin: "Konkan Coast, Maharashtra & Goa",
    accent: "#e8d8c3",
    nutrition: { calories: 553, protein: 18, fat: 44, carbs: 30, fiber: 3.3 },
  },
  {
    id: "almond",
    name: "Almond",
    hindiName: "Badam",
    tagline: "Brain food, perfected by altitude",
    benefits: [
      { title: "Brain Health", detail: "Riboflavin and L-carnitine support cognition" },
      { title: "Vitamin E", detail: "Half your daily dose in a single handful" },
      { title: "Improves Memory", detail: "A morning soak-and-peel ritual trusted for generations" },
      { title: "Antioxidants", detail: "Skin-on kernels rich in polyphenols" },
    ],
    description:
      "Plump, sweet kernels with the deep flavour that only slow mountain ripening gives — never bleached, never polished.",
    origin: "Kashmir Valley & Himachal foothills",
    accent: "#d9b98d",
    nutrition: { calories: 579, protein: 21, fat: 50, carbs: 22, fiber: 12.5 },
  },
  {
    id: "walnut",
    name: "Walnut",
    hindiName: "Akhrot",
    tagline: "Omega-3 in its most honest form",
    benefits: [
      { title: "Omega-3", detail: "The richest plant source of ALA omega-3" },
      { title: "Heart Health", detail: "Shown to support healthy cholesterol levels" },
      { title: "Brain Development", detail: "Folate and polyphenols for growing minds" },
    ],
    description:
      "Light-hued Kashmiri kernels cracked by hand so every half arrives whole, sweet and free of bitterness.",
    origin: "Anantnag, Kashmir",
    accent: "#b08968",
    nutrition: { calories: 654, protein: 15, fat: 65, carbs: 14, fiber: 6.7 },
  },
  {
    id: "pistachio",
    name: "Pistachio",
    hindiName: "Pista",
    tagline: "The emerald of the dry fruit world",
    benefits: [
      { title: "Complete Protein", detail: "All nine essential amino acids in one nut" },
      { title: "Fiber Rich", detail: "Feeds good gut bacteria, keeps you fuller longer" },
      { title: "Eye Health", detail: "Lutein and zeaxanthin protect your vision" },
      { title: "Healthy Snacking", detail: "Among the lowest-calorie premium nuts" },
    ],
    description:
      "Naturally opened, vividly green kernels — lightly roasted in small batches to wake up their sweetness.",
    origin: "Select high-desert estates",
    accent: "#a8c49a",
    nutrition: { calories: 560, protein: 20, fat: 45, carbs: 28, fiber: 10.6 },
  },
  {
    id: "raisin",
    name: "Raisin",
    hindiName: "Kishmish",
    tagline: "Sun-dried sweetness, nothing added",
    benefits: [
      { title: "Natural Energy", detail: "Fruit sugars with iron for quick, clean fuel" },
      { title: "Digestive Health", detail: "Traditional aid for gut comfort" },
      { title: "Bone Support", detail: "Calcium and boron work together quietly" },
    ],
    description:
      "Long, golden-green Sangli raisins dried in shade the slow way — plump, seedless and honey-sweet.",
    origin: "Sangli & Nashik, Maharashtra",
    accent: "#c9a227",
    nutrition: { calories: 299, protein: 3, fat: 0.5, carbs: 79, fiber: 3.7 },
  },
  {
    id: "dates",
    name: "Dates",
    hindiName: "Khajoor",
    tagline: "Nature's caramel, centuries of trust",
    benefits: [
      { title: "Instant Energy", detail: "Natural glucose the body uses immediately" },
      { title: "Iron Rich", detail: "A traditional answer to everyday fatigue" },
      { title: "Fiber Dense", detail: "8 g per 100 g for effortless digestion" },
    ],
    description:
      "Soft, dark, toffee-fleshed dates with a clean caramel finish — the natural sweetener in our Premium Mix.",
    origin: "Kutch, Gujarat & select oases",
    accent: "#7a4a2b",
    nutrition: { calories: 277, protein: 1.8, fat: 0.2, carbs: 75, fiber: 6.7 },
  },
];

export const getIngredient = (id: string) =>
  ingredients.find((i) => i.id === id);
