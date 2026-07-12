"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ensureGsap } from "@/lib/animation/gsap-config";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { ingredients } from "@/lib/data/ingredients";
import { products } from "@/lib/data/products";
import { brand } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";
import { BenefitIcon } from "./benefit-icon";
import { HeroFallback } from "./hero-fallback";
import type { IngredientId } from "@/types";

/**
 * The cinematic "table film" hero. One pinned scroll plays eight full-bleed
 * photographic scenes — an opening table spread, six ingredient close-ups,
 * and the Premium Mix finale — as a slow crossfading film with Ken Burns
 * drift and editorial serif captions. No cutouts, no 3D: every frame is a
 * whole photograph, so nothing can fringe, clip or crash.
 */
const ORDER: IngredientId[] = [
  "cashew",
  "dates",
  "almond",
  "walnut",
  "pistachio",
  "raisin",
];

/** Scene image names in play order (files in /public/images/cinematic). */
const SCENES = ["table", ...ORDER, "mix"] as const;
const N = SCENES.length;
const SPAN = 1 / N;

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const productFor = (id: IngredientId) =>
  products.find((p) => p.category === id);

export function HeroSection() {
  const wrapRef = useRef<HTMLElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scene, setScene] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !wrapRef.current) return;
    const { gsap, ScrollTrigger } = ensureGsap();

    let lastScene = -1;
    let lastHeaderDark: boolean | null = null;

    // The film is dark for the whole pin — keep the header legible.
    const setHeaderOnDark = (onDark: boolean) => {
      if (onDark === lastHeaderDark) return;
      lastHeaderDark = onDark;
      document.documentElement.style.setProperty(
        "--header-fg",
        onDark ? "#f6efe1" : "#2b1d14"
      );
    };
    setHeaderOnDark(true);

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        setHeaderOnDark(p < 0.97);

        // Later scenes fade in over earlier ones; every visible scene
        // drifts with a slow Ken Burns zoom.
        for (let i = 0; i < N; i++) {
          const el = sceneRefs.current[i];
          if (!el) continue;
          const start = i * SPAN;
          const opacity = i === 0 ? 1 : smoothstep(start - 0.03, start + 0.015, p);
          const drift = Math.min(1, Math.max(0, (p - start + SPAN) / (SPAN * 2.2)));
          gsap.set(el, {
            opacity,
            scale: 1.12 - 0.12 * drift,
            visibility: opacity <= 0.001 ? "hidden" : "visible",
          });
        }

        // React state only at scene boundaries.
        const idx = Math.min(N - 1, Math.floor(p / SPAN));
        if (idx !== lastScene) {
          lastScene = idx;
          setScene(idx);
        }
      },
    });

    return () => {
      st.kill();
      document.documentElement.style.removeProperty("--header-fg");
    };
  }, [reduced]);

  if (reduced) return <HeroFallback />;

  const ingredient = scene >= 1 && scene <= ORDER.length
    ? ingredients.find((i) => i.id === ORDER[scene - 1])!
    : null;
  const years = new Date().getFullYear() - brand.foundedYear;

  return (
    <section
      ref={wrapRef}
      className="relative h-[640vh]"
      aria-label="The Appu Kaju story"
    >
      <div className="noise sticky top-0 h-screen overflow-hidden bg-cocoa">
        {/* ── The film: stacked full-bleed scenes ── */}
        {SCENES.map((name, i) => (
          <div
            key={name}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className="absolute inset-0 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={`/images/cinematic/${name}.webp`}
              alt=""
              fill
              sizes="100vw"
              priority={i < 2}
              className="object-cover"
            />
          </div>
        ))}

        {/* ── Legibility scrim ── */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-cocoa/90 via-cocoa/30 to-cocoa/40"
        />

        {/* ── Opening title ── */}
        <AnimatePresence mode="wait">
          {scene === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, y: -40, transition: { duration: 0.35 } }}
              className="absolute inset-x-0 bottom-[14vh] z-10 flex flex-col items-center px-6 text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: EASE_OUT_EXPO }}
                className="eyebrow mb-5 text-terracotta"
              >
                Est. {brand.foundedYear} · {brand.city}, India
              </motion.p>
              <h1 className="text-serif text-[clamp(2.6rem,7vw,5.8rem)] text-parchment">
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.45, duration: 1, ease: EASE_OUT_EXPO }}
                  >
                    Six treasures.
                  </motion.span>
                </span>{" "}
                <br className="hidden md:block" />
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="text-gold-shimmer inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.68, duration: 1, ease: EASE_OUT_EXPO }}
                  >
                    One family table.
                  </motion.span>
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.15, duration: 1 }}
                className="mt-6 max-w-md text-base text-parchment/65 md:text-lg"
              >
                Scroll through what {years} years of obsession taste like.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-10 flex flex-col items-center gap-2.5 text-parchment/45"
              >
                <span className="eyebrow text-[0.6rem]">Scroll</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDown className="size-4" strokeWidth={1.5} />
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ── Ingredient captions ── */}
          {ingredient && (
            <motion.div
              key={ingredient.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-10 md:px-12 md:pb-16"
            >
              <div className="max-w-2xl">
                <motion.p
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.05 } }}
                  className="index-No text-terracotta"
                >
                  № {scene} / {ORDER.length}
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.12 } }}
                  className="text-serif mt-2 text-4xl font-bold text-parchment md:text-6xl"
                >
                  {ingredient.name}
                  <span className="ml-4 align-middle font-body text-sm font-medium text-parchment/50 md:text-lg">
                    {ingredient.hindiName}
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 } }}
                  className="mt-2 text-sm text-gold md:text-base"
                >
                  {ingredient.tagline}
                </motion.p>

                <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 md:mt-7 md:gap-y-3.5">
                  {ingredient.benefits.slice(0, 4).map((b, i) => (
                    <motion.li
                      key={b.title}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.3 + i * 0.08, duration: 0.55, ease: EASE_OUT_EXPO },
                      }}
                      className="flex gap-3"
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-terracotta/20 text-terracotta">
                        <BenefitIcon title={b.title} className="size-3.5" />
                      </span>
                      <span className="text-sm leading-snug text-parchment/85">
                        <strong className="font-semibold text-parchment">{b.title}.</strong>{" "}
                        <span className="text-parchment/55">{b.detail}</span>
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.6, ease: EASE_OUT_EXPO } }}
                  className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-8"
                >
                  <Button asChild size="sm">
                    <Link
                      href={
                        productFor(ingredient.id)
                          ? `/products/${productFor(ingredient.id)!.slug}`
                          : "/products"
                      }
                    >
                      Explore {ingredient.name}
                    </Link>
                  </Button>
                  <p className="text-[0.7rem] text-parchment/45 md:text-xs">
                    Origin · {ingredient.origin}
                    <span className="mx-2.5 text-terracotta">·</span>
                    {ingredient.nutrition.protein} g protein / 100 g
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ── Finale ── */}
          {scene === N - 1 && (
            <motion.div
              key="finale"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute inset-0 z-10"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-parchment via-parchment/60 to-transparent"
              />
              <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.15 },
                }}
                className="absolute inset-x-0 bottom-[9vh] flex flex-col items-center px-6 text-center"
              >
                <p className="eyebrow mb-4 text-terracotta">The Signature Blend</p>
                <p className="text-serif text-[clamp(2.4rem,5.5vw,4.8rem)] font-bold text-chocolate">
                  Appu Premium Mix
                </p>
                <p className="mt-4 max-w-md text-sm text-chocolate/65 md:text-base">
                  All six treasures, in the proportion we serve our own family.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg">
                    <Link href="/products/premium-mix">Shop the Mix</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-chocolate">
                    <Link href="/products">Explore Collection</Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Progress rail (desktop) ── */}
        {scene >= 1 && scene <= ORDER.length && (
          <div className="pointer-events-none absolute top-1/2 left-6 z-10 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
            {ORDER.map((id, i) => {
              const ing = ingredients.find((x) => x.id === id)!;
              const state =
                scene - 1 === i ? "active" : scene - 1 > i ? "done" : "todo";
              return (
                <div key={id} className="flex items-center gap-3">
                  <span
                    className={`block h-px transition-all duration-500 ${
                      state === "active" ? "w-8 bg-terracotta" : "w-4 bg-parchment/25"
                    }`}
                  />
                  <span
                    className={`eyebrow text-[0.58rem] transition-colors duration-500 ${
                      state === "active"
                        ? "text-terracotta"
                        : state === "done"
                          ? "text-parchment/55"
                          : "text-parchment/25"
                    }`}
                  >
                    {ing.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Static story for screen readers */}
      <div className="sr-only">
        <h2>The ingredient journey</h2>
        {ingredients.map((ing) => (
          <section key={ing.id}>
            <h3>
              {ing.name} ({ing.hindiName}) — {ing.tagline}
            </h3>
            <ul>
              {ing.benefits.map((b) => (
                <li key={b.title}>
                  {b.title}: {b.detail}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
