"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Star, Minus, Plus, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import type { Product } from "@/types";
import { products } from "@/lib/data/products";
import { getIngredient } from "@/lib/data/ingredients";
import { brand } from "@/lib/data/brand";
import { useCart } from "@/lib/stores/cart";
import { useUi, useRecentlyViewed } from "@/lib/stores/ui";
import { useMounted } from "@/lib/hooks/use-mounted";
import { flyToCart } from "@/lib/fly-to-cart";
import { formatINR, cn } from "@/lib/utils";
import { ProductVisual } from "@/components/shared/product-visual";
import { NutritionWheel } from "@/components/product/nutrition-wheel";
import { ProductCard } from "@/components/product/product-card";
import { LuxuryAccordion } from "@/components/ui/luxury-accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

export function ProductDetail({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const pushRecent = useRecentlyViewed((s) => s.push);
  const recentSlugs = useRecentlyViewed((s) => s.slugs);
  const mounted = useMounted();
  const router = useRouter();
  const addRef = useRef<HTMLButtonElement>(null);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const ingredient =
    product.category !== "mix" && product.category !== "gifting"
      ? getIngredient(product.category)
      : null;

  // Drag-to-rotate showcase
  const rotY = useMotionValue(0);
  const springRot = useSpring(rotY, { stiffness: 90, damping: 16 });
  const shadowX = useTransform(springRot, [-18, 18], ["6%", "-6%"]);

  useEffect(() => {
    pushRecent(product.slug);
  }, [product.slug, pushRecent]);

  const orbitChips = ingredient
    ? ingredient.benefits.map((b) => b.title)
    : product.badges;

  const recommendations = product.pairsWith
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const recentlyViewed = mounted
    ? recentSlugs
        .filter((slug) => slug !== product.slug)
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 3)
    : [];

  return (
    <div className="mx-auto max-w-[1600px] px-5 pt-32 pb-24 md:px-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-10 text-xs text-chocolate/50">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="transition-colors hover:text-chocolate">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/products" className="transition-colors hover:text-chocolate">Collection</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-chocolate">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* ── Showcase ─────────────────────────────────── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div style={{ perspective: 1400 }} className="relative">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDrag={(_, info) => rotY.set(Math.max(-18, Math.min(18, info.offset.x * 0.12)))}
              onDragEnd={() => rotY.set(0)}
              style={{ rotateY: springRot, transformStyle: "preserve-3d" }}
              className="relative cursor-grab active:cursor-grabbing"
            >
              <ProductVisual
                src={product.image}
                alt={product.name}
                accent={product.accent}
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="aspect-[4/4.2] rounded-[2rem] shadow-lift md:aspect-[4/3.9]"
              />
              <motion.div
                aria-hidden
                className="absolute -bottom-6 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-full bg-cocoa/20 blur-xl"
                style={{ x: shadowX }}
              />
            </motion.div>

            {/* Orbiting benefit chips (desktop) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden lg:block"
            >
              <div className="absolute inset-[-3rem] animate-[spin_36s_linear_infinite] motion-reduce:animate-none">
                {orbitChips.slice(0, 4).map((chip, i) => {
                  const angle = (i / Math.min(orbitChips.length, 4)) * 360;
                  return (
                    <span
                      key={chip}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        transform: `rotate(${angle}deg) translateX(min(21vw, 21rem)) rotate(-${angle}deg)`,
                      }}
                    >
                      <span className="glass inline-block -translate-x-1/2 -translate-y-1/2 animate-[spin_36s_linear_infinite_reverse] rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap text-chocolate/80 shadow-soft motion-reduce:animate-none">
                        {chip}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-chocolate/40 lg:mt-10">
            Drag to rotate
          </p>
        </div>

        {/* ── Purchase panel ───────────────────────────── */}
        <div>
          <Reveal>
            <p className="eyebrow text-walnut">
              {product.line} Line {product.isRealSku && "· Original since 1998"}
            </p>
            <h1 className="text-display mt-3 text-[clamp(2.2rem,4.5vw,3.6rem)] text-chocolate">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex items-center gap-1" aria-label={`Rated ${product.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < Math.round(product.rating)
                        ? "fill-terracotta text-terracotta"
                        : "text-chocolate/20"
                    )}
                  />
                ))}
              </span>
              <span className="text-sm text-chocolate/55">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>
            <p className="mt-6 text-base leading-relaxed text-chocolate/70">
              {product.description}
            </p>
          </Reveal>

          {/* Variants */}
          <Reveal delay={0.1} className="mt-9">
            <p className="mb-3 text-sm font-medium text-chocolate">Pack size</p>
            <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Pack size">
              {product.variants.map((v) => {
                const active = v.id === variantId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setVariantId(v.id)}
                    className={cn(
                      "cursor-pointer rounded-2xl border px-5 py-3 text-left transition-all duration-400 ease-(--ease-out-expo)",
                      active
                        ? "border-forest bg-forest text-parchment shadow-soft"
                        : "border-chocolate/15 text-chocolate hover:border-chocolate/40"
                    )}
                  >
                    <span className="block text-sm font-semibold">{v.label}</span>
                    <span className={cn("block text-xs tabular-nums", active ? "text-cream/70" : "text-chocolate/55")}>
                      {formatINR(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Price + qty + CTAs */}
          <Reveal delay={0.15} className="mt-9">
            <div className="flex flex-wrap items-center gap-5">
              <p className="font-display text-4xl font-semibold tabular-nums text-chocolate">
                {formatINR(variant.price * quantity)}
              </p>
              <div className="flex items-center rounded-full border border-chocolate/15">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="grid size-11 cursor-pointer place-items-center transition-colors hover:text-terracotta"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center font-semibold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="grid size-11 cursor-pointer place-items-center transition-colors hover:text-terracotta"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3.5">
              <Button
                ref={addRef}
                size="lg"
                variant="dark"
                className="flex-1 sm:flex-none sm:min-w-52"
                onClick={() => {
                  addItem(product.id, variantId, quantity);
                  if (addRef.current) flyToCart(addRef.current);
                }}
              >
                Add to cart
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  addItem(product.id, variantId, quantity);
                  router.push("/checkout");
                }}
              >
                Buy now
              </Button>
            </div>
            <div className="mt-7 grid gap-3 text-xs text-chocolate/60 sm:grid-cols-3">
              <p className="flex items-center gap-2">
                <Truck className="size-3.5 text-terracotta" /> Free shipping over {formatINR(brand.freeShippingThreshold)}
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-terracotta" /> Batch-dated freshness
              </p>
              <p className="flex items-center gap-2">
                <RotateCcw className="size-3.5 text-terracotta" /> 7-day replacement
              </p>
            </div>
          </Reveal>

          {/* Story */}
          <Reveal delay={0.2} className="mt-12">
            <blockquote className="rounded-3xl border-l-2 border-terracotta bg-cashew p-7 font-display text-lg leading-relaxed text-chocolate/85 italic md:text-xl">
              &ldquo;{product.story}&rdquo;
              <footer className="mt-3 font-body text-xs font-medium tracking-wide text-walnut not-italic">
                — The Appu Kaju family
              </footer>
            </blockquote>
          </Reveal>

          {/* Nutrition */}
          <Reveal delay={0.1} className="mt-12">
            <h2 className="mb-6 font-display text-2xl font-semibold text-chocolate">
              Nutrition, per 100 g
            </h2>
            <NutritionWheel nutrition={product.nutrition} />
          </Reveal>

          {/* Details accordion */}
          <Reveal delay={0.1} className="mt-10">
            <LuxuryAccordion
              items={[
                {
                  id: "freshness",
                  question: "Freshness & storage",
                  answer:
                    "Packed in food-grade, resealable liners with the batch date printed on every pack. After opening, store airtight away from sunlight; refrigerate in humid months. Best within 8–10 weeks of opening.",
                },
                {
                  id: "shipping",
                  question: "Shipping & delivery",
                  answer: `Dispatched from our ${brand.city} facility within 24 hours on working days. Metros typically receive orders in 2–4 days. Free shipping on orders over ${formatINR(brand.freeShippingThreshold)}.`,
                },
                {
                  id: "returns",
                  question: "Replacement promise",
                  answer:
                    "Not happy? Tell us within 7 days and we replace or refund — no questions, no return-shipping drama. A family business only survives 28 years one way.",
                },
              ]}
            />
          </Reveal>
        </div>
      </div>

      {/* ── Pairs with ─────────────────────────────────── */}
      {recommendations.length > 0 && (
        <section className="mt-28">
          <SectionHeading eyebrow="Pairs beautifully with" title="Complete the shelf." className="mb-12" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Recently viewed ────────────────────────────── */}
      {recentlyViewed.length > 0 && (
        <section className="mt-24">
          <h2 className="eyebrow mb-8 text-walnut">Recently viewed</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
