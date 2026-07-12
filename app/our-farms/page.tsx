import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { ThemeZone } from "@/components/home/theme-zone";
import { SourcingSection } from "@/components/home/sourcing-section";
import { Reveal } from "@/components/shared/reveal";
import { farms } from "@/lib/data/farms";

export const metadata: Metadata = {
  title: "Our Farms — Five Origins, One Obsession",
  description:
    "The Konkan coast, the Kashmir valley, Sangli's vineyards, Kutch's oases — where Appu Kaju's dry fruits actually come from, and why it matters.",
  alternates: { canonical: "/our-farms" },
};

export default function FarmsPage() {
  return (
    <>
      <PageHero
        eyebrow="Origins"
        title="We buy where it grows."
        lede="No commodity markets, no consolidators, no 'imported premium mix' of unknown provenance. Five origins, visited every season, bought at the source."
      />

      <ThemeZone bg="#f6efe1" fg="#2b1d14">
        <SourcingSection />
      </ThemeZone>

      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10" aria-label="Origin details">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm, i) => (
            <Reveal key={farm.id} delay={(i % 3) * 0.08}>
              <article className="flex h-full flex-col rounded-[2rem] bg-cashew p-8 shadow-soft">
                <p className="eyebrow text-walnut/70">{farm.crop}</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-chocolate">
                  {farm.region}
                </h2>
                <p className="text-sm text-chocolate/50">{farm.state}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-chocolate/65">
                  {farm.description}
                </p>
                <p className="mt-6 border-t border-chocolate/10 pt-4 text-xs text-chocolate/55">
                  Harvest · {farm.harvest}
                  {farm.altitude ? ` · Altitude ${farm.altitude}` : ""}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
