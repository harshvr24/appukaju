import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { ThemeZone } from "@/components/home/theme-zone";
import { CraftSection } from "@/components/home/craft-section";

export const metadata: Metadata = {
  title: "Quality Process — Slow by Choice, Small by Design",
  description:
    "Hand grading under daylight lamps, 40 kg roasts tuned by ear, batch dates on every pack. How Appu Kaju quality actually works.",
  alternates: { canonical: "/quality-process" },
};

const CHECKS = [
  {
    stage: "Arrival",
    check: "Moisture & aroma check",
    detail: "Every incoming lot is tested for moisture and smelled by two people. Musty, sour or flat lots are rejected at the gate — before payment, not after complaints.",
  },
  {
    stage: "Grading",
    check: "Daylight-lamp sort",
    detail: "Kernels move across a lit table where graders remove splits, scorches and off-colour pieces. Gift grades allow zero splits; nothing is 'close enough'.",
  },
  {
    stage: "Roasting",
    check: "The rattle test",
    detail: "A cashew announces doneness by sound. Our roaster-in-charge samples every batch mid-drum — by hand, by ear, by taste. Sensors assist; they don't decide.",
  },
  {
    stage: "Packing",
    check: "Same-day seal & batch date",
    detail: "Roasted stock never sleeps in the open. It's sealed in food-grade liners the same day, stamped with the batch date you can read on every pack.",
  },
  {
    stage: "Dispatch",
    check: "The 30-day rule",
    detail: "Nothing older than 30 days leaves the factory — for any order, at any price. Older stock is sold same-day at the counter or donated. Never shipped.",
  },
];

export default function QualityProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality process"
        title="Trust, you can date-check."
        lede="Premium isn't a font on the box. It's a series of unglamorous checks, done every single time, by people whose surname is on the shop."
      />

      <ThemeZone bg="#faf6ef" fg="#2b1d14">
        <CraftSection />
      </ThemeZone>

      <section className="mx-auto max-w-4xl px-5 py-28 md:px-10" aria-label="Quality checkpoints">
        <Reveal>
          <h2 className="text-display mb-14 text-[clamp(1.9rem,4vw,3rem)] text-chocolate">
            Five checkpoints, zero exceptions.
          </h2>
        </Reveal>
        <ol className="space-y-5">
          {CHECKS.map((item, i) => (
            <Reveal key={item.stage} delay={Math.min(i * 0.05, 0.2)}>
              <li className="flex gap-6 rounded-[1.75rem] bg-cashew p-7 shadow-soft md:gap-9 md:p-9">
                <span className="font-display text-3xl font-semibold text-terracotta/50 md:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="eyebrow text-walnut/70">{item.stage}</p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold text-chocolate">
                    {item.check}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-chocolate/65 md:text-base">
                    {item.detail}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
