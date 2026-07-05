import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";

export interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}

/** Shared premium template for Privacy / Terms style pages. */
export function LegalPage({ eyebrow, title, updated, sections }: LegalPageProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lede={`Last updated ${updated}`} />
      <section className="mx-auto max-w-3xl px-5 pb-28 md:px-10">
        <div className="space-y-12">
          {sections.map((section, i) => (
            <Reveal key={section.heading} delay={Math.min(i * 0.03, 0.1)}>
              <h2 className="mb-4 flex items-baseline gap-4 font-display text-2xl font-semibold text-chocolate">
                <span className="font-body text-xs text-gold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              <div className="space-y-4 pl-9">
                {section.body.map((para, j) => (
                  <p key={j} className="leading-relaxed text-chocolate/70">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
