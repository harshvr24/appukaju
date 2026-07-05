import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Counter } from "@/components/shared/counter";
import { WholesaleForm } from "@/components/forms/wholesale-form";
import { products } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wholesale — Factory-Direct Since 1998",
  description:
    "Kuber 10 kg trade packs and standing weekly supply for sweet shops, hotels and caterers. Factory-direct rates from Lucknow.",
  alternates: { canonical: "/wholesale" },
};

const TRADE_STATS = [
  { value: 120, suffix: "+", label: "Trade partners" },
  { value: 25, suffix: "+", label: "Years supplying halwais" },
  { value: 48, suffix: " hrs", label: "Standing-order turnaround" },
];

export default function WholesalePage() {
  const kuber = products.find((p) => p.id === "kuber-kaju");
  return (
    <>
      <PageHero
        eyebrow="Trade & wholesale"
        title="Half the kaju katli in Lucknow starts here."
        lede="We were a trade supplier before we were a brand. Sweet shops, hotels and caterers get the same small-batch freshness at factory-direct rates — with a standing weekly supply if you want it."
      />

      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="noise h-full rounded-[2rem] bg-chocolate p-9 text-cream md:p-12">
              <p className="eyebrow text-gold">The trade pack</p>
              <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
                Kuber Kaju · 10 kg
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-cream/65">
                {kuber?.description} Sealed liners, batch-dated, consistent grade
                across reorders — so your katli tastes the same in June as it did
                at Diwali.
              </p>
              <p className="mt-8 font-display text-4xl font-semibold text-gold">
                {kuber ? formatINR(kuber.variants[0].price) : ""}
                <span className="ml-2 font-body text-sm font-normal text-cream/55">
                  / 10 kg · factory gate
                </span>
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-center gap-8 rounded-[2rem] bg-cashew p-9 shadow-soft">
              {TRADE_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-4xl font-semibold text-chocolate">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-chocolate/55">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-28 md:px-10">
        <Reveal>
          <h2 className="text-display mb-4 text-[clamp(1.8rem,4vw,2.8rem)] text-chocolate">
            Tell us your volume.
          </h2>
          <p className="mb-10 text-chocolate/65">
            We quote factory-direct within one working day. For 25 kg+ we can
            arrange standing weekly supply with a fixed grade guarantee.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <WholesaleForm />
        </Reveal>
      </section>
    </>
  );
}
