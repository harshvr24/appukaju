import { cn } from "@/lib/utils";
import { TextReveal } from "./text-reveal";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}

/** Consistent chapter opener: eyebrow → display title → optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const onLight = tone === "dark"; // dark text on light bg
  return (
    <div
      className={cn(
        "max-w-4xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Reveal>
        <p className={cn("eyebrow mb-5 text-terracotta")}>
          {eyebrow}
        </p>
      </Reveal>
      <TextReveal
        as="h2"
        className={cn(
          "text-serif text-[clamp(2.2rem,5vw,4.2rem)]",
          onLight ? "text-chocolate" : "text-parchment"
        )}
      >
        {title}
      </TextReveal>
      {description && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-6 max-w-2xl text-base leading-relaxed md:text-lg",
              align === "center" && "mx-auto",
              onLight ? "text-chocolate/65" : "text-parchment/65"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
