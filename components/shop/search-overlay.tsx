"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X, ArrowUpRight } from "lucide-react";
import { products } from "@/lib/data/products";
import { recipes } from "@/lib/data/recipes";
import { useUi } from "@/lib/stores/ui";
import { formatINR } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";
import { ProductVisual } from "@/components/shared/product-visual";

/** Cheap fuzzy match: every query token must appear somewhere in the haystack. */
function matches(haystack: string, query: string) {
  const h = haystack.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => h.includes(token));
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUi();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => setSearchOpen(false), [pathname, setSearchOpen]);
  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      // Wait for the enter animation before focusing.
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const productHits = useMemo(
    () =>
      query.length < 2
        ? []
        : products
            .filter((p) =>
              matches(`${p.name} ${p.category} ${p.line} ${p.shortDescription}`, query)
            )
            .slice(0, 5),
    [query]
  );
  const recipeHits = useMemo(
    () =>
      query.length < 2
        ? []
        : recipes.filter((r) => matches(`${r.title} ${r.intro}`, query)).slice(0, 3),
    [query]
  );

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          className="fixed inset-0 z-[66] flex items-start justify-center bg-cocoa/60 px-4 pt-[12vh] backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <motion.div
            initial={{ y: 32, scale: 0.98, opacity: 0 }}
            animate={{
              y: 0,
              scale: 1,
              opacity: 1,
              transition: { duration: 0.5, ease: EASE_OUT_EXPO },
            }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.2 } }}
            className="glass w-full max-w-2xl overflow-hidden rounded-3xl shadow-lift"
          >
            <div className="flex items-center gap-4 border-b border-gold/15 px-6 py-5">
              <Search className="size-5 shrink-0 text-gold" strokeWidth={1.75} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search kaju, badam, recipes…"
                aria-label="Search products and recipes"
                className="w-full bg-transparent font-body text-lg text-chocolate outline-none placeholder:text-chocolate/40"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-chocolate/5"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto" data-lenis-prevent>
              {query.length < 2 ? (
                <div className="px-6 py-8">
                  <p className="eyebrow mb-4 text-chocolate/50">Popular right now</p>
                  <div className="flex flex-wrap gap-2">
                    {["Rimmee Kaju", "Premium Mix", "Pista", "Gift Hamper", "Kaju Katli"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="cursor-pointer rounded-full border border-chocolate/15 px-4 py-1.5 text-sm text-chocolate/70 transition-colors hover:border-gold hover:text-chocolate"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : productHits.length === 0 && recipeHits.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-chocolate/55">
                  Nothing found for &ldquo;{query}&rdquo; — try &ldquo;kaju&rdquo; or &ldquo;mix&rdquo;.
                </p>
              ) : (
                <div className="px-3 py-3">
                  {productHits.length > 0 && (
                    <>
                      <p className="eyebrow px-3 pt-2 pb-1 text-chocolate/50">Products</p>
                      {productHits.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          className="flex items-center gap-4 rounded-2xl px-3 py-2.5 transition-colors hover:bg-gold/10"
                        >
                          <ProductVisual
                            src={p.image}
                            alt=""
                            accent={p.accent}
                            className="size-12 rounded-xl"
                            sizes="48px"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-chocolate">{p.name}</p>
                            <p className="truncate text-xs text-chocolate/55">{p.shortDescription}</p>
                          </div>
                          <p className="text-sm font-semibold tabular-nums text-chocolate/80">
                            {formatINR(p.variants[0].price)}
                          </p>
                        </Link>
                      ))}
                    </>
                  )}
                  {recipeHits.length > 0 && (
                    <>
                      <p className="eyebrow px-3 pt-4 pb-1 text-chocolate/50">Recipes</p>
                      {recipeHits.map((r) => (
                        <Link
                          key={r.id}
                          href={`/recipes/${r.slug}`}
                          className="flex items-center justify-between gap-4 rounded-2xl px-3 py-2.5 transition-colors hover:bg-gold/10"
                        >
                          <p className="text-sm font-medium text-chocolate">{r.title}</p>
                          <ArrowUpRight className="size-4 text-gold" />
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
