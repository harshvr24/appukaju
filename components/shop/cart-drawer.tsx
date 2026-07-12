"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCart, useCartTotals, cartLineDetails } from "@/lib/stores/cart";
import { useUi } from "@/lib/stores/ui";
import { getLenis } from "@/lib/lenis";
import { formatINR } from "@/lib/utils";
import { brand } from "@/lib/data/brand";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";
import { ProductVisual } from "@/components/shared/product-visual";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUi();
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const { count, subtotal } = useCartTotals();
  const pathname = usePathname();

  useEffect(() => setCartOpen(false), [pathname, setCartOpen]);
  useEffect(() => {
    const lenis = getLenis();
    if (cartOpen) lenis?.stop();
    else lenis?.start();
    return () => {
      lenis?.start();
    };
  }, [cartOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  const freeShippingGap = Math.max(0, brand.freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.button
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[64] cursor-pointer bg-forest-deep/50 backdrop-blur-[2px]"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "104%" }}
            animate={{ x: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } }}
            exit={{ x: "104%", transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } }}
            className="glass fixed top-2 right-2 bottom-2 z-[65] flex w-[min(28rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-3xl shadow-lift"
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-forest/15 px-6 py-5">
              <p className="font-display text-lg font-semibold text-chocolate">
                Your Cart {count > 0 && <span className="text-terracotta">({count})</span>}
              </p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="grid size-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-chocolate/5"
              >
                <X className="size-4.5" strokeWidth={1.75} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="grid size-20 place-items-center rounded-full bg-terracotta/10">
                  <ShoppingBag className="size-8 text-terracotta" strokeWidth={1.25} />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-chocolate">
                    Your cart is empty
                  </p>
                  <p className="mt-2 text-sm text-chocolate/60">
                    Fresh batches are packed twice a week — don&apos;t miss yours.
                  </p>
                </div>
                <Button asChild variant="dark">
                  <Link href="/products">Explore the collection</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Free shipping meter */}
                <div className="border-b border-forest/15 px-6 py-4">
                  {freeShippingGap > 0 ? (
                    <p className="text-xs text-chocolate/70">
                      Add <strong className="text-chocolate">{formatINR(freeShippingGap)}</strong> more for free shipping
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-forest">
                      ✓ You&apos;ve unlocked free shipping
                    </p>
                  )}
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-chocolate/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-gold-bright"
                      animate={{
                        width: `${Math.min(100, (subtotal / brand.freeShippingThreshold) * 100)}%`,
                      }}
                      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-gold/10 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const detail = cartLineDetails(item);
                      if (!detail) return null;
                      const { product, variant } = detail;
                      return (
                        <motion.li
                          key={`${item.productId}:${item.variantId}`}
                          layout
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
                          className="flex gap-4 py-5"
                        >
                          <Link
                            href={`/products/${product.slug}`}
                            className="block shrink-0"
                          >
                            <ProductVisual
                              src={product.image}
                              alt={product.name}
                              accent={product.accent}
                              className="size-20 rounded-2xl"
                              sizes="80px"
                            />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <Link
                                href={`/products/${product.slug}`}
                                className="truncate text-sm font-medium text-chocolate hover:text-walnut"
                              >
                                {product.name}
                              </Link>
                              <button
                                type="button"
                                onClick={() => removeItem(item.productId, item.variantId)}
                                aria-label={`Remove ${product.name}`}
                                className="cursor-pointer text-chocolate/35 transition-colors hover:text-red-700"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                            <p className="mt-0.5 text-xs text-chocolate/55">{variant.label}</p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center rounded-full border border-chocolate/15">
                                <button
                                  type="button"
                                  onClick={() => setQuantity(item.productId, item.variantId, item.quantity - 1)}
                                  aria-label="Decrease quantity"
                                  className="grid size-7 cursor-pointer place-items-center transition-colors hover:text-terracotta"
                                >
                                  <Minus className="size-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-semibold tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQuantity(item.productId, item.variantId, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                  className="grid size-7 cursor-pointer place-items-center transition-colors hover:text-terracotta"
                                >
                                  <Plus className="size-3" />
                                </button>
                              </div>
                              <p className="text-sm font-semibold tabular-nums text-chocolate">
                                {formatINR(variant.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <div className="space-y-4 border-t border-forest/15 px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm text-chocolate/65">Subtotal</p>
                    <p className="font-display text-xl font-semibold tabular-nums text-chocolate">
                      {formatINR(subtotal)}
                    </p>
                  </div>
                  <Button asChild variant="dark" size="lg" className="w-full">
                    <Link href="/checkout">
                      Checkout <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <p className="text-center text-[0.7rem] text-chocolate/45">
                    Taxes included · Packed fresh in {brand.city} within 24 hrs
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
