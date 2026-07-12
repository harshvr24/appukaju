"use client";

import { useEffect, useRef } from "react";
import { ensureGsap } from "@/lib/animation/gsap-config";
import { SectionHeading } from "@/components/shared/section-heading";

const STEPS = [
  {
    n: "01",
    title: "The harvest visit",
    text: "Our graders travel to every origin at harvest and buy at the source. If we wouldn't serve it at home, it doesn't get on the truck.",
    stat: "5 origins, visited every season",
  },
  {
    n: "02",
    title: "Hand grading",
    text: "Under daylight lamps, kernel by kernel. Machines sort by size; only hands and eyes sort by honesty — colour, wholeness, sheen.",
    stat: "100% hand-sorted, zero splits in gift grades",
  },
  {
    n: "03",
    title: "The 40 kg roast",
    text: "Anwar bhai has run our drum for 22 years. He roasts by sound — the rattle a cashew makes when it's exactly done. Twice a week, never more.",
    stat: "40 kg max per batch, small enough to listen",
  },
  {
    n: "04",
    title: "Sealed within hours",
    text: "From drum to food-grade liner to rigid box on the same day. Every pack carries its batch date, because freshness is a fact, not a slogan.",
    stat: "24 hrs from order to dispatch",
  },
];

export function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current!;
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden py-28 lg:h-screen lg:py-0">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:flex lg:h-full lg:flex-col lg:justify-center">
        <SectionHeading
          eyebrow="№ 3 — Manufacturing & quality"
          title="Slow by choice, small by design."
          className="mb-14 lg:mb-16"
        />

        <div
          ref={trackRef}
          className="flex flex-col gap-6 will-change-transform lg:w-max lg:flex-row lg:gap-8 lg:pr-[40vw]"
        >
          {STEPS.map((step) => (
            <article
              key={step.n}
              className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-forest/15 bg-paper p-8 text-chocolate shadow-soft transition-shadow duration-700 hover:shadow-lift md:p-12 lg:h-[52vh] lg:w-[34rem] lg:shrink-0"
            >
              <div>
                <span className="text-serif text-6xl font-bold text-terracotta/30 transition-colors duration-700 group-hover:text-terracotta md:text-8xl">
                  {step.n}
                </span>
                <h3 className="text-serif mt-4 text-2xl font-bold text-forest md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-chocolate/65 md:text-base">
                  {step.text}
                </p>
              </div>
              <p className="mt-8 border-t border-forest/15 pt-5 text-xs tracking-wide text-terracotta md:text-sm">
                {step.stat}
              </p>
              <div
                aria-hidden
                className="absolute -right-16 -bottom-16 size-48 rounded-full bg-terracotta/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100 lg:opacity-0"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
