"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, PackageCheck, Truck, Home } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { brand } from "@/lib/data/brand";
import { EASE_OUT_EXPO, EASE_SPRING } from "@/lib/animation/easings";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/shared/product-visual";

interface StoredOrder {
  id: string;
  placedAt: string;
  customer: { fullName: string; city: string; pincode: string };
  payMethod: string;
  items: {
    name: string;
    variant: string;
    quantity: number;
    price: number;
    image: string;
    accent: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

/** Deterministic burst so SSR/CSR (and re-renders) agree. */
const BURST = Array.from({ length: 26 }, (_, i) => {
  const angle = (i / 26) * Math.PI * 2;
  const dist = 90 + ((i * 37) % 70);
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 30,
    size: 4 + ((i * 13) % 6),
    delay: (i % 9) * 0.03,
  };
});

export default function ConfirmationPage() {
  const [order, setOrder] = useState<StoredOrder | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("appu-last-order");
      setOrder(raw ? (JSON.parse(raw) as StoredOrder) : null);
    } catch {
      setOrder(null);
    }
  }, []);

  if (order === undefined) return <div className="min-h-[70vh]" />;

  if (order === null) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 pt-32 pb-20 text-center">
        <div>
          <h1 className="text-display text-4xl text-chocolate">No recent order found</h1>
          <p className="mt-4 text-chocolate/60">Fresh batches are waiting, though.</p>
          <Button asChild variant="dark" className="mt-8">
            <Link href="/products">Browse the collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-36 pb-24 text-center md:px-10">
      {/* Gold burst + check */}
      <div className="relative mx-auto mb-10 size-24">
        {BURST.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute top-1/2 left-1/2 rounded-full bg-terracotta"
            style={{ width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.35 + p.delay, ease: "easeOut" }}
          />
        ))}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: EASE_SPRING, delay: 0.15 }}
          className="grid size-24 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-bright shadow-glow-gold"
        >
          <Check className="size-10 text-cocoa" strokeWidth={2.5} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.4 }}
      >
        <p className="eyebrow text-walnut">Order {order.id}</p>
        <h1 className="text-display mt-4 text-[clamp(2.4rem,6vw,4.2rem)] text-chocolate">
          Shukriya, {order.customer.fullName.split(" ")[0]}.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-chocolate/65">
          Your order is with the packing team. A fresh batch gets sealed, boxed
          and dispatched from {brand.city} within 24 working hours.
        </p>
      </motion.div>

      {/* Timeline */}
      <motion.ol
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.55 }}
        className="mx-auto mt-12 flex max-w-lg items-start justify-between gap-2 text-left"
      >
        {[
          { icon: PackageCheck, label: "Packed fresh", sub: "within 24 hrs" },
          { icon: Truck, label: "Dispatched", sub: "tracking by SMS" },
          { icon: Home, label: "Delivered", sub: `to ${order.customer.city}` },
        ].map((s, i) => (
          <li key={s.label} className="flex flex-1 flex-col items-center gap-2 text-center">
            <span
              className={`grid size-12 place-items-center rounded-full ${i === 0 ? "bg-terracotta text-parchment" : "bg-chocolate/6 text-chocolate/50"}`}
            >
              <s.icon className="size-5" strokeWidth={1.75} />
            </span>
            <span className="text-xs font-semibold text-chocolate">{s.label}</span>
            <span className="text-[0.65rem] text-chocolate/50">{s.sub}</span>
          </li>
        ))}
      </motion.ol>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.7 }}
        className="mt-12 rounded-[2rem] bg-cashew p-7 text-left shadow-soft"
      >
        <ul className="divide-y divide-chocolate/8">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-4 py-4">
              <ProductVisual src={item.image} alt="" accent={item.accent} className="size-14 shrink-0 rounded-xl" sizes="56px" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-chocolate">{item.name}</p>
                <p className="text-xs text-chocolate/55">
                  {item.variant} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-chocolate">
                {formatINR(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-chocolate/10 pt-4 font-display text-lg font-semibold text-chocolate">
          <span>Total {order.payMethod === "cod" ? "(pay on delivery)" : "paid"}</span>
          <span className="tabular-nums">{formatINR(order.total)}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        <Button asChild variant="dark" size="lg">
          <Link href="/products">Keep exploring</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/recipes">Try a recipe while you wait</Link>
        </Button>
      </motion.div>
    </div>
  );
}
