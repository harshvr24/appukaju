import Link from "next/link";
import { getProduct } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";
import { TextReveal } from "@/components/shared/text-reveal";
import { Reveal } from "@/components/shared/reveal";
import { Magnetic } from "@/components/shared/magnetic";
import { ProductVisual } from "@/components/shared/product-visual";
import { BenefitIcon } from "./benefit-icon";
import { Button } from "@/components/ui/button";

interface Showcase {
  slug: string;
  eyebrow: string;
  benefits: { title: string; detail: string }[];
}

/** Curated hero claims per showcased product (icon resolves from title). */
const SHOWCASES: Showcase[] = [
  {
    slug: "premium-mix",
    eyebrow: "The signature",
    benefits: [
      { title: "Complete Protein", detail: "Six fruits, more nuts than fruit — a full handful of nutrition, twice a day." },
      { title: "Heart-Healthy Fats", detail: "Nothing roasted in oil, nothing coated, nothing added." },
      { title: "Natural Energy", detail: "Dates and golden raisins sweeten the blend the slow, honest way." },
      { title: "Fresh by Date", detail: "Blended every Monday and Thursday; every pack carries its batch date." },
    ],
  },
  {
    slug: "appu-kaju-classic",
    eyebrow: "The original",
    benefits: [
      { title: "High Protein", detail: "18 g of plant protein per 100 g of hand-graded W240 kernels." },
      { title: "Heart Friendly", detail: "Zero cholesterol, rich in monounsaturated fats." },
      { title: "Ethically Sourced", detail: "Bought at the Konkan drying yards, never at commodity markets." },
      { title: "Roasted by Ear", detail: "Anwar bhai's 40 kg drum, twice a week — done when it sounds done." },
    ],
  },
];

/**
 * The brief's sticky product showcase: the product image pins (pure CSS
 * sticky) while headline, glass benefit cards and the CTA scroll past it.
 * Rows alternate image-left / image-right; everything stacks on mobile.
 */
export function ShowcaseSection() {
  return (
    <section aria-label="Signature products" className="mx-auto max-w-[1600px] px-5 md:px-10">
      {SHOWCASES.map(({ slug, eyebrow, benefits }, row) => {
        const product = getProduct(slug);
        if (!product) return null;
        const variant = product.variants[0];
        const flip = row % 2 === 1;

        return (
          <article
            key={slug}
            className="grid gap-10 border-t border-chocolate/10 py-16 md:py-24 lg:grid-cols-2 lg:gap-20"
          >
            {/* Pinned product image */}
            <div className={flip ? "lg:order-2" : undefined}>
              <div className="lg:sticky lg:top-28">
                <Link
                  href={`/products/${product.slug}`}
                  data-cursor="label:Shop"
                  className="group block overflow-hidden rounded-sm shadow-lift"
                >
                  <ProductVisual
                    src={product.image}
                    alt={product.name}
                    accent={product.accent}
                    className="aspect-[4/4.4] transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.05] lg:aspect-[4/4.8]"
                    sizes="(max-width: 1024px) 92vw, 46vw"
                  />
                </Link>
              </div>
            </div>

            {/* Scrolling story */}
            <div className={`flex flex-col justify-start lg:py-[8vh] ${flip ? "lg:order-1" : ""}`}>
              <Reveal>
                <p className="eyebrow text-terracotta">{eyebrow}</p>
              </Reveal>
              <TextReveal
                as="h3"
                className="text-serif mt-4 text-[clamp(2rem,4vw,3.6rem)] text-chocolate"
              >
                {product.name}
              </TextReveal>
              <Reveal delay={0.12}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-chocolate/65">
                  {product.description}
                </p>
              </Reveal>

              <div className="mt-10 space-y-6 lg:mt-14 lg:space-y-10">
                {benefits.map((b, i) => (
                  <Reveal key={b.title} delay={0.08 + (i % 2) * 0.06}>
                    <div className="glass group rounded-sm p-6 shadow-soft transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-2 hover:shadow-lift md:p-7">
                      <div className="flex items-start gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-terracotta/12 text-terracotta transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                          <BenefitIcon title={b.title} className="size-4.5" />
                        </span>
                        <div>
                          <h4 className="text-serif text-lg font-bold text-forest">
                            {b.title}
                          </h4>
                          <p className="mt-1.5 text-sm leading-relaxed text-chocolate/60">
                            {b.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center gap-6 lg:mt-14">
                <Magnetic>
                  <Button asChild size="lg">
                    <Link href={`/products/${product.slug}`}>
                      Shop {product.name}
                    </Link>
                  </Button>
                </Magnetic>
                <p className="text-sm text-chocolate/50">
                  From{" "}
                  <span className="text-serif text-2xl font-bold text-chocolate">
                    {formatINR(variant.price)}
                  </span>{" "}
                  / {variant.label}
                </p>
              </Reveal>
            </div>
          </article>
        );
      })}
    </section>
  );
}
