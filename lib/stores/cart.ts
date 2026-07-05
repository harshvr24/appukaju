"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { getVariant } from "@/lib/data/products";

interface CartState {
  items: CartItem[];
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  clear: () => void;
}

const keyOf = (i: { productId: string; variantId: string }) =>
  `${i.productId}:${i.variantId}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId, variantId, quantity = 1) =>
        set((state) => {
          const key = keyOf({ productId, variantId });
          const existing = state.items.find((i) => keyOf(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                keyOf(i) === key
                  ? { ...i, quantity: Math.min(i.quantity + quantity, 20) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { productId, variantId, quantity }] };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => keyOf(i) !== keyOf({ productId, variantId })
          ),
        })),
      setQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => keyOf(i) !== keyOf({ productId, variantId })
                )
              : state.items.map((i) =>
                  keyOf(i) === keyOf({ productId, variantId })
                    ? { ...i, quantity: Math.min(quantity, 20) }
                    : i
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "appu-cart" }
  )
);

export function cartLineDetails(item: CartItem) {
  return getVariant(item.productId, item.variantId);
}

export function useCartTotals() {
  const items = useCart((s) => s.items);
  let count = 0;
  let subtotal = 0;
  for (const item of items) {
    const detail = cartLineDetails(item);
    if (!detail) continue;
    count += item.quantity;
    subtotal += detail.variant.price * item.quantity;
  }
  return { count, subtotal };
}
