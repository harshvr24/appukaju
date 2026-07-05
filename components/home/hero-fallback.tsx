import Link from "next/link";
import Image from "next/image";
import { ingredients } from "@/lib/data/ingredients";
import { brand } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";

/**
 * Static hero for reduced-motion users: the same photographic story,
 * no scroll choreography.
 */
export function HeroFallback() {
  return (
    <section className="bg-paper text-chocolate">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 py-32 text-center">
        <p className="eyebrow mb-6 text-walnut">
          Since {brand.foundedYear} · {brand.city}, India
        </p>
        <h1 className="text-display text-[clamp(2.8rem,8vw,6.5rem)]">
          The Art of the{" "}
          <span className="text-sunshine-deep">Perfect Handful</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-chocolate/65">
          Six dry fruits. One family factory. Twenty-eight years of getting the
          small things right.
        </p>
        <div className="relative mt-14 w-full max-w-sm">
          <Image
            src="/images/hero/packet.webp"
            alt="Appu Kaju premium dry fruit pouch"
            width={640}
            height={800}
            priority
            className="mx-auto rounded-[2rem]"
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {ingredients.map((ing, i) => (
          <article
            key={ing.id}
            className="overflow-hidden rounded-3xl border border-gold/20 bg-white shadow-soft"
          >
            <Image
              src={`/images/hero/${ing.id}.webp`}
              alt={ing.name}
              width={640}
              height={480}
              className="aspect-[4/2.6] w-full object-cover"
            />
            <div className="p-7">
              <p className="eyebrow mb-2 text-sunshine-deep">Chapter {i + 1}</p>
              <h2 className="font-display text-2xl font-semibold">
                {ing.name}
                <span className="ml-3 text-base font-medium text-chocolate/50">
                  {ing.hindiName}
                </span>
              </h2>
              <ul className="mt-4 space-y-2.5">
                {ing.benefits.map((b) => (
                  <li key={b.title} className="flex gap-3 text-sm">
                    <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sunshine" />
                    <span>
                      <strong className="font-medium">{b.title}.</strong>{" "}
                      <span className="text-chocolate/60">{b.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 pb-32 text-center">
        <h2 className="text-display text-[clamp(2.2rem,5vw,4rem)]">
          All six, in one signature blend
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-sunshine hover:bg-sunshine-deep">
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
