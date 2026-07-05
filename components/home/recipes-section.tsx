import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { recipes } from "@/lib/data/recipes";
import { getIngredient } from "@/lib/data/ingredients";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ProductVisual } from "@/components/shared/product-visual";

export function RecipesSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-36">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="From our kitchen"
          title="What a fresh batch can become."
        />
        <Reveal>
          <Link
            href="/recipes"
            className="group inline-flex items-center gap-2 text-sm font-medium text-walnut transition-colors hover:text-chocolate"
          >
            All recipes
            <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>

      <div
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 md:-mx-10 md:px-10 [scrollbar-width:thin]"
        data-lenis-prevent
      >
        {recipes.map((recipe, i) => {
          const accent =
            recipe.heroIngredient === "mix"
              ? "#c6a15b"
              : (getIngredient(recipe.heroIngredient)?.accent ?? "#c6a15b");
          return (
            <Reveal
              key={recipe.id}
              delay={Math.min(i, 3) * 0.07}
              className="w-[19rem] shrink-0 snap-start md:w-[24rem]"
            >
              <Link
                href={`/recipes/${recipe.slug}`}
                className="group block overflow-hidden rounded-[1.75rem] bg-cashew shadow-soft transition-shadow duration-700 hover:shadow-lift"
              >
                <ProductVisual
                  src={recipe.image}
                  alt=""
                  accent={accent}
                  className="aspect-[4/2.9] transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 80vw, 24rem"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[0.65rem] tracking-[0.14em] text-walnut/70 uppercase">
                    <span>{recipe.difficulty}</span>
                    <span aria-hidden className="size-0.5 rounded-full bg-walnut/40" />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" /> {recipe.time}
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-display text-xl font-semibold text-chocolate transition-colors duration-300 group-hover:text-walnut">
                    {recipe.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-chocolate/60">
                    {recipe.intro}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
