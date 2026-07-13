"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";
import { brand } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";

/**
 * Static cinematic hero — one full-screen photograph of Appu, the serif
 * tagline and CTAs. Entrance animations play once on load; there is no
 * pinning and no scroll-driven choreography (removed by request). The
 * page scrolls straight through into the editorial sections.
 */
export function HeroSection() {
  const years = new Date().getFullYear() - brand.foundedYear;

  // The header sits over the dark hero at page top before any scroll —
  // ThemeZone takes over once the user moves.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--header-fg", "#f6efe1");
    return () => {
      root.style.removeProperty("--header-fg");
    };
  }, []);

  return (
    <section
      className="noise relative flex min-h-svh items-end overflow-hidden bg-cocoa"
      aria-label="Appu Kaju — Nature's Finest, Delivered Fresh"
    >
      <Image
        src="/images/story/appu.webp"
        alt="Appu, a majestic elephant, walking through a golden forest at dawn"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-cocoa/90 via-cocoa/30 to-cocoa/35"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pt-32 pb-16 md:px-10 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: EASE_OUT_EXPO }}
          className="eyebrow mb-6 text-terracotta"
        >
          Appu Kaju · Est. {brand.foundedYear} · {brand.city}, India
        </motion.p>

        <h1 className="text-serif max-w-4xl text-[clamp(2.8rem,7vw,6rem)] text-parchment">
          {"Nature's Finest.".split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.4 + i * 0.07, duration: 1, ease: EASE_OUT_EXPO }}
              >
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
          <br />
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="text-gold-shimmer inline-block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: EASE_OUT_EXPO }}
            >
              Delivered Fresh.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 1 }}
          className="mt-6 max-w-md text-base text-parchment/65 md:text-lg"
        >
          Small-batch cashews, Kashmiri almonds and walnuts, pistachios,
          raisins and dates — packed fresh by one family for {years} years.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.8, ease: EASE_OUT_EXPO }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Button asChild size="lg">
            <Link href="/products">Shop the collection</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-parchment">
            <Link href="/products/premium-mix">The Premium Mix</Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-parchment/45"
        >
          <ArrowDown className="size-4" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
