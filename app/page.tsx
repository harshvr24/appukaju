import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { ThemeZone } from "@/components/home/theme-zone";
import { LegacySection } from "@/components/home/legacy-section";
import { SourcingSection } from "@/components/home/sourcing-section";
import { CraftSection } from "@/components/home/craft-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { RecipesSection } from "@/components/home/recipes-section";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title:
    "Appu Kaju — Premium Dry Fruits, Fresh from Lucknow Since 1998",
  description:
    "An immersive journey through India's most premium dry fruits. Small-batch cashews, Kashmiri almonds and walnuts, pistachios, raisins and dates — packed fresh since 1998.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <ThemeZone bg="#fffdf6" fg="#2b1d14">
        <LegacySection />
      </ThemeZone>

      <ThemeZone bg="#fff6dd" fg="#2b1d14">
        <SourcingSection />
      </ThemeZone>

      <ThemeZone bg="#fffdf6" fg="#2b1d14">
        <CraftSection />
        <FeaturedSection />
      </ThemeZone>

      <ThemeZone bg="#fff8e8" fg="#2b1d14">
        <TestimonialsSection />
      </ThemeZone>

      <ThemeZone bg="#fffdf6" fg="#2b1d14">
        <RecipesSection />
        <CtaSection />
      </ThemeZone>
    </>
  );
}
