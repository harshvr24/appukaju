import Link from "next/link";
import Image from "next/image";
import { ingredients } from "@/lib/data/ingredients";
import { brand } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";

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
          Six treasures. <span className="text-forest">One honest packet.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-chocolate/65">
          Six dry fruits. One family factory. {years} years of getting the
          small things right.
        </p>
        <div className="relative mt-14 w-full max-w-60">
          <Image
            src="/images/cutouts/packet-full.png"
            alt="Appu Kaju premium dry fruit pouch"
            width={430}
            height={1200}
            priority
            className="mx-auto drop-shadow-[0_30px_46px_rgb(28_18_11/0.3)]"
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {ingredients.map((ing, i) => (
          <article
            key={ing.id}
            className="rounded-sm border border-forest/15 bg-paper p-7 shadow-soft"
          >
            <Image
              src={`/images/cutouts/${ing.id}-1.png`}
              alt={ing.name}
              width={320}
              height={320}
              className="mx-auto h-28 w-auto object-contain drop-shadow-[0_16px_20px_rgb(28_18_11/0.25)]"
            />
            <p className="index-No mt-5 text-terracotta">
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
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-terracotta" />
                  <span>
                    <strong className="font-medium">{b.title}.</strong>{" "}
                    <span className="text-chocolate/60">{b.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
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
