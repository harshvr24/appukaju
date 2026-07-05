import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Users, ChefHat } from "lucide-react";
import { recipes, getRecipe } from "@/lib/data/recipes";
import { getIngredient } from "@/lib/data/ingredients";
import { products } from "@/lib/data/products";
import { Reveal } from "@/components/shared/reveal";
import { TextReveal } from "@/components/shared/text-reveal";
import { ProductVisual } from "@/components/shared/product-visual";
import { ProductCard } from "@/components/product/product-card";

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};
  return {
    title: `${recipe.title} — Recipe`,
    description: recipe.intro,
    alternates: { canonical: `/recipes/${recipe.slug}` },
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const accent =
    recipe.heroIngredient === "mix"
      ? "#c6a15b"
      : (getIngredient(recipe.heroIngredient)?.accent ?? "#c6a15b");
  const featuredProduct = products.find((p) =>
    recipe.heroIngredient === "mix"
      ? p.category === "mix"
      : p.category === recipe.heroIngredient
  );

  return (
    <div className="mx-auto max-w-5xl px-5 pt-32 pb-24 md:px-10">
      <Link
        href="/recipes"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-chocolate/55 transition-colors hover:text-chocolate"
      >
        <ChevronLeft className="size-4" /> All recipes
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-4 text-[0.68rem] tracking-[0.16em] text-walnut uppercase">
          <span className="inline-flex items-center gap-1.5">
            <ChefHat className="size-3.5" /> {recipe.difficulty}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {recipe.time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" /> Serves {recipe.serves}
          </span>
        </div>
        <TextReveal
          as="h1"
          className="text-display mt-5 text-[clamp(2.4rem,5.5vw,4.2rem)] text-chocolate"
        >
          {recipe.title}
        </TextReveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-chocolate/65">
            {recipe.intro}
          </p>
        </Reveal>
      </header>

      <Reveal className="mt-10">
        <ProductVisual
          src={recipe.image}
          alt={recipe.title}
          accent={accent}
          priority
          sizes="(max-width: 1024px) 92vw, 60rem"
          className="aspect-[16/8] rounded-[2rem] shadow-lift"
        />
      </Reveal>

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_1.5fr]">
        <Reveal>
          <div className="rounded-[1.75rem] bg-cashew p-7 shadow-soft md:sticky md:top-28">
            <h2 className="font-display text-xl font-semibold text-chocolate">Ingredients</h2>
            <ul className="mt-4 space-y-3">
              {recipe.ingredients.map((ing) => (
                <li key={ing} className="flex gap-3 text-sm leading-snug text-chocolate/75">
                  <span aria-hidden className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-gold" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div>
          <h2 className="font-display text-xl font-semibold text-chocolate">Method</h2>
          <ol className="mt-6 space-y-7">
            {recipe.steps.map((step, i) => (
              <Reveal key={i} delay={Math.min(i * 0.04, 0.16)}>
                <li className="flex gap-5">
                  <span className="font-display text-2xl font-semibold text-gold/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1 leading-relaxed text-chocolate/75">{step}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      {featuredProduct && (
        <section className="mt-24">
          <h2 className="eyebrow mb-8 text-walnut">Made with</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCard product={featuredProduct} />
          </div>
        </section>
      )}
    </div>
  );
}
