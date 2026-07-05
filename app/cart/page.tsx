"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart, useCartTotals, cartLineDetails } from "@/lib/stores/cart";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatINR } from "@/lib/utils";
import { brand } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/shared/product-visual";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const { count, subtotal } = useCartTotals();
  const mounted = useMounted();

  if (!mounted) return <div className="min-h-[70vh]" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 pt-32 pb-20 text-center">
        <div>
          <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-gold/10">
            <ShoppingBag className="size-8 text-gold" strokeWidth={1.25} />
          </div>
          <h1 className="text-display text-4xl text-chocolate">Your cart is empty</h1>
          <p className="mt-4 text-chocolate/60">
            Fresh batches are packed twice a week — don&apos;t miss yours.
          </p>
          <Button asChild variant="dark" className="mt-8">
            <Link href="/products">Explore the collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 md:px-10">
      <h1 className="text-display mb-12 text-[clamp(2.2rem,5vw,3.6rem)] text-chocolate">
        Your cart <span className="text-gold">({count})</span>
      </h1>

      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <ul className="divide-y divide-chocolate/8">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const detail = cartLineDetails(item);
              if (!detail) return null;
              const { product, variant } = detail;
              return (
                <motion.li
                  key={`${item.productId}:${item.variantId}`}
                  layout
                  exit={{ opacity: 0, x: 60, transition: { duration: 0.3 } }}
                  className="flex gap-6 py-6"
                >
                  <Link href={`/products/${product.slug}`} className="block shrink-0">
                    <ProductVisual
                      src={product.image}
                      alt={product.name}
                      accent={product.accent}
                      className="size-28 rounded-2xl md:size-32"
                      sizes="128px"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-display text-lg font-semibold text-chocolate hover:text-walnut"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-chocolate/55">{variant.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        aria-label={`Remove ${product.name}`}
                        className="cursor-pointer p-1 text-chocolate/35 transition-colors hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center rounded-full border border-chocolate/15">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.productId, item.variantId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="grid size-9 cursor-pointer place-items-center transition-colors hover:text-gold"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.productId, item.variantId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="grid size-9 cursor-pointer place-items-center transition-colors hover:text-gold"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="font-display text-lg font-semibold tabular-nums text-chocolate">
                        {formatINR(variant.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] bg-cashew p-7 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-chocolate">Summary</h2>
            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between text-chocolate/65">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-chocolate/65">
                <dt>Shipping</dt>
                <dd>{subtotal >= brand.freeShippingThreshold ? "Free" : "Calculated at checkout"}</dd>
              </div>
            </dl>
            <Button asChild variant="dark" size="lg" className="mt-7 w-full">
              <Link href="/checkout">
                Checkout <ArrowRight className="size-4" />
              </Link>
            </Button>
            <p className="mt-4 text-center text-[0.68rem] text-chocolate/45">
              Free shipping over {formatINR(brand.freeShippingThreshold)} · Packed fresh in {brand.city}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
