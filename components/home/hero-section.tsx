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
import { brand } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";
import { HeroFallback } from "./hero-fallback";
import type { IngredientId } from "@/types";

/** Story timing on the 0–1 pinned-scroll range. */
const TIMING = {
  introEnd: 0.14,
  handoffStart: 0.15,
  handoffEnd: 0.25,
  beatsStart: 0.26,
  beatsEnd: 0.86,
  finaleStart: 0.86,
} as const;

const BEAT_ORDER: IngredientId[] = [
  "cashew",
  "almond",
  "walnut",
  "pistachio",
  "raisin",
  "dates",
];
const BEAT_SPAN = (TIMING.beatsEnd - TIMING.beatsStart) / BEAT_ORDER.length;

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export function HeroSection() {
  const wrapRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [panelBeat, setPanelBeat] = useState(-1);
  const [finale, setFinale] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !wrapRef.current) return;
    const { gsap, ScrollTrigger } = ensureGsap();

    let lastPanel = -2;
    let lastFinale: boolean | null = null;

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;

        // ── Intro headline fades up and away.
        if (introRef.current) {
          const o = 1 - smoothstep(0.05, TIMING.introEnd, p);
          gsap.set(introRef.current, {
            opacity: o,
            y: smoothstep(0.05, TIMING.introEnd, p) * -60,
            visibility: o <= 0.01 ? "hidden" : "visible",
          });
        }
        if (cueRef.current) {
          gsap.set(cueRef.current, { opacity: 1 - smoothstep(0.01, 0.06, p) });
        }

        // ── Packet grows toward the viewer, then hands off downward.
        if (packetRef.current) {
          const grow = 1 + smoothstep(0, TIMING.handoffEnd, p) * 0.55;
          const exit = smoothstep(TIMING.handoffStart, TIMING.handoffEnd, p);
          const o = 1 - smoothstep(TIMING.handoffEnd - 0.05, TIMING.handoffEnd, p);
          gsap.set(packetRef.current, {
            scale: grow,
            yPercent: exit * 70,
            opacity: o,
            visibility: o <= 0.01 ? "hidden" : "visible",
          });
        }

        // ── Thin gold ring wipe during the handoff (no sparkles).
        if (ringRef.current) {
          const t = smoothstep(TIMING.handoffStart, TIMING.beatsStart, p);
          const o = Math.sin(Math.min(1, t) * Math.PI);
          gsap.set(ringRef.current, {
            scale: 0.35 + t * 2.6,
            opacity: o * 0.6,
            visibility: o <= 0.01 ? "hidden" : "visible",
          });
        }

        // ── Chapter + finale state (React only on boundaries).
        let panel = -1;
        if (p >= TIMING.beatsStart && p < TIMING.beatsEnd) {
          const idx = Math.min(
            BEAT_ORDER.length - 1,
            Math.floor((p - TIMING.beatsStart) / BEAT_SPAN)
          );
          const local = (p - (TIMING.beatsStart + idx * BEAT_SPAN)) / BEAT_SPAN;
          if (local > 0.06 && local < 0.96) panel = idx;
        }
        if (panel !== lastPanel) {
          lastPanel = panel;
          setPanelBeat(panel);
        }

        const inFinale = p >= TIMING.finaleStart;
        if (inFinale !== lastFinale) {
          lastFinale = inFinale;
          setFinale(inFinale);
        }
      },
    });

    return () => st.kill();
  }, [reduced]);

  if (reduced) return <HeroFallback />;

  const ingredient = panelBeat >= 0 ? ingredients.find((i) => i.id === BEAT_ORDER[panelBeat]) : null;

  return (
    <section
      ref={wrapRef}
      className="relative h-[560vh]"
      aria-label="The Appu Kaju story"
    >
      <div className="noise sticky top-0 h-screen overflow-hidden bg-paper">
        {/* ── Ambient light: soft yellow glow + slow sun rays ── */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 60% at 50% 30%, rgb(245 179 1 / 0.14), transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 size-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.05] [animation:slow-spin_80s_linear_infinite] motion-reduce:animate-none"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, #f5b301 8deg, transparent 16deg, transparent 45deg, #f5b301 53deg, transparent 61deg, transparent 90deg, #f5b301 98deg, transparent 106deg, transparent 135deg, #f5b301 143deg, transparent 151deg, transparent 180deg, #f5b301 188deg, transparent 196deg, transparent 225deg, #f5b301 233deg, transparent 241deg, transparent 270deg, #f5b301 278deg, transparent 286deg, transparent 315deg, #f5b301 323deg, transparent 331deg)",
          }}
        />

        {/* ── Gold ring wipe (handoff) ── */}
        <div
          ref={ringRef}
          aria-hidden
          className="invisible absolute top-1/2 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold opacity-0"
        />

        {/* ── The packet (real photograph) ── */}
        <div
          ref={packetRef}
          className="absolute inset-x-0 top-[22vh] flex justify-center will-change-transform"
        >
          {/* Floating photo chips ride along and exit with the packet */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.2, ease: EASE_OUT_EXPO }}
            className="animate-float pointer-events-none absolute top-2 left-[9%] hidden w-40 rotate-[-6deg] overflow-hidden rounded-3xl shadow-lift lg:block"
            style={{ animationDelay: "-3s" }}
          >
            <Image src="/images/hero/cashew.webp" alt="" width={320} height={240} className="object-cover" />
          </motion.div>
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1.2, ease: EASE_OUT_EXPO }}
            className="animate-float pointer-events-none absolute top-[38vh] right-[9%] hidden w-44 rotate-[5deg] overflow-hidden rounded-3xl shadow-lift lg:block"
            style={{ animationDelay: "-6s" }}
          >
            <Image src="/images/hero/pistachio.webp" alt="" width={352} height={264} className="object-cover" />
          </motion.div>

          <div className="animate-float relative w-[min(19rem,58vw)]">
            <div
              aria-hidden
              className="absolute -inset-10 rounded-full"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 45%, rgb(245 179 1 / 0.22), transparent 70%)",
              }}
            />
            <Image
              src="/images/hero/packet.webp"
              alt="Appu Kaju premium dry fruit pouch"
              width={820}
              height={1024}
              priority
              sizes="(max-width: 768px) 58vw, 19rem"
              className="relative drop-shadow-[0_30px_50px_rgb(43_29_20/0.18)]"
            />
          </div>
        </div>

        {/* ── Intro headline ── */}
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-x-0 bottom-[14vh] flex flex-col items-center px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: EASE_OUT_EXPO }}
            className="eyebrow mb-5 text-walnut"
          >
            Since {brand.foundedYear} · {brand.city}, India
          </motion.p>
          <h1 className="text-display text-[clamp(2.4rem,6.5vw,5.5rem)] text-chocolate">
            {"The Art of the".split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.45 + i * 0.07, duration: 1, ease: EASE_OUT_EXPO }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block text-sunshine-deep"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.75, duration: 1, ease: EASE_OUT_EXPO }}
              >
                Perfect&nbsp;Handful
              </motion.span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 1 }}
            className="mt-6 max-w-md text-base text-chocolate/60 md:text-lg"
          >
            Scroll through the six ingredients we have perfected for{" "}
            {new Date().getFullYear() - brand.foundedYear} years.
          </motion.p>
        </div>

        {/* Scroll cue */}
        <div
          ref={cueRef}
          className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2.5 text-chocolate/45"
        >
          <span className="eyebrow text-[0.6rem]">Scroll to begin</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-4" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* ── Ingredient chapters ── */}
        <AnimatePresence mode="wait">
          {ingredient && panelBeat >= 0 && (
            <motion.div
              key={ingredient.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute inset-0 mx-auto grid max-w-[1500px] grid-rows-[1.15fr_1fr] items-center gap-5 px-5 pt-24 pb-6 md:grid-cols-[1.15fr_1fr] md:grid-rows-none md:gap-14 md:px-12 md:py-0"
            >
              {/* Photograph in an arch mask, vertical wipe + Ken Burns */}
              <motion.div
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{
                  clipPath: "inset(0% 0% 0% 0%)",
                  transition: { duration: 0.9, ease: EASE_OUT_EXPO },
                }}
                exit={{
                  clipPath: "inset(0% 0% 100% 0%)",
                  opacity: 0.6,
                  transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
                }}
                className="relative h-full max-h-[46vh] w-full overflow-hidden shadow-lift md:max-h-[68vh]"
                style={{ borderRadius: "10rem 10rem 2rem 2rem" }}
              >
                <motion.div
                  initial={{ scale: 1.14 }}
                  animate={{ scale: 1, transition: { duration: 1.6, ease: EASE_OUT_EXPO } }}
                  className="absolute inset-0"
                >
                  <Image
                    src={`/images/hero/${ingredient.id}.webp`}
                    alt={`${ingredient.name} — ${ingredient.hindiName}`}
                    fill
                    sizes="(max-width: 768px) 92vw, 52vw"
                    className="object-cover"
                  />
                </motion.div>
                <span
                  aria-hidden
                  className="absolute inset-x-10 top-5 mx-auto h-px max-w-40 bg-gradient-to-r from-transparent via-gold to-transparent"
                />
              </motion.div>

              {/* Info card */}
              <motion.aside
                initial={{ opacity: 0, x: 48 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.12 },
                }}
                exit={{ opacity: 0, x: -28, transition: { duration: 0.3 } }}
                className="rounded-[2rem] border border-gold/20 bg-white/85 p-6 shadow-soft backdrop-blur-sm md:p-10"
              >
                <p className="eyebrow text-sunshine-deep">
                  Chapter {panelBeat + 1} / {BEAT_ORDER.length} — The Ingredient Journey
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-chocolate md:text-5xl">
                  {ingredient.name}
                  <span className="ml-3 align-middle font-body text-sm font-medium text-chocolate/45 md:text-base">
                    {ingredient.hindiName}
                  </span>
                </h2>
                <p className="mt-2 text-sm text-walnut md:text-base">{ingredient.tagline}</p>

                <ul className="mt-4 space-y-2 md:mt-6 md:space-y-3.5">
                  {ingredient.benefits.slice(0, 4).map((b, i) => (
                    <motion.li
                      key={b.title}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.28 + i * 0.09, duration: 0.55, ease: EASE_OUT_EXPO },
                      }}
                      className="flex gap-3"
                    >
                      <span aria-hidden className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-sunshine" />
                      <span className="text-sm leading-snug text-chocolate/85 md:text-[0.95rem]">
                        <strong className="font-semibold text-chocolate">{b.title}.</strong>{" "}
                        <span className="text-chocolate/55">{b.detail}</span>
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-gold/20 pt-4 md:mt-7">
                  <p className="text-[0.7rem] text-chocolate/45 md:text-xs">
                    Origin · {ingredient.origin}
                  </p>
                  <p className="text-[0.7rem] font-medium text-sunshine-deep md:text-xs">
                    {ingredient.nutrition.protein} g protein / 100 g
                  </p>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Progress rail (desktop) ── */}
        {(panelBeat >= 0 || finale) && (
          <div className="pointer-events-none absolute top-1/2 left-6 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
            {BEAT_ORDER.map((id, i) => {
              const ing = ingredients.find((x) => x.id === id)!;
              const state = panelBeat === i ? "active" : finale || panelBeat > i ? "done" : "todo";
              return (
                <div key={id} className="flex items-center gap-3">
                  <span
                    className={`block h-px transition-all duration-500 ${
                      state === "active" ? "w-8 bg-sunshine-deep" : "w-4 bg-chocolate/20"
                    }`}
                  />
                  <span
                    className={`eyebrow text-[0.58rem] transition-colors duration-500 ${
                      state === "active"
                        ? "text-sunshine-deep"
                        : state === "done"
                          ? "text-chocolate/50"
                          : "text-chocolate/25"
                    }`}
                  >
                    {ing.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Finale ── */}
        <AnimatePresence>
          {finale && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.6 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1, transition: { duration: 1.4, ease: EASE_OUT_EXPO } }}
                className="absolute inset-0"
              >
                <Image
                  src="/images/hero/mix-pour.webp"
                  alt="Appu Premium Mix — all six dry fruits together"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-transparent"
              />
              <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.2 },
                }}
                className="absolute inset-x-0 bottom-[9vh] flex flex-col items-center px-6 text-center"
              >
                <p className="eyebrow mb-4 text-sunshine-deep">The Signature Blend</p>
                <p className="text-display text-[clamp(2.2rem,5.5vw,4.6rem)] text-chocolate">
                  Appu Premium Mix
                </p>
                <p className="mt-4 max-w-md text-sm text-chocolate/65 md:text-base">
                  All six ingredients, in the proportion we serve our own family.
                  Experience premium nutrition.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="bg-sunshine text-cocoa hover:bg-sunshine-deep">
                    <Link href="/products/premium-mix">Shop Now</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-chocolate">
                    <Link href="/products">Explore Collection</Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
