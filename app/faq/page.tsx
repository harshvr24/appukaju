import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { LuxuryAccordion } from "@/components/ui/luxury-accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "@/lib/data/faqs";
import { brand } from "@/lib/data/brand";

export const metadata: Metadata = {
  title: "FAQ — Straight Answers",
  description:
    "Grades, freshness, shipping, bulk orders and returns — the questions Appu Kaju customers actually ask, answered plainly.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="Questions, answered plainly"
        title="Everything people actually ask."
        lede="No corporate fog. If your question isn't here, the phone number below reaches a human."
      />

      <section className="mx-auto max-w-4xl px-5 pb-28 md:px-10">
        <Reveal>
          <LuxuryAccordion
            items={faqs.map((f) => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
              meta: f.category,
            }))}
          />
        </Reveal>

        <Reveal className="mt-16 rounded-[2rem] bg-cashew p-8 text-center shadow-soft md:p-10">
          <p className="font-display text-xl font-semibold text-chocolate">
            Still wondering about something?
          </p>
          <p className="mt-2 text-sm text-chocolate/60">
            Call {brand.phone} — a family member picks up.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="dark">
              <a href={brand.phoneHref}>Call us</a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">Contact page</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
