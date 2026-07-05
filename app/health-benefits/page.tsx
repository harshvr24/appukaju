import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { ingredients } from "@/lib/data/ingredients";
import { products } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Health Benefits — The Ingredient Galaxy",
  description:
    "Protein, omega-3, vitamin E, fiber and iron — what each dry fruit actually does for you, per 100 g, without the wellness fog.",
  alternates: { canonical: "/health-benefits" },
};

export default function HealthBenefitsPage() {
  return (
    <>
      <PageHero
        eyebrow="The ingredient galaxy"
        title="What a handful actually does."
        lede="No wellness fog, no miracle claims. Just what each ingredient carries per 100 grams, and why nutritionists keep recommending the daily 30-gram handful."
      />

      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ing, i) => {
            const shopLink = products.find((p) => p.category === ing.id);
            return (
              <Reveal key={ing.id} delay={(i % 3) * 0.08}>
                <article
                  className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 shadow-soft transition-shadow duration-700 hover:shadow-lift"
                  style={{
                    background: `linear-gradient(155deg, ${ing.accent}26, #f5efe4 55%)`,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute -top-10 -right-10 size-36 rounded-full opacity-30 blur-2xl transition-opacity duration-700 group-hover:opacity-60"
                    style={{ background: ing.accent }}
                  />
                  <p className="eyebrow text-walnut/70">{ing.hindiName}</p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-chocolate">
                    {ing.name}
                  </h2>
                  <p className="mt-1.5 text-sm text-chocolate/60">{ing.tagline}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {ing.benefits.map((b) => (
                      <li key={b.title} className="flex gap-3 text-sm">
                        <span
                          aria-hidden
                          className="mt-[0.45rem] size-1.5 shrink-0 rounded-full"
                          style={{ background: ing.accent }}
                        />
                        <span className="leading-snug">
                          <strong className="font-semibold text-chocolate">{b.title}.</strong>{" "}
                          <span className="text-chocolate/60">{b.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 grid grid-cols-4 gap-2 border-t border-chocolate/10 pt-5 text-center">
                    {(
                      [
                        ["kcal", ing.nutrition.calories],
                        ["protein", `${ing.nutrition.protein}g`],
                        ["fiber", `${ing.nutrition.fiber}g`],
                        ["carbs", `${ing.nutrition.carbs}g`],
                      ] as const
                    ).map(([label, val]) => (
                      <div key={label}>
                        <p className="font-display text-lg font-semibold text-chocolate">{val}</p>
                        <p className="text-[0.6rem] tracking-[0.14em] text-chocolate/45 uppercase">{label}</p>
                      </div>
                    ))}
                  </div>

                  {shopLink && (
                    <Link
                      href={`/products/${shopLink.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-walnut transition-colors hover:text-chocolate"
                    >
                      Shop {ing.name.toLowerCase()}s
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-16">
          <div className="rounded-[2rem] bg-pistachio/25 p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold text-forest">
              The 30-gram rule
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-forest/85">
              Most nutrition bodies converge on the same advice: about 30 grams of
              mixed nuts a day — a small handful — is associated with better heart
              markers and better satiety. Not more (they&apos;re calorie-dense),
              not less (the effect needs consistency). Our Premium Mix exists so
              that handful is never boring.
            </p>
            <p className="mt-4 text-xs text-forest/60">
              General information, not medical advice. If you have nut allergies
              or specific conditions, talk to your doctor.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
