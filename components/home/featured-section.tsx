import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProducts } from "@/lib/data/products";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ProductCard } from "@/components/product/product-card";

/** Products already spotlighted by the sticky showcase above the grid. */
const SHOWCASED = ["premium-mix", "appu-kaju-classic"];

export function FeaturedSection() {
  const rest = featuredProducts
    .filter((p) => !SHOWCASED.includes(p.slug))
    .slice(0, 6);

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
