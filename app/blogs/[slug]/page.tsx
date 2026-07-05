import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { blogPosts, getBlogPost } from "@/lib/data/blogs";
import { Reveal } from "@/components/shared/reveal";
import { TextReveal } from "@/components/shared/text-reveal";
import { ProductVisual } from "@/components/shared/product-visual";

export function generateStaticParams() {
  return blogPosts.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blogs/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const others = blogPosts.filter((b) => b.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-5 pt-32 pb-24 md:px-10">
      <Link
        href="/blogs"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-chocolate/55 transition-colors hover:text-chocolate"
      >
        <ChevronLeft className="size-4" /> The journal
      </Link>

      <p className="eyebrow text-walnut">
        {post.category} ·{" "}
        {new Date(post.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        · {post.readMinutes} min read
      </p>
      <TextReveal
        as="h1"
        className="text-display mt-5 text-[clamp(2.2rem,5vw,3.6rem)] text-chocolate"
      >
        {post.title}
      </TextReveal>

      <Reveal className="mt-10">
        <ProductVisual
          src={post.image}
          alt=""
          accent="#c6a15b"
          priority
          sizes="(max-width: 1024px) 92vw, 48rem"
          className="aspect-[16/8] rounded-[2rem] shadow-soft"
        />
      </Reveal>

      <div className="mt-12 space-y-8">
        {post.body.map((block, i) => (
          <Reveal key={i} delay={Math.min(i * 0.03, 0.12)}>
            {block.heading && (
              <h2 className="mb-3 font-display text-2xl font-semibold text-chocolate">
                {block.heading}
              </h2>
            )}
            <p className="text-[1.02rem] leading-[1.85] text-chocolate/75">{block.text}</p>
          </Reveal>
        ))}
      </div>

      <footer className="mt-20 border-t border-chocolate/10 pt-12">
        <h2 className="eyebrow mb-8 text-walnut">Keep reading</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {others.map((other) => (
            <Link
              key={other.id}
              href={`/blogs/${other.slug}`}
              className="group rounded-[1.5rem] bg-cashew p-6 shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <p className="eyebrow text-[0.58rem] text-walnut/70">{other.category}</p>
              <p className="mt-2 font-display text-lg font-semibold text-chocolate transition-colors group-hover:text-walnut">
                {other.title}
              </p>
            </Link>
          ))}
        </div>
      </footer>
    </article>
  );
}
