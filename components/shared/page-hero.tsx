import { TextReveal } from "./text-reveal";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
}

/** Consistent page opener for editorial pages. */
export function PageHero({ eyebrow, title, lede, align = "left", className }: PageHeroProps) {
  return (
    <header
      className={cn(
        "mx-auto max-w-[1600px] px-5 pt-36 pb-16 md:px-10 md:pb-20",
        align === "center" && "text-center",
        className
      )}
    >
      <Reveal>
        <p className="eyebrow mb-5 text-walnut">{eyebrow}</p>
      </Reveal>
      <TextReveal
        as="h1"
        className={cn(
          "text-display max-w-4xl text-[clamp(2.6rem,6vw,5rem)] text-chocolate",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </TextReveal>
      {lede && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-6 max-w-2xl text-base leading-relaxed text-chocolate/65 md:text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </header>
  );
}
