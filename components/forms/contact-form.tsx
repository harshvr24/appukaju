"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { FieldWrap, TextInput, TextArea } from "@/components/ui/field";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), mode: "onTouched" });

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
          Message received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-forest/80">
          We reply within a working day — usually much faster. (Demo site: the
          message is not actually sent.)
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(() => setSent(true))} noValidate className="grid gap-5 sm:grid-cols-2">
      <FieldWrap label="Your name" htmlFor="c-name" error={errors.name?.message}>
        <TextInput id="c-name" autoComplete="name" placeholder="Asha Verma" {...register("name")} />
      </FieldWrap>
      <FieldWrap label="Email" htmlFor="c-email" error={errors.email?.message}>
        <TextInput id="c-email" type="email" autoComplete="email" placeholder="asha@example.com" {...register("email")} />
      </FieldWrap>
      <FieldWrap label="Phone (optional)" htmlFor="c-phone" error={errors.phone?.message}>
        <TextInput id="c-phone" type="tel" autoComplete="tel" placeholder="+91…" {...register("phone")} />
      </FieldWrap>
      <FieldWrap label="Subject" htmlFor="c-subject" error={errors.subject?.message}>
        <TextInput id="c-subject" placeholder="Order help, gifting, feedback…" {...register("subject")} />
      </FieldWrap>
      <FieldWrap label="Message" htmlFor="c-message" error={errors.message?.message} className="sm:col-span-2">
        <TextArea id="c-message" rows={5} placeholder="Tell us everything." {...register("message")} />
      </FieldWrap>
      <div className="sm:col-span-2">
        <Button type="submit" variant="dark" size="lg">
          Send message
        </Button>
      </div>
    </form>
  );
}
