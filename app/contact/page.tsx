import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { brand } from "@/lib/data/brand";

export const metadata: Metadata = {
  title: "Contact — A Human Answers",
  description:
    "Call, WhatsApp or write to Appu Kaju in Lucknow. A family member — not a bot — replies within a working day.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    icon: Phone,
    label: "Call us",
    value: brand.phone,
    href: brand.phoneHref,
    note: "10 am – 8 pm, Mon–Sat",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Quick response, 24/7",
    href: brand.whatsappHref,
    note: "Orders, tracking, bulk quotes",
  },
  {
    icon: Mail,
    label: "Email",
    value: brand.email,
    href: brand.emailHref,
    note: "Replies within a working day",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="A human answers."
        lede="Usually a family member. That's been the customer-service department since 1998 — and it's not changing."
      />

      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {CHANNELS.map((ch, i) => (
              <Reveal key={ch.label} delay={i * 0.07}>
                <a
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-5 rounded-[1.75rem] bg-cashew p-6 shadow-soft transition-all duration-500 hover:shadow-lift"
                >
                  <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold transition-colors duration-400 group-hover:bg-gold group-hover:text-cocoa">
                    <ch.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-xs font-medium tracking-wide text-chocolate/50 uppercase">
                      {ch.label}
                    </span>
                    <span className="block font-display text-lg font-semibold text-chocolate">
                      {ch.value}
                    </span>
                    <span className="block text-xs text-chocolate/50">{ch.note}</span>
                  </span>
                </a>
              </Reveal>
            ))}

            <Reveal delay={0.25}>
              <div className="rounded-[1.75rem] border border-chocolate/10 p-6">
                <p className="flex items-center gap-3 font-display text-lg font-semibold text-chocolate">
                  <MapPin className="size-5 text-gold" /> The factory shop
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-chocolate/65">
                  {brand.city}, {brand.state}, India. Open since {brand.foundedYear}. Call ahead and
                  we&apos;ll set aside a fresh batch before you arrive.
                </p>
                <p className="mt-3 flex items-center gap-2 text-xs text-chocolate/50">
                  <Clock className="size-3.5" /> Mon–Sat, 10 am – 8 pm
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-cashew p-8 shadow-soft md:p-10">
              <h2 className="mb-8 font-display text-2xl font-semibold text-chocolate">
                Or write to us
              </h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
