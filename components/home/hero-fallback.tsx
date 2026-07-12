import Link from "next/link";
import Image from "next/image";
import { ingredients } from "@/lib/data/ingredients";
import { products } from "@/lib/data/products";
import { brand } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";
import { BenefitIcon } from "./benefit-icon";

/**
 * Static hero for reduced-motion users: the packet and its six treasures,
 * no scroll choreography.
 */
export function HeroFallback() {
  const years = new Date().getFullYear() - brand.foundedYear;
  return (
    <section className="bg-parchment text-chocolate">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 py-32 text-center">
        <p className="eyebrow mb-6 text-terracotta">
          Est. {brand.foundedYear} · {brand.city}, India
        </p>
        <h1 className="text-serif text-[clamp(2.8rem,8vw,6.5rem)]">
          In the old forests, <span className="text-forest">patience grows.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-chocolate/65">
          Appu, the wise elephant, gathers what nature offers. Six dry fruits.
          One family factory. {years} years of getting the small things right.
        </p>
        <div className="relative mt-14 w-full max-w-3xl overflow-hidden rounded-sm shadow-lift">
          <Image
            src="/images/story/appu.webp"
            alt="Appu, a majestic Indian elephant, walking through a golden forest at dawn"
            width={1344}
            height={768}
            priority
            className="w-full object-cover"
          />
        </div>
        <p className="text-serif mt-8 text-lg text-terracotta">
          Nature&rsquo;s Finest. Delivered Fresh.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {ingredients.map((ing, i) => (
          <article
            key={ing.id}
            className="overflow-hidden rounded-sm border border-forest/15 bg-paper shadow-soft"
          >
            <Image
              src={`/images/cinematic/${ing.id}.webp`}
              alt={ing.name}
              width={1344}
              height={768}
              className="aspect-[4/2.4] w-full object-cover"
            />
            <div className="p-7">
            <p className="index-No text-terracotta">
              № {i + 1} / {ingredients.length}
            </p>
            <h2 className="text-serif mt-1 text-2xl font-bold text-forest">
              {ing.name}
              <span className="ml-3 font-body text-base font-medium text-chocolate/50">
                {ing.hindiName}
              </span>
            </h2>
            <ul className="mt-4 space-y-2.5">
              {ing.benefits.map((b) => (
                <li key={b.title} className="flex gap-3 text-sm">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-terracotta/12 text-terracotta">
                    <BenefitIcon title={b.title} className="size-3.5" />
                  </span>
                  <span>
                    <strong className="font-medium">{b.title}.</strong>{" "}
                    <span className="text-chocolate/60">{b.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={
                products.find((p) => p.category === ing.id)
                  ? `/products/${products.find((p) => p.category === ing.id)!.slug}`
                  : "/products"
              }
              className="mt-5 inline-block text-sm font-medium text-terracotta hover:text-terracotta-deep"
            >
              Explore {ing.name} →
            </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 pb-32 text-center">
        <h2 className="text-serif text-[clamp(2.2rem,5vw,4rem)]">
          All six, in one signature blend
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/products/premium-mix">Shop the Premium Mix</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/products">Explore the collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
