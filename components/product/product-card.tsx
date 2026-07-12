"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/lib/stores/cart";
import { useWishlist } from "@/lib/stores/wishlist";
import { useMounted } from "@/lib/hooks/use-mounted";
import { flyToCart } from "@/lib/fly-to-cart";
import { formatINR, cn } from "@/lib/utils";
import { TiltCard } from "@/components/shared/tilt-card";
import { ProductVisual } from "@/components/shared/product-visual";

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Featured cards get taller stages. */
  size?: "default" | "tall";
}

/** Cinematic product showcase card — not a grid commodity. */
export function ProductCard({ product, className, size = "default" }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const wishlistIds = useWishlist((s) => s.ids);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const mounted = useMounted();
  const addRef = useRef<HTMLButtonElement>(null);

  const firstVariant = product.variants[0];
  const wished = mounted && wishlistIds.includes(product.id);

  return (
    <TiltCard className={className}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-forest/10 bg-paper shadow-soft transition-shadow duration-700 hover:shadow-lift">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${product.name}`}
        />

        {/* Stage */}
        <div
          className={cn(
            "relative overflow-hidden",
            size === "tall" ? "aspect-[4/4.6]" : "aspect-[4/3.4]"
          )}
        >
          <ProductVisual
            src={product.image}
            alt={product.name}
            accent={product.accent}
            className="absolute inset-0 transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.06]"
          />
          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            {product.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-forest/80 px-3 py-1 text-[0.62rem] font-medium tracking-[0.14em] text-parchment uppercase backdrop-blur-sm"
              >
                {badge}
              </span>
            ))}
          </div>
          {/* Wishlist */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={wished}
            className="absolute top-4 right-4 z-20 grid size-9 cursor-pointer place-items-center rounded-full bg-cream/80 backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                wished ? "fill-red-600 text-red-600" : "text-chocolate/70"
              )}
              strokeWidth={1.75}
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-1.5 p-6">
          <p className="eyebrow text-[0.58rem] text-walnut/70">
            {product.line} · {product.category === "mix" ? "Signature Blend" : product.category}
          </p>
          <h3 className="text-serif text-xl font-bold tracking-tight text-chocolate">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-chocolate/60">
            {product.shortDescription}
          </p>
          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              <p className="text-[0.65rem] text-chocolate/50">From</p>
              <p className="font-display text-lg font-semibold tabular-nums text-chocolate">
                {formatINR(firstVariant.price)}
                <span className="ml-1.5 font-body text-xs font-normal text-chocolate/50">
                  / {firstVariant.label}
                </span>
              </p>
            </div>
            <motion.button
              ref={addRef}
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                addItem(product.id, firstVariant.id);
                if (addRef.current) flyToCart(addRef.current);
              }}
              aria-label={`Add ${product.name} (${firstVariant.label}) to cart`}
              className="relative z-20 grid size-11 cursor-pointer place-items-center rounded-full bg-forest text-parchment transition-all duration-400 ease-(--ease-out-expo) hover:bg-terracotta hover:text-parchment"
            >
              <Plus className="size-4.5" strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
