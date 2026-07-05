export type IngredientId =
  | "cashew"
  | "almond"
  | "walnut"
  | "pistachio"
  | "raisin"
  | "dates";

export type ProductCategory = IngredientId | "mix" | "gifting";

export interface NutritionFacts {
  /** per 100 g */
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
}

export interface Ingredient {
  id: IngredientId;
  name: string;
  hindiName: string;
  tagline: string;
  benefits: { title: string; detail: string }[];
  description: string;
  origin: string;
  accent: string;
  nutrition: NutritionFacts;
}

export interface ProductVariant {
  id: string;
  label: string;
  grams: number;
  price: number;
  mrp?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  line: "Signature" | "Heritage" | "Reserve" | "Celebration";
  category: ProductCategory;
  shortDescription: string;
  description: string;
  story: string;
  variants: ProductVariant[];
  badges: string[];
  featured: boolean;
  isRealSku: boolean;
  image: string;
  accent: string;
  nutrition: NutritionFacts;
  rating: number;
  reviewCount: number;
  pairsWith: string[];
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  intro: string;
  time: string;
  difficulty: "Easy" | "Medium" | "Artisan";
  serves: number;
  heroIngredient: IngredientId | "mix";
  ingredients: string[];
  steps: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  context: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  category: string;
  image: string;
  body: { heading?: string; text: string }[];
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: "Products" | "Orders" | "Quality" | "Gifting";
}

export interface Farm {
  id: string;
  region: string;
  state: string;
  crop: string;
  description: string;
  altitude?: string;
  harvest: string;
  coordinates: { x: number; y: number }; // % position on the India map SVG viewBox
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
