import type { Metadata } from "next";
import Link from "next/link";
import { Gift, PenLine, Boxes, Sparkles } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { TextReveal } from "@/components/shared/text-reveal";
import { products } from "@/lib/data/products";
import { brand } from "@/lib/data/brand";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { AmbientParticles } from "@/components/shared/ambient-particles";

export const metadata: Metadata = {
  title: "Corporate Gifting — Boxes People Keep",
  description:
    "Custom dry fruit hampers for Diwali, weddings and corporate milestones. Cloth-lined keepsake boxes, letterpress notes, packed to order in Lucknow.",
  alternates: { canonical: "/corporate-gifting" },
};

const PILLARS = [
  {
    icon: Gift,
    title: "Packed to order",
    text: "Hampers are assembled the week they ship — never pre-packed in August for a November festival.",
  },
  {
    icon: PenLine,
    title: "Letterpress notes",
    text: "Your message, pressed into cotton card. Three lines that outlast the cashews.",
  },
  {
    icon: Boxes,
    title: "From 10 boxes",
    text: "Custom sleeves, logo embossing and box sizes from a 10-box team gift to a 5,000-box Diwali run.",
  },
  {
    icon: Sparkles,
    title: "Reserve grades only",
    text: "Gift boxes carry W180 Rimmee and reserve lines exclusively. Uniform, whole, ivory — every kernel.",
  },
];

export default function CorporateGiftingPage() {
  const hamper = products.find((p) => p.category === "gifting");
  const giftables = products.filter((p) => p.featured && p.category !== "gifting").slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Corporate & wedding gifting"
        title="Give the box they keep."
        lede="Every Diwali, a crore of dry fruit boxes change hands in India — and most are forgotten by New Year. Ours get mentioned at the next family gathering. That's the entire brief."
      />

      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={(i % 4) * 0.07}>
              <article className="h-full rounded-[1.75rem] bg-cashew p-7 shadow-soft">
                <span className="grid size-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                  <pillar.icon className="size-5" strokeWidth={1.75} />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold text-chocolate">
                  {pillar.title}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-chocolate/65">{pillar.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {hamper && (
        <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
          <div className="noise relative overflow-hidden rounded-[2.5rem] bg-chocolate p-8 md:p-14">
            <AmbientParticles count={14} />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow mb-4 text-gold">The flagship</p>
                <TextReveal as="h2" className="text-display text-[clamp(2rem,4.5vw,3.6rem)] text-cream">
                  The Utsav Hamper
                </TextReveal>
                <p className="mt-5 max-w-lg leading-relaxed text-cream/65">
                  {hamper.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href={`/products/${hamper.slug}`}>Configure a hamper</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-cream">
                    <Link href="/wholesale">Bulk enquiry</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-md">
                <ProductCard product={hamper} size="tall" />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <Reveal>
          <h2 className="text-display mb-10 text-[clamp(1.8rem,4vw,3rem)] text-chocolate">
            Or build your own.
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {giftables.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <Reveal className="mt-14 rounded-[2rem] bg-gold/10 p-8 text-center md:p-10">
          <p className="font-display text-xl font-semibold text-chocolate md:text-2xl">
            Planning something bigger?
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-chocolate/65">
            For weddings and corporate runs, call {brand.phone} or drop a line —
            a family member (not a bot) replies within a working day.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="dark">
              <a href={brand.phoneHref}>Call us</a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">Write to us</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
