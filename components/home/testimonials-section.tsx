import { Star } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import { SectionHeading } from "@/components/shared/section-heading";
import { Marquee } from "@/components/shared/marquee";
import type { Testimonial } from "@/types";

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="mx-3 flex w-[22rem] shrink-0 flex-col justify-between rounded-3xl border border-gold/25 bg-white p-7 shadow-soft md:w-[26rem]">
      <div>
        <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="size-3.5 fill-sunshine text-sunshine" />
          ))}
        </div>
        <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-chocolate/85">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3.5 border-t border-gold/15 pt-5">
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-full bg-sunshine-soft font-display text-sm font-semibold text-sunshine-deep"
        >
          {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </span>
        <div>
          <p className="text-sm font-medium text-chocolate">{t.name}</p>
          <p className="text-xs text-chocolate/50">
            {t.location} · {t.context}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  const rowA = testimonials.slice(0, 3);
  const rowB = testimonials.slice(3);
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Word of mouth, since 1998"
          title="Families that came back. And back."
          align="center"
        />
      </div>
      <div className="mt-16 space-y-6">
        <Marquee duration={45}>
          {rowA.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </Marquee>
        <Marquee duration={52} reverse>
          {rowB.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
