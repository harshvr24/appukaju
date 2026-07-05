"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Lock, Truck, Zap, Wallet, CreditCard, Banknote } from "lucide-react";
import { checkoutSchema, type CheckoutInput } from "@/lib/schemas";
import { useCart, useCartTotals, cartLineDetails } from "@/lib/stores/cart";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatINR, cn } from "@/lib/utils";
import { brand } from "@/lib/data/brand";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";
import { Button } from "@/components/ui/button";
import { FieldWrap, TextInput, TextArea } from "@/components/ui/field";
import { ProductVisual } from "@/components/shared/product-visual";

const STEPS = ["Address", "Delivery", "Payment"] as const;

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const { subtotal } = useCartTotals();
  const mounted = useMounted();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "cod">("upi");
  const [placing, setPlacing] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { delivery: "standard" },
    mode: "onTouched",
  });

  const delivery = watch("delivery");
  const shippingFee =
    delivery === "express" ? 99 : subtotal >= brand.freeShippingThreshold ? 0 : 49;
  const total = subtotal + shippingFee;

  if (mounted && items.length === 0 && !placing) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 pt-32 pb-20 text-center">
        <div>
          <h1 className="text-display text-4xl text-chocolate">Your cart is empty</h1>
          <p className="mt-4 text-chocolate/60">
            The checkout works better with something delicious in it.
          </p>
          <Button asChild variant="dark" className="mt-8">
            <Link href="/products">Browse the collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  const goToStep = async (target: number) => {
    if (target === 1) {
      const ok = await trigger(["fullName", "email", "phone", "address", "city", "state", "pincode"]);
      if (!ok) return;
    }
    setStep(target);
  };

  const placeOrder = handleSubmit((data) => {
    setPlacing(true);
    const order = {
      id: `AK-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      placedAt: new Date().toISOString(),
      customer: data,
      payMethod,
      items: items
        .map((item) => {
          const detail = cartLineDetails(item);
          return detail
            ? {
                name: detail.product.name,
                variant: detail.variant.label,
                quantity: item.quantity,
                price: detail.variant.price,
                image: detail.product.image,
                accent: detail.product.accent,
              }
            : null;
        })
        .filter(Boolean),
      subtotal,
      shippingFee,
      total,
    };
    sessionStorage.setItem("appu-last-order", JSON.stringify(order));
    clear();
    router.push("/checkout/confirmation");
  });

  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 md:px-10">
      <header className="mb-12">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-chocolate/55 transition-colors hover:text-chocolate"
        >
          <ChevronLeft className="size-4" /> Continue shopping
        </Link>
        <h1 className="text-display text-[clamp(2.2rem,5vw,3.6rem)] text-chocolate">Checkout</h1>
        {/* Step indicator */}
        <ol className="mt-8 flex items-center gap-2" aria-label="Checkout progress">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium transition-all duration-400",
                  i === step
                    ? "bg-chocolate text-cream"
                    : i < step
                      ? "cursor-pointer bg-gold/20 text-walnut"
                      : "bg-chocolate/5 text-chocolate/40"
                )}
                aria-current={i === step ? "step" : undefined}
              >
                <span className="tabular-nums">{i + 1}</span> {label}
              </button>
              {i < STEPS.length - 1 && <span aria-hidden className="h-px w-6 bg-chocolate/15" />}
            </li>
          ))}
        </ol>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={placeOrder} noValidate>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.fieldset
                key="address"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } }}
                exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
              >
                <legend className="sr-only">Contact and delivery address</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FieldWrap label="Full name" htmlFor="fullName" error={errors.fullName?.message} className="sm:col-span-2">
                    <TextInput id="fullName" autoComplete="name" placeholder="Asha Verma" {...register("fullName")} />
                  </FieldWrap>
                  <FieldWrap label="Email" htmlFor="email" error={errors.email?.message}>
                    <TextInput id="email" type="email" autoComplete="email" placeholder="asha@example.com" {...register("email")} />
                  </FieldWrap>
                  <FieldWrap label="Mobile number" htmlFor="phone" error={errors.phone?.message}>
                    <TextInput id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98XXXXXXXX" {...register("phone")} />
                  </FieldWrap>
                  <FieldWrap label="Street address" htmlFor="address" error={errors.address?.message} className="sm:col-span-2">
                    <TextInput id="address" autoComplete="street-address" placeholder="House, street, landmark" {...register("address")} />
                  </FieldWrap>
                  <FieldWrap label="City" htmlFor="city" error={errors.city?.message}>
                    <TextInput id="city" autoComplete="address-level2" placeholder="Lucknow" {...register("city")} />
                  </FieldWrap>
                  <div className="grid grid-cols-2 gap-5">
                    <FieldWrap label="State" htmlFor="state" error={errors.state?.message}>
                      <TextInput id="state" autoComplete="address-level1" placeholder="UP" {...register("state")} />
                    </FieldWrap>
                    <FieldWrap label="PIN code" htmlFor="pincode" error={errors.pincode?.message}>
                      <TextInput id="pincode" inputMode="numeric" autoComplete="postal-code" placeholder="226001" {...register("pincode")} />
                    </FieldWrap>
                  </div>
                </div>
                <Button type="button" variant="dark" size="lg" className="mt-9" onClick={() => goToStep(1)}>
                  Continue to delivery
                </Button>
              </motion.fieldset>
            )}

            {step === 1 && (
              <motion.fieldset
                key="delivery"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } }}
                exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
              >
                <legend className="sr-only">Delivery speed</legend>
                <div className="space-y-4">
                  {(
                    [
                      {
                        id: "standard",
                        icon: Truck,
                        title: "Standard",
                        desc: "2–4 days to metros, 4–6 elsewhere",
                        fee: subtotal >= brand.freeShippingThreshold ? 0 : 49,
                      },
                      {
                        id: "express",
                        icon: Zap,
                        title: "Express",
                        desc: "Priority dispatch, 1–2 days to metros",
                        fee: 99,
                      },
                    ] as const
                  ).map((opt) => {
                    const active = delivery === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-5 rounded-3xl border p-6 transition-all duration-400 ease-(--ease-out-expo)",
                          active ? "border-gold bg-gold/8 shadow-soft" : "border-chocolate/12 hover:border-chocolate/30"
                        )}
                      >
                        <input
                          type="radio"
                          value={opt.id}
                          checked={active}
                          onChange={() => setValue("delivery", opt.id)}
                          className="sr-only"
                          name="delivery"
                        />
                        <span className={cn("grid size-12 place-items-center rounded-2xl", active ? "bg-gold text-cocoa" : "bg-chocolate/6 text-chocolate/60")}>
                          <opt.icon className="size-5" strokeWidth={1.75} />
                        </span>
                        <span className="flex-1">
                          <span className="block font-display text-lg font-semibold text-chocolate">{opt.title}</span>
                          <span className="block text-sm text-chocolate/55">{opt.desc}</span>
                        </span>
                        <span className="font-semibold tabular-nums text-chocolate">
                          {opt.fee === 0 ? "Free" : formatINR(opt.fee)}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <FieldWrap label="Gift note (optional)" htmlFor="giftNote" error={errors.giftNote?.message} className="mt-7">
                  <TextArea id="giftNote" placeholder="We letterpress this onto a card — three lines that outlast the cashews." {...register("giftNote")} />
                </FieldWrap>
                <div className="mt-9 flex gap-3">
                  <Button type="button" variant="ghost" size="lg" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <Button type="button" variant="dark" size="lg" onClick={() => goToStep(2)}>
                    Continue to payment
                  </Button>
                </div>
              </motion.fieldset>
            )}

            {step === 2 && (
              <motion.fieldset
                key="payment"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } }}
                exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
              >
                <legend className="sr-only">Payment method</legend>
                <div className="space-y-4">
                  {(
                    [
                      { id: "upi", icon: Wallet, title: "UPI", desc: "GPay, PhonePe, Paytm" },
                      { id: "card", icon: CreditCard, title: "Card", desc: "Credit or debit, all networks" },
                      { id: "cod", icon: Banknote, title: "Cash on delivery", desc: "Pay when the box arrives" },
                    ] as const
                  ).map((opt) => {
                    const active = payMethod === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-5 rounded-3xl border p-6 transition-all duration-400 ease-(--ease-out-expo)",
                          active ? "border-gold bg-gold/8 shadow-soft" : "border-chocolate/12 hover:border-chocolate/30"
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={active}
                          onChange={() => setPayMethod(opt.id)}
                          className="sr-only"
                        />
                        <span className={cn("grid size-12 place-items-center rounded-2xl", active ? "bg-gold text-cocoa" : "bg-chocolate/6 text-chocolate/60")}>
                          <opt.icon className="size-5" strokeWidth={1.75} />
                        </span>
                        <span className="flex-1">
                          <span className="block font-display text-lg font-semibold text-chocolate">{opt.title}</span>
                          <span className="block text-sm text-chocolate/55">{opt.desc}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-6 flex items-center gap-2 rounded-2xl bg-pistachio/20 px-5 py-3.5 text-xs text-forest">
                  <Lock className="size-3.5 shrink-0" />
                  Demo checkout — no payment is processed and no money moves. Razorpay slots in here for production.
                </p>
                <div className="mt-9 flex gap-3">
                  <Button type="button" variant="ghost" size="lg" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" size="lg" disabled={placing} className="min-w-56">
                    {placing ? "Placing order…" : `Place order · ${formatINR(total)}`}
                  </Button>
                </div>
              </motion.fieldset>
            )}
          </AnimatePresence>
        </form>

        {/* ── Order summary ────────────────────────────── */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] bg-cashew p-7 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-chocolate">Order summary</h2>
            <ul className="mt-5 divide-y divide-chocolate/8">
              {items.map((item) => {
                const detail = cartLineDetails(item);
                if (!detail) return null;
                return (
                  <li key={`${item.productId}:${item.variantId}`} className="flex items-center gap-4 py-4">
                    <ProductVisual
                      src={detail.product.image}
                      alt=""
                      accent={detail.product.accent}
                      className="size-14 shrink-0 rounded-xl"
                      sizes="56px"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-chocolate">{detail.product.name}</p>
                      <p className="text-xs text-chocolate/55">
                        {detail.variant.label} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-chocolate">
                      {formatINR(detail.variant.price * item.quantity)}
                    </p>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-2.5 border-t border-chocolate/10 pt-5 text-sm">
              <div className="flex justify-between text-chocolate/65">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-chocolate/65">
                <dt>Shipping</dt>
                <dd className="tabular-nums">{shippingFee === 0 ? "Free" : formatINR(shippingFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-chocolate/10 pt-3 font-display text-lg font-semibold text-chocolate">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatINR(total)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[0.68rem] leading-relaxed text-chocolate/45">
              Taxes included. Packed fresh in {brand.city} and dispatched within 24 hours.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
