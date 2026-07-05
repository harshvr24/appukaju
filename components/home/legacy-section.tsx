import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/shared/text-reveal";
import { Reveal } from "@/components/shared/reveal";
import { Counter } from "@/components/shared/counter";
import { stats } from "@/lib/data/brand";

export function LegacySection() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <p className="eyebrow mb-8 text-walnut">Our Story · Since 1998</p>
      </Reveal>

      <TextReveal
        as="h2"
        className="text-display max-w-5xl text-[clamp(1.9rem,4.2vw,3.8rem)] text-chocolate"
      >
        We started as a single roasting drum in a Lucknow gali. Twenty-eight
        years later, we are still a family that tastes every batch before it
        leaves the factory.
      </TextReveal>

      <Reveal delay={0.2} className="mt-10">
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 text-sm font-medium text-walnut transition-colors hover:text-chocolate"
        >
          Read the full story
          <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>

      <div className="mt-20 grid grid-cols-2 gap-10 border-t border-chocolate/10 pt-14 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <p className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold tracking-tight text-chocolate">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm text-chocolate/55">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
