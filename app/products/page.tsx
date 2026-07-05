import type { Metadata } from "next";
import { ProductsGallery } from "@/components/product/products-gallery";
import { TextReveal } from "@/components/shared/text-reveal";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "The Collection — Premium Dry Fruits",
  description:
    "Shop hand-graded cashews, Kashmiri almonds and walnuts, small-batch pistachios, shade-dried raisins, soft dates and the signature Appu Premium Mix.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <div className="mx-auto max-w-[1600px] px-5 pt-36 pb-28 md:px-10">
      <header className="mb-14 max-w-3xl">
        <Reveal>
          <p className="eyebrow mb-5 text-walnut">The collection</p>
        </Reveal>
        <TextReveal as="h1" className="text-display text-[clamp(2.6rem,6vw,5rem)] text-chocolate">
          Every shelf, packed this week.
        </TextReveal>
        <Reveal delay={0.15}>
          <p className="mt-6 text-base leading-relaxed text-chocolate/65 md:text-lg">
            Ten products, five origins, one grading standard. Every pack carries
            its batch date — because freshness should be a fact you can check.
          </p>
        </Reveal>
      </header>

      <ProductsGallery initialCategory={category} />
    </div>
  );
}
