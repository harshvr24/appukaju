"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { products } from "@/lib/data/products";
import type { ProductCategory } from "@/types";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";
import { ProductCard } from "./product-card";

const FILTERS: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "cashew", label: "Cashews" },
  { id: "almond", label: "Almonds" },
  { id: "walnut", label: "Walnuts" },
  { id: "pistachio", label: "Pistachios" },
  { id: "raisin", label: "Raisins" },
  { id: "dates", label: "Dates" },
  { id: "mix", label: "Signature Mix" },
  { id: "gifting", label: "Gifting" },
];

export function ProductsGallery({ initialCategory }: { initialCategory?: string }) {
  const [filter, setFilter] = useState<ProductCategory | "all">(
    FILTERS.some((f) => f.id === initialCategory)
      ? (initialCategory as ProductCategory)
      : "all"
  );

  const visible = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <div>
      {/* Animated filter rail */}
      <div
        role="tablist"
        aria-label="Filter products by category"
        className="-mx-5 mb-12 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0"
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "relative shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-300",
                active ? "text-cream" : "text-chocolate/60 hover:text-chocolate"
              )}
            >
              {active && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-chocolate"
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Gallery */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="py-20 text-center text-chocolate/55">
          Nothing in this shelf yet — check back after the next batch.
        </p>
      )}
    </div>
  );
}
