"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { wholesaleSchema, type WholesaleInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FieldWrap, TextInput, TextArea } from "@/components/ui/field";

const VOLUMES = [
  { id: "10-25", label: "10–25 kg / month" },
  { id: "25-100", label: "25–100 kg / month" },
  { id: "100-500", label: "100–500 kg / month" },
  { id: "500+", label: "500+ kg / month" },
] as const;

export function WholesaleForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WholesaleInput>({
    resolver: zodResolver(wholesaleSchema),
    defaultValues: { monthlyVolume: "25-100" },
    mode: "onTouched",
  });
  const volume = watch("monthlyVolume");

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2rem] bg-pistachio/25 p-10 text-center"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-forest text-cream">
          <Check className="size-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-forest">
          Enquiry received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-forest/80">
          A family member will call you within one working day with factory-direct
          rates for your volume. (Demo site: the enquiry is not actually sent.)
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(() => setSent(true))} noValidate className="grid gap-5 sm:grid-cols-2">
      <FieldWrap label="Business name" htmlFor="business" error={errors.business?.message}>
        <TextInput id="business" placeholder="Sharma Sweets & Sons" {...register("business")} />
      </FieldWrap>
      <FieldWrap label="Contact person" htmlFor="contactName" error={errors.contactName?.message}>
        <TextInput id="contactName" autoComplete="name" placeholder="Rohit Sharma" {...register("contactName")} />
      </FieldWrap>
      <FieldWrap label="Email" htmlFor="w-email" error={errors.email?.message}>
        <TextInput id="w-email" type="email" autoComplete="email" placeholder="orders@example.com" {...register("email")} />
      </FieldWrap>
      <FieldWrap label="Mobile number" htmlFor="w-phone" error={errors.phone?.message}>
        <TextInput id="w-phone" type="tel" inputMode="numeric" placeholder="98XXXXXXXX" {...register("phone")} />
      </FieldWrap>
      <FieldWrap label="City" htmlFor="w-city" error={errors.city?.message} className="sm:col-span-2">
        <TextInput id="w-city" placeholder="Lucknow" {...register("city")} />
      </FieldWrap>

      <fieldset className="sm:col-span-2">
        <legend className="mb-3 block text-xs font-medium tracking-wide text-chocolate/70">
          Expected monthly volume
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {VOLUMES.map((v) => {
            const active = volume === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setValue("monthlyVolume", v.id)}
                aria-pressed={active}
                className={cn(
                  "cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  active
                    ? "border-chocolate bg-chocolate text-cream"
                    : "border-chocolate/15 text-chocolate/65 hover:border-chocolate/40"
                )}
              >
                {v.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <FieldWrap label="Anything else? (optional)" htmlFor="w-message" error={errors.message?.message} className="sm:col-span-2">
        <TextArea id="w-message" placeholder="Products you're interested in, delivery frequency, current supplier headaches…" {...register("message")} />
      </FieldWrap>

      <div className="sm:col-span-2">
        <Button type="submit" variant="dark" size="lg">
          Request factory-direct rates
        </Button>
      </div>
    </form>
  );
}
