import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProducts } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ProductVisual } from "@/components/shared/product-visual";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export function FeaturedSection() {
  const [lead, ...rest] = featuredProducts.slice(0, 6);
  const leadVariant = lead.variants[0];

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="№ 4 — The collection"
          title="Chosen kernel by kernel."
        />
        <Reveal>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-colors hover:text-terracotta-deep"
          >
            View all products
            <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>

      {/* Lead product as a full-width editorial spread */}
      <Reveal className="mb-16">
        <article className="grid items-center gap-8 border-y border-chocolate/10 py-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <Link
            href={`/products/${lead.slug}`}
            className="group block overflow-hidden rounded-sm shadow-soft transition-shadow duration-700 hover:shadow-lift"
          >
            <ProductVisual
              src={lead.image}
              alt={lead.name}
              accent={lead.accent}
              className="aspect-[4/2.9] transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 92vw, 55vw"
            />
          </Link>
          <div>
            <p className="index-No text-terracotta">The house signature</p>
            <h3 className="text-serif mt-3 text-3xl font-bold text-forest md:text-5xl">
              {lead.name}
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-chocolate/65">
              {lead.shortDescription}
            </p>
            <p className="mt-6 text-sm text-chocolate/50">
              From{" "}
              <span className="text-serif text-2xl font-bold text-chocolate">
                {formatINR(leadVariant.price)}
              </span>{" "}
              / {leadVariant.label}
            </p>
            <Button asChild className="mt-7">
              <Link href={`/products/${lead.slug}`}>Shop {lead.name}</Link>
            </Button>
          </div>
        </article>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((product, i) => (
          <Reveal
            key={product.id}
            delay={(i % 3) * 0.09}
            className={i === 0 || i === 3 ? "lg:translate-y-10" : ""}
          >
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
