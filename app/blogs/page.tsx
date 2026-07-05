import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/data/blogs";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { ProductVisual } from "@/components/shared/product-visual";

export const metadata: Metadata = {
  title: "Journal — Notes from the Factory Floor",
  description:
    "Buying guides, kitchen science and behind-the-scenes notes from a family dry fruit factory in Lucknow.",
  alternates: { canonical: "/blogs" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function BlogsPage() {
  const [lead, ...rest] = blogPosts;
  return (
    <>
      <PageHero
        eyebrow="The journal"
        title="Notes from the factory floor."
        lede="How to read a cashew grade, why we won't buy a bigger roaster, and what your dadi already knew about almonds."
      />

      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        {/* Lead story */}
        <Reveal>
          <Link
            href={`/blogs/${lead.slug}`}
            className="group mb-14 grid overflow-hidden rounded-[2rem] bg-cashew shadow-soft transition-shadow duration-700 hover:shadow-lift md:grid-cols-2"
          >
            <ProductVisual
              src={lead.image}
              alt=""
              accent="#c6a15b"
              className="aspect-[16/9] md:aspect-auto md:min-h-80"
              sizes="(max-width: 768px) 92vw, 48vw"
            />
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="eyebrow text-walnut/70">
                {lead.category} · {formatDate(lead.date)} · {lead.readMinutes} min read
              </p>
              <h2 className="mt-4 font-display text-2xl font-semibold text-chocolate transition-colors duration-300 group-hover:text-walnut md:text-4xl">
                {lead.title}
              </h2>
              <p className="mt-4 leading-relaxed text-chocolate/60">{lead.excerpt}</p>
            </div>
          </Link>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 0.08}>
              <Link
                href={`/blogs/${post.slug}`}
                className="group block h-full overflow-hidden rounded-[1.75rem] bg-cashew shadow-soft transition-shadow duration-700 hover:shadow-lift"
              >
                <ProductVisual
                  src={post.image}
                  alt=""
                  accent="#e8d8c3"
                  className="aspect-[4/2.6] transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 92vw, 30vw"
                />
                <div className="p-7">
                  <p className="eyebrow text-[0.58rem] text-walnut/70">
                    {post.category} · {post.readMinutes} min
                  </p>
                  <h2 className="mt-2.5 font-display text-xl font-semibold text-chocolate transition-colors duration-300 group-hover:text-walnut">
                    {post.title}
                  </h2>
                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-chocolate/60">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
