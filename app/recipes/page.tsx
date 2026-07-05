import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { recipes } from "@/lib/data/recipes";
import { getIngredient } from "@/lib/data/ingredients";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { ProductVisual } from "@/components/shared/product-visual";

export const metadata: Metadata = {
  title: "Recipes — From Our Kitchen",
  description:
    "Kaju katli, badam milk, pista kulfi and more — family recipes built around fresh-batch dry fruits, tested in a Lucknow kitchen since 1998.",
  alternates: { canonical: "/recipes" },
};

export default function RecipesPage() {
  return (
    <>
      <PageHero
        eyebrow="From our kitchen"
        title="What a fresh batch can become."
        lede="Family recipes, written down at last. Every one starts with the same secret ingredient: a batch that was roasted this week, not this quarter."
      />

      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, i) => {
            const accent =
              recipe.heroIngredient === "mix"
                ? "#c6a15b"
                : (getIngredient(recipe.heroIngredient)?.accent ?? "#c6a15b");
            return (
              <Reveal key={recipe.id} delay={(i % 3) * 0.08}>
                <Link
                  href={`/recipes/${recipe.slug}`}
                  className="group block h-full overflow-hidden rounded-[1.75rem] bg-cashew shadow-soft transition-shadow duration-700 hover:shadow-lift"
                >
                  <ProductVisual
                    src={recipe.image}
                    alt=""
                    accent={accent}
                    className="aspect-[4/2.8] transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.05]"
                    sizes="(max-width: 768px) 92vw, 30vw"
                  />
                  <div className="p-7">
                    <div className="flex items-center gap-4 text-[0.65rem] tracking-[0.14em] text-walnut/70 uppercase">
                      <span>{recipe.difficulty}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3" /> {recipe.time}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3" /> Serves {recipe.serves}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-chocolate transition-colors duration-300 group-hover:text-walnut">
                      {recipe.title}
                    </h2>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-chocolate/60">
                      {recipe.intro}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
