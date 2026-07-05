import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { TextReveal } from "@/components/shared/text-reveal";
import { Counter } from "@/components/shared/counter";
import { stats, brand } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Story — A Family Factory Since 1998",
  description:
    "From a single roasting drum in a Lucknow gali to India's most premium dry fruit experience — the Appu Kaju story, told honestly.",
  alternates: { canonical: "/about" },
};

const TIMELINE = [
  {
    year: "1998",
    title: "One drum, one counter",
    text: "Appu Kaju opens as a single-room roasting unit with a shop counter facing the street. The first week's entire stock: 60 kg of Konkan cashews.",
  },
  {
    year: "2004",
    title: "The grading table",
    text: "We install daylight lamps and start hand-grading every kernel — the practice that still defines us. 'W180' and 'W240' enter the family vocabulary.",
  },
  {
    year: "2009",
    title: "Kuber is born",
    text: "Lucknow's sweet shops start buying in bulk for kaju katli. The 10 kg trade pack gets a name, and half the city's festival sweets quietly begin here.",
  },
  {
    year: "2014",
    title: "Beyond cashews",
    text: "Kashmiri almonds and walnuts join the shelves — sourced the same way, at the orchard, from families we still buy from today.",
  },
  {
    year: "2019",
    title: "The second generation",
    text: "The founders' children join full-time and argue for two years about the Premium Mix ratio. The argument was worth it.",
  },
  {
    year: "2024",
    title: "India-wide, factory-direct",
    text: "Online orders now reach every metro in 2–4 days — packed by the same hands, from the same small batches, at the same factory.",
  },
];

const VALUES = [
  {
    title: "Freshness is a fact",
    text: "Every pack carries its batch date. If a seller can't tell you when it was packed, you have your answer.",
  },
  {
    title: "Small batches only",
    text: "Our roaster holds 40 kg. Suppliers keep offering us machines that do a tonne an hour. We keep saying no.",
  },
  {
    title: "Buy at the source",
    text: "Our graders travel to every origin at harvest. Middlemen average things out; averages are the enemy of premium.",
  },
  {
    title: "Answer the phone",
    text: "A human picks up. Usually a family member. That's been the returns policy, the FAQ and the CRM since 1998.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`Our story · Since ${brand.foundedYear}`}
        title="A family that tastes every batch."
        lede="Appu Kaju began as a single roasting drum in a Lucknow gali and grew one returning customer at a time. This is how — and why we still do it the slow way."
      />

      {/* Statement */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="noise rounded-[2.5rem] bg-chocolate px-6 py-20 text-center md:py-28">
          <TextReveal
            as="p"
            className="text-display mx-auto max-w-4xl text-[clamp(1.8rem,4vw,3.4rem)] text-cream"
          >
            We never wanted to be the biggest dry fruit brand in India. We wanted
            to be the one your family argues about finishing first.
          </TextReveal>
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl font-semibold text-gold">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1.5 text-xs text-cream/55">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-5 pb-28 md:px-10" aria-label="Company timeline">
        <div className="relative border-l border-gold/30 pl-10 md:pl-16">
          {TIMELINE.map((item, i) => (
            <Reveal key={item.year} delay={Math.min(i * 0.05, 0.2)} className="relative pb-14 last:pb-0">
              <span
                aria-hidden
                className="absolute top-1.5 -left-10 grid size-4 -translate-x-1/2 place-items-center md:-left-16"
              >
                <span className="size-2.5 rounded-full bg-gold shadow-glow-gold" />
              </span>
              <p className="font-display text-3xl font-semibold text-gold md:text-4xl">{item.year}</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-chocolate">{item.title}</h2>
              <p className="mt-2 max-w-xl leading-relaxed text-chocolate/65">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={(i % 2) * 0.08}>
              <article className="h-full rounded-[2rem] bg-cashew p-9 shadow-soft">
                <p className="font-display text-4xl font-semibold text-gold/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-chocolate">
                  {value.title}
                </h2>
                <p className="mt-3 leading-relaxed text-chocolate/65">{value.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 text-center">
          <Button asChild variant="dark" size="lg">
            <Link href="/our-farms">See where it all grows</Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
