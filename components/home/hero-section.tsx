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
import { AmbientParticles } from "@/components/shared/ambient-particles";
import { BenefitIcon } from "./benefit-icon";
import { HeroStatic } from "./hero-static";
import type { IngredientId } from "@/types";

/**
 * "The Appu Film" — a single continuous MP4 (rendered locally by
 * scripts/make-film.mjs: Ken-Burns camera pushes + gradual crossfades,
 * dense keyframes) scrubbed by scroll. One video element, no scene DOM
 * swaps — scrolling IS the film, forward and backward. Captions are
 * light overlays synced to the film's timing constants. No WebGL.
 */

/** Must match scripts/make-film.mjs: CLIP 3.2s, FADE 0.9s. */
const STEP = 2.3;
const SCENES = 12;
const TOTAL = SCENES * 3.2 - (SCENES - 1) * 0.9; // 28.5s

interface Beat {
  kind: "intro" | "story" | "harvest" | "finale";
  eyebrow?: string;
  line?: string;
  sub?: string;
  plaque?: boolean;
}

const BEATS: Beat[] = [
  { kind: "intro", line: "In the old forests, patience grows." },
  { kind: "story", eyebrow: "The elder", line: "Meet Appu.", sub: "Wisdom walks slowly. So do we — since 1998." },
  { kind: "story", eyebrow: "The discovery", line: "He knows the good trees.", sub: "A ripe cashew apple, found the old way." },
  { kind: "story", eyebrow: "The fruit", line: "Nature offers. We only gather.", sub: "Ripened slow under a Konkan sun — nothing forced." },
  { kind: "story", eyebrow: "№ 1 — The harvest", line: "Bought at the source.", sub: "At the drying yards of the Konkan coast, never at commodity markets." },
  { kind: "story", eyebrow: "№ 2 — The cleaning", line: "Washed. Shade-dried. Same day.", sub: "Freshness is a fact, not a slogan." },
  { kind: "story", eyebrow: "№ 3 — The inspection", line: "Graded kernel by kernel.", sub: "Under daylight lamps — machines sort by size, hands sort by honesty." },
  { kind: "story", eyebrow: "№ 4 — The roast", line: "Roasted by ear.", sub: "Anwar bhai's 40 kg drum — done when it sounds done." },
  { kind: "story", eyebrow: "№ 5 — The kernel", line: "One perfect kernel.", sub: "Buttery, whole, and exactly as nature grew it." },
  { kind: "story", eyebrow: "№ 6 — The seal", line: "Sealed within hours.", sub: "From the roast to your pouch — batch-dated, always.", plaque: true },
  { kind: "harvest", eyebrow: "The table", line: "Six treasures. One table." },
  { kind: "finale" },
];

const HARVEST_ORDER: IngredientId[] = [
  "cashew",
  "dates",
  "almond",
  "walnut",
  "pistachio",
  "raisin",
];

const productFor = (id: IngredientId) =>
  products.find((p) => p.category === id);

const captionIn = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay },
  },
});

export function HeroSection() {
  const wrapRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [beat, setBeat] = useState(0);
  const [filmReady, setFilmReady] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (reduced || !wrapRef.current || !video) return;
    const { ScrollTrigger } = ensureGsap();

    let lastBeat = -1;
    let lastHeaderDark: boolean | null = null;
    let target = 0;
    let current = 0;
    let raf = 0;

    const setHeaderOnDark = (onDark: boolean) => {
      if (onDark === lastHeaderDark) return;
      lastHeaderDark = onDark;
      document.documentElement.style.setProperty(
        "--header-fg",
        onDark ? "#f6efe1" : "#2b1d14"
      );
    };
    setHeaderOnDark(true);

    // Ease toward the scroll target so fast flicks don't queue dozens of
    // seeks; at most one currentTime write per frame.
    const tick = () => {
      raf = 0;
      current += (target - current) * 0.35;
      if (Math.abs(target - current) < 0.008) current = target;
      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        video.currentTime = current;
      }
      if (current !== target) raf = requestAnimationFrame(tick);
    };

    // iOS only exposes frames for seeking after a play/pause handshake.
    const prime = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    const onReady = () => {
      setFilmReady(true);
      prime();
    };
    if (video.readyState >= 2) onReady();
    else video.addEventListener("loadeddata", onReady, { once: true });

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        setHeaderOnDark(p < 0.97);

        const dur = Number.isFinite(video.duration) ? video.duration : TOTAL;
        target = p * Math.max(0, dur - 0.06);
        if (!raf) raf = requestAnimationFrame(tick);

        // Captions switch as each crossfade begins.
        const idx = Math.min(SCENES - 1, Math.floor((p * TOTAL) / STEP));
        if (idx !== lastBeat) {
          lastBeat = idx;
          setBeat(idx);
        }
      },
    });

    return () => {
      st.kill();
      if (raf) cancelAnimationFrame(raf);
      video.removeEventListener("loadeddata", onReady);
      document.documentElement.style.removeProperty("--header-fg");
    };
  }, [reduced]);

  if (reduced) return <HeroStatic />;

  const current = BEATS[beat];
  const years = new Date().getFullYear() - brand.foundedYear;

  return (
    <section
      ref={wrapRef}
      className="relative h-[1100vh]"
      aria-label="The Appu film — from forest to table"
    >
      <div className="noise sticky top-0 h-screen overflow-hidden bg-cocoa">
        {/* Instant first paint while the film buffers */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${filmReady ? "opacity-0" : "opacity-100"}`}
        >
          <Image
            src="/images/story/dawn.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* ── The film ── */}
        <video
          ref={videoRef}
          src="/videos/appu-film.mp4"
          poster="/videos/appu-film-poster.jpg"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* ── Legibility scrim + floating dust ── */}
        <div
          aria-hidden
          className="absolute inset-0 z-[8] bg-gradient-to-t from-cocoa/85 via-cocoa/20 to-cocoa/35"
        />
        <AmbientParticles count={14} className="z-[8]" />

        <AnimatePresence mode="wait">
          {/* ── Opening title ── */}
          {current.kind === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, y: -36, transition: { duration: 0.35 } }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: EASE_OUT_EXPO }}
                className="eyebrow mb-6 text-terracotta"
              >
                Appu Kaju · Est. {brand.foundedYear}
              </motion.p>
              <h1 className="text-serif max-w-4xl text-[clamp(2.4rem,6vw,5.2rem)] text-parchment">
                {"In the old forests, patience grows.".split(" ").map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.45 + i * 0.06, duration: 1, ease: EASE_OUT_EXPO }}
                    >
                      {w}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-6 max-w-md text-base text-parchment/60 md:text-lg"
              >
                A short film, {years} years in the making.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
                className="absolute bottom-8 flex flex-col items-center gap-2.5 text-parchment/45"
              >
                <span className="eyebrow text-[0.6rem]">Scroll to play</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDown className="size-4" strokeWidth={1.5} />
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ── Story captions ── */}
          {current.kind === "story" && (
            <motion.div
              key={`story-${beat}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-12 md:px-12 md:pb-20"
            >
              <div className="max-w-2xl">
                <motion.p {...captionIn(0.05)} className="index-No text-terracotta">
                  {current.eyebrow}
                </motion.p>
                <motion.h2
                  {...captionIn(0.14)}
                  className="text-serif mt-2 text-4xl font-bold text-parchment md:text-6xl"
                >
                  {current.line}
                </motion.h2>
                {current.sub && (
                  <motion.p
                    {...captionIn(0.24)}
                    className="mt-3 max-w-lg text-sm text-parchment/65 md:text-base"
                  >
                    {current.sub}
                  </motion.p>
                )}
                {current.plaque && (
                  <motion.div
                    {...captionIn(0.38)}
                    className="mt-6 inline-block border border-gold/40 px-6 py-4 text-center"
                  >
                    <p className="text-serif text-xl font-bold tracking-wide text-parchment">
                      APPU KAJU
                    </p>
                    <p className="eyebrow mt-1 text-[0.55rem] text-gold">
                      Premium Kaju &amp; Dry Fruits · Lucknow
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── The table: six treasures ── */}
          {current.kind === "harvest" && (
            <motion.div
              key="harvest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-10 md:px-12 md:pb-16"
            >
              <motion.p {...captionIn(0.05)} className="index-No text-terracotta">
                {current.eyebrow}
              </motion.p>
              <motion.h2
                {...captionIn(0.12)}
                className="text-serif mt-2 text-4xl font-bold text-parchment md:text-6xl"
              >
                {current.line}
              </motion.h2>
              <ul className="mt-6 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:mt-8">
                {HARVEST_ORDER.map((id, i) => {
                  const ing = ingredients.find((x) => x.id === id)!;
                  const product = productFor(id);
                  return (
                    <motion.li
                      key={id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.25 + i * 0.07, duration: 0.55, ease: EASE_OUT_EXPO },
                      }}
                    >
                      <Link
                        href={product ? `/products/${product.slug}` : "/products"}
                        className="group flex items-center gap-3"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-terracotta/20 text-terracotta transition-colors duration-300 group-hover:bg-terracotta group-hover:text-parchment">
                          <BenefitIcon title={ing.benefits[0].title} className="size-4" />
                        </span>
                        <span>
                          <span className="text-serif block text-base font-bold text-parchment">
                            {ing.name}
                          </span>
                          <span className="block text-[0.7rem] text-parchment/55">
                            {ing.benefits[0].title}
                          </span>
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <motion.div {...captionIn(0.7)} className="mt-7">
                <Button asChild size="sm">
                  <Link href="/products">Explore the collection</Link>
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Finale ── */}
          {current.kind === "finale" && (
            <motion.div
              key="finale"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute inset-0 z-10"
            >
              <div aria-hidden className="absolute inset-0 bg-cocoa/60" />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[38vh] bg-gradient-to-t from-parchment to-transparent"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.8 } }}
                  className="eyebrow mb-6 text-terracotta"
                >
                  Appu Kaju · Since {brand.foundedYear}
                </motion.p>
                <h2 className="text-serif max-w-4xl text-[clamp(2.2rem,5.5vw,4.8rem)] text-parchment">
                  {"From Nature's Finest Forests to Your Table.".split(" ").map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.25 + i * 0.06, duration: 0.9, ease: EASE_OUT_EXPO }}
                      >
                        {w}&nbsp;
                      </motion.span>
                    </span>
                  ))}
                </h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.9, duration: 1 } }}
                  className="text-serif mt-4 text-lg text-gold md:text-xl"
                >
                  Nature&rsquo;s Finest. Delivered Fresh.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 1.2, duration: 0.8, ease: EASE_OUT_EXPO },
                  }}
                  className="mt-9 flex flex-wrap justify-center gap-4"
                >
                  <Button asChild size="lg">
                    <Link href="/products/premium-mix">Shop the Premium Mix</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-parchment">
                    <Link href="/products">Explore Collection</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Beat dots ── */}
        <div className="pointer-events-none absolute top-1/2 right-5 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {BEATS.map((_, i) => (
            <span
              key={i}
              className={`block size-1.5 rounded-full transition-all duration-500 ${
                beat === i ? "scale-125 bg-terracotta" : "bg-parchment/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Static story for screen readers */}
      <div className="sr-only">
        <h2>The Appu film</h2>
        <p>
          In the old forests, patience grows. Appu, the wise elephant, finds
          the ripe cashew apple. The harvest is bought at the source, washed
          and shade-dried the same day, graded kernel by kernel, roasted by
          ear, and sealed within hours — from nature&rsquo;s finest forests to
          your table.
        </p>
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
