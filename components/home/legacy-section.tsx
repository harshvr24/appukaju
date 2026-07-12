import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/shared/text-reveal";
import { Reveal } from "@/components/shared/reveal";
import { Counter } from "@/components/shared/counter";
import { stats } from "@/lib/data/brand";

/** Editorial opening spread — a magazine essay, not a hero banner. */
export function LegacySection() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <div className="flex items-center gap-6">
          <p className="index-No text-terracotta">№ 1</p>
          <hr className="rule flex-1" />
          <p className="eyebrow text-walnut">From the gali · Since 1998</p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <TextReveal
          as="h2"
          className="text-serif max-w-4xl text-[clamp(1.9rem,4.2vw,3.9rem)] text-chocolate"
        >
          We started as a single roasting drum in a Lucknow gali. Twenty-eight
          years later, we are still a family that tastes every batch before it
          leaves the factory.
        </TextReveal>

        <div>
          <Reveal delay={0.15}>
            <p className="drop-cap max-w-md text-base leading-relaxed text-chocolate/70">
              Appu bhai still opens the shutter himself. The roasting drum his
              father bought in 1998 sits where it always has, and the rule has
              never changed — if a kernel would not be served to our own
              children, it does not carry our name.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-colors hover:text-terracotta-deep"
            >
              Read the full story
              <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Stats as magazine footnotes */}
      <div className="mt-20 grid grid-cols-2 gap-10 border-t border-chocolate/10 pt-14 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <p className="text-serif text-[clamp(2.4rem,5vw,4rem)] font-bold tracking-tight text-forest">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm text-chocolate/55">
              <span className="mr-1.5 align-super text-[0.6rem] text-terracotta">
                {String(i + 1).padStart(2, "0")}
              </span>
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
