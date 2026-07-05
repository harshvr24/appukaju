import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { TextReveal } from "@/components/shared/text-reveal";
import { AmbientParticles } from "@/components/shared/ambient-particles";
import { Magnetic } from "@/components/shared/magnetic";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10 md:pb-36">
      <div className="noise relative overflow-hidden rounded-[2.5rem] border border-gold/25 bg-gradient-to-br from-white via-paper to-sunshine-soft px-6 py-24 text-center md:py-32">
        <AmbientParticles count={18} color="rgb(224 158 0 / 0.55)" />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sunshine/15 blur-[120px]"
        />
        <div className="relative">
          <Reveal>
            <p className="eyebrow mb-6 text-sunshine-deep">Why choose Appu Kaju</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="text-display mx-auto max-w-3xl text-[clamp(2.2rem,5.5vw,4.5rem)] text-chocolate"
          >
            Twenty-eight years of never shipping a batch we would not serve at home.
          </TextReveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-base text-chocolate/60 md:text-lg">
              Freshness you can date-check. Grades you can read. A phone number a
              human actually answers.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Button asChild size="lg" className="bg-sunshine text-cocoa hover:bg-sunshine-deep">
                <Link href="/products">Experience premium nutrition</Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline" size="lg" className="text-chocolate">
                <Link href="/corporate-gifting">Corporate gifting</Link>
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
