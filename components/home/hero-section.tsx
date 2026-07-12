"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { AmbientParticles } from "@/components/shared/ambient-particles";
import { HeroFallback } from "./hero-fallback";
import type { IngredientId } from "@/types";

/**
 * The packet-pour hero. Everything on screen is a photograph — the pouch
 * (with its real composited label) and every falling kernel are cutout
 * photos moved through CSS 3D space by GSAP. No WebGL anywhere.
 *
 * Choreography on the 0–1 pinned range:
 *   A  0–.10   packet upright, serif headline, idle breathing
 *   B  .10–.24 first scroll: packet tilts into the pour pose, lid peels open
 *   C  .26–.86 six chapters — each entry pours a burst of photographed
 *              kernels out of the mouth; they land in a persistent pile
 *   D  .87–1   packet rights itself, crossfade into the Premium Mix finale
 */
const TIMING = {
  introEnd: 0.1,
  tiltStart: 0.1,
  tiltEnd: 0.22,
  lidStart: 0.15,
  lidEnd: 0.24,
  beatsStart: 0.26,
  beatsEnd: 0.86,
  finaleStart: 0.87,
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

/** Pour pose — mouth points down-left so the kernels spill out of it. */
const POUR_ROT = -116;
const NUTS_PER_POUR = 7;

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** easeOutBack — slight elastic overshoot for the tilt. */
const backOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

interface SpawnedBeat {
  els: HTMLElement[];
  tweens: { kill(): void }[];
}

export function HeroSection() {
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const poseRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLImageElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const mouthMarkerRef = useRef<HTMLSpanElement>(null);
  const nutLayerRef = useRef<HTMLDivElement>(null);
  const spawned = useRef<Map<number, SpawnedBeat>>(new Map());

  const [panelBeat, setPanelBeat] = useState(-1);
  const [finale, setFinale] = useState(false);
  const reduced = usePrefersReducedMotion();

  const clearBeatsAfter = useCallback((idx: number) => {
    for (const [k, v] of spawned.current) {
      if (k > idx) {
        v.tweens.forEach((t) => t.kill());
        v.els.forEach((e) => e.remove());
        spawned.current.delete(k);
      }
    }
  }, []);

  /** Pour a burst of photographed kernels out of the packet mouth. */
  const spawnBeat = useCallback((idx: number, animated: boolean) => {
    const layer = nutLayerRef.current;
    const stage = stageRef.current;
    const marker = mouthMarkerRef.current;
    if (!layer || !stage || !marker || spawned.current.has(idx)) return;
    const { gsap } = ensureGsap();

    const stageRect = stage.getBoundingClientRect();
    const mRect = marker.getBoundingClientRect();
    const mx = mRect.left - stageRect.left;
    const my = mRect.top - stageRect.top;
    const id = BEAT_ORDER[idx];
    const els: HTMLElement[] = [];
    const tweens: { kill(): void }[] = [];

    for (let i = 0; i < NUTS_PER_POUR; i++) {
      const img = document.createElement("img");
      img.src = `/images/cutouts/${id}-${(i % 2) + 1}.png`;
      img.alt = "";
      img.draggable = false;
      const depth = 0.5 + Math.random() * 0.55;
      const w = Math.round((36 + Math.random() * 34) * depth);
      img.style.cssText = [
        "position:absolute",
        "left:0",
        "top:0",
        `width:${w}px`,
        "pointer-events:none",
        "will-change:transform",
        `filter:drop-shadow(0 10px 14px rgb(28 18 11/0.28))${depth < 0.66 ? " blur(1.2px)" : ""}`,
      ].join(";");
      layer.appendChild(img);
      els.push(img);

      const landX = mx + (Math.random() * 0.36 - 0.1) * stageRect.width;
      const landY = stageRect.height - 26 - Math.random() * 72;
      const rot0 = Math.random() * 360 - 180;
      const rot1 = rot0 + (Math.random() * 460 - 230);

      if (!animated) {
        // Fast-scroll catch-up: this chapter's kernels are already in the pile.
        gsap.set(img, { x: landX, y: landY, rotation: rot1, opacity: 1 });
        continue;
      }

      const tl = gsap.timeline({ delay: i * 0.07 + Math.random() * 0.08 });
      tl.set(img, {
        x: mx + (Math.random() * 44 - 22),
        y: my - 8,
        rotation: rot0,
        opacity: 0,
        scale: 0.55,
      })
        .to(img, { opacity: 1, scale: 1, duration: 0.16, ease: "power1.out" }, 0)
        .to(img, { x: landX, duration: 1.05, ease: "power1.out" }, 0)
        .to(img, { y: landY, duration: 1, ease: "power2.in" }, 0)
        .to(img, { rotation: rot1, duration: 1.05, ease: "power1.inOut" }, 0)
        // touchdown: one small hop, then settle
        .to(img, { y: landY - 10 - Math.random() * 10, duration: 0.15, ease: "power1.out" }, ">-0.02")
        .to(img, { y: landY, rotation: rot1 + (Math.random() * 24 - 12), duration: 0.18, ease: "power1.in" }, ">");
      tweens.push(tl);
    }
    spawned.current.set(idx, { els, tweens });
  }, []);

  // Chapter entry → pour + packet shake; scroll-back → clear later piles.
  useEffect(() => {
    if (reduced || panelBeat < 0) return;
    const { gsap } = ensureGsap();
    for (let i = 0; i < panelBeat; i++) spawnBeat(i, false);
    const isNew = !spawned.current.has(panelBeat);
    spawnBeat(panelBeat, true);
    clearBeatsAfter(panelBeat);
    if (isNew && shakeRef.current) {
      gsap.fromTo(
        shakeRef.current,
        { rotation: -1.6 },
        { rotation: 1.6, duration: 0.09, repeat: 5, yoyo: true, ease: "power1.inOut", clearProps: "rotation" }
      );
    }
  }, [panelBeat, reduced, spawnBeat, clearBeatsAfter]);

  // Preload every kernel cutout so the first pour never pops in late.
  useEffect(() => {
    if (reduced) return;
    for (const id of BEAT_ORDER) {
      for (const v of [1, 2]) {
        const im = new window.Image();
        im.src = `/images/cutouts/${id}-${v}.png`;
      }
    }
  }, [reduced]);

  useEffect(() => {
    if (reduced || !wrapRef.current) return;
    const { gsap, ScrollTrigger } = ensureGsap();
    const spawnedMap = spawned.current;

    let lastPanel = -2;
    let lastFinale: boolean | null = null;

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        const wW = window.innerWidth;
        const wH = window.innerHeight;

        // ── Intro headline fades up and away.
        if (introRef.current) {
          const gone = smoothstep(0.04, TIMING.introEnd, p);
          gsap.set(introRef.current, {
            opacity: 1 - gone,
            y: gone * -60,
            visibility: gone >= 0.99 ? "hidden" : "visible",
          });
        }
        if (cueRef.current) {
          gsap.set(cueRef.current, { opacity: 1 - smoothstep(0.01, 0.05, p) });
        }

        // ── Packet pose: upright → tilted pour → rights itself.
        const tiltT = smoothstep(TIMING.tiltStart, TIMING.tiltEnd, p);
        const finT = smoothstep(TIMING.finaleStart, 0.95, p);
        const hold = 1 - finT;
        if (poseRef.current) {
          const inBeats = p >= TIMING.beatsStart && p < TIMING.finaleStart;
          const sway = inBeats ? Math.sin(p * 46) * 1.7 : 0;
          const bob = inBeats ? Math.sin(p * 30) * 5 : 0;
          gsap.set(poseRef.current, {
            x: -0.2 * wW * tiltT * hold,
            y: -0.05 * wH * tiltT * hold + bob,
            rotation: (POUR_ROT * backOut(tiltT) + sway) * hold,
            scale: 1 - 0.24 * tiltT * hold + finT * 0.04,
            opacity: 1 - smoothstep(0.9, 0.97, p),
          });
        }

        // ── Lid peels open at the crimp seal.
        const lidT = smoothstep(TIMING.lidStart, TIMING.lidEnd, p) * hold;
        if (lidRef.current) {
          gsap.set(lidRef.current, { rotationX: -128 * lidT });
        }
        if (mouthRef.current) {
          gsap.set(mouthRef.current, { opacity: lidT, scaleY: 0.4 + 0.6 * lidT });
        }

        // ── Pile fades under the finale crossfade.
        if (nutLayerRef.current) {
          gsap.set(nutLayerRef.current, {
            opacity: 1 - smoothstep(TIMING.finaleStart, 0.94, p),
          });
        }

        // Scrolled back above the pour — the packet is closed again.
        if (p < TIMING.lidStart && spawnedMap.size > 0) {
          clearBeatsAfter(-1);
        }

        // ── Chapter + finale state (React only at boundaries).
        let panel = -1;
        if (p >= TIMING.beatsStart && p < TIMING.beatsEnd) {
          const idx = Math.min(
            BEAT_ORDER.length - 1,
            Math.floor((p - TIMING.beatsStart) / BEAT_SPAN)
          );
          const local = (p - (TIMING.beatsStart + idx * BEAT_SPAN)) / BEAT_SPAN;
          if (local > 0.04 && local < 0.985) panel = idx;
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

    return () => {
      st.kill();
      for (const v of spawnedMap.values()) {
        v.tweens.forEach((t) => t.kill());
        v.els.forEach((e) => e.remove());
      }
      spawnedMap.clear();
    };
  }, [reduced, clearBeatsAfter]);

  if (reduced) return <HeroFallback />;

  const ingredient =
    panelBeat >= 0 ? ingredients.find((i) => i.id === BEAT_ORDER[panelBeat]) : null;
  const years = new Date().getFullYear() - brand.foundedYear;

  return (
    <section
      ref={wrapRef}
      className="relative h-[600vh]"
      aria-label="The Appu Kaju story"
    >
      <div
        ref={stageRef}
        className="noise sticky top-0 h-screen overflow-hidden bg-parchment"
        style={{ perspective: "1200px" }}
      >
        {/* ── Ambient: warm clay light + drifting dust motes ── */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 60% at 50% 26%, rgb(201 111 74 / 0.09), transparent 64%), radial-gradient(70% 50% at 50% 100%, rgb(46 74 52 / 0.06), transparent 60%)",
          }}
        />
        <AmbientParticles count={14} color="rgb(156 107 63 / 0.45)" />

        {/* ── The landed kernels accumulate here ── */}
        <div ref={nutLayerRef} aria-hidden className="absolute inset-0 z-20" />

        {/* ── The packet: lid + base photo layers ── */}
        <div className="absolute inset-x-0 top-[14vh] z-30 flex justify-center">
          <div
            ref={poseRef}
            className="w-[min(13.5rem,36vw)] will-change-transform"
          >
            <div ref={shakeRef}>
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative [filter:drop-shadow(0_30px_46px_rgb(28_18_11/0.32))]"
              >
                {/* dark mouth revealed as the lid peels */}
                <div
                  ref={mouthRef}
                  aria-hidden
                  className="absolute left-[10%] top-[12.5%] z-0 h-[6.5%] w-[80%] rounded-[50%] opacity-0"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 50%, #14100b 58%, rgb(20 16 11 / 0) 74%)",
                  }}
                />
                <span
                  ref={mouthMarkerRef}
                  aria-hidden
                  className="absolute left-1/2 top-[15%]"
                />
                <div className="relative z-10" style={{ perspective: "700px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={lidRef}
                    src="/images/cutouts/packet-lid.png"
                    alt=""
                    className="w-full origin-bottom will-change-transform"
                  />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/cutouts/packet-base.png"
                  alt="Appu Kaju premium dry fruit pouch"
                  className="relative -mt-px w-full"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Intro headline ── */}
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-x-0 bottom-[13vh] z-40 flex flex-col items-center px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: EASE_OUT_EXPO }}
            className="eyebrow mb-5 text-terracotta"
          >
            Est. {brand.foundedYear} · {brand.city}, India
          </motion.p>
          <h1 className="text-serif text-[clamp(2.6rem,7vw,5.8rem)] text-chocolate">
            {"Six treasures.".split(" ").map((w, i) => (
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
            <br className="hidden md:block" />
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block text-forest"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.68, duration: 1, ease: EASE_OUT_EXPO }}
              >
                One honest packet.
              </motion.span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 1 }}
            className="mt-6 max-w-md text-base text-chocolate/60 md:text-lg"
          >
            Scroll to open the packet we have spent {years} years perfecting.
          </motion.p>
        </div>

        {/* Scroll cue */}
        <div
          ref={cueRef}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-40 flex flex-col items-center gap-2.5 text-chocolate/45"
        >
          <span className="eyebrow text-[0.6rem]">Scroll to open</span>
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
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="absolute inset-0 z-40 mx-auto grid max-w-[1500px] grid-rows-[1fr_auto] items-center gap-4 px-5 pt-20 pb-5 md:grid-cols-[1.05fr_1fr] md:grid-rows-none md:gap-14 md:px-12 md:py-0"
            >
              {/* The featured kernel floats large over the pour */}
              <div className="pointer-events-none relative flex h-full items-center justify-center md:justify-end md:pr-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -16, y: 46 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    y: 0,
                    transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 },
                  }}
                  exit={{ opacity: 0, scale: 0.7, y: -30, transition: { duration: 0.25 } }}
                >
                  <motion.div
                    animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/cutouts/${ingredient.id}-1.png`}
                      alt=""
                      className="w-[clamp(7rem,17vw,13rem)] [filter:drop-shadow(0_34px_44px_rgb(28_18_11/0.35))]"
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Editorial benefit panel */}
              <motion.aside
                initial={{ opacity: 0, x: 48 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.12 },
                }}
                exit={{ opacity: 0, x: -28, transition: { duration: 0.25 } }}
                className="rounded-sm border border-forest/15 bg-paper/90 p-6 shadow-soft backdrop-blur-sm md:p-10"
              >
                <p className="index-No text-terracotta">
                  № {panelBeat + 1} / {BEAT_ORDER.length} — Out of the packet
                </p>
                <h2 className="text-serif mt-3 text-3xl font-bold text-forest md:text-5xl">
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
                      <span aria-hidden className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-terracotta" />
                      <span className="text-sm leading-snug text-chocolate/85 md:text-[0.95rem]">
                        <strong className="font-semibold text-chocolate">{b.title}.</strong>{" "}
                        <span className="text-chocolate/55">{b.detail}</span>
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-forest/15 pt-4 md:mt-7">
                  <p className="text-[0.7rem] text-chocolate/45 md:text-xs">
                    Origin · {ingredient.origin}
                  </p>
                  <p className="text-[0.7rem] font-medium text-terracotta md:text-xs">
                    {ingredient.nutrition.protein} g protein / 100 g
                  </p>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Progress rail (desktop) ── */}
        {(panelBeat >= 0 || finale) && (
          <div className="pointer-events-none absolute top-1/2 left-6 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
            {BEAT_ORDER.map((id, i) => {
              const ing = ingredients.find((x) => x.id === id)!;
              const state = panelBeat === i ? "active" : finale || panelBeat > i ? "done" : "todo";
              return (
                <div key={id} className="flex items-center gap-3">
                  <span
                    className={`block h-px transition-all duration-500 ${
                      state === "active" ? "w-8 bg-terracotta" : "w-4 bg-chocolate/20"
                    }`}
                  />
                  <span
                    className={`eyebrow text-[0.58rem] transition-colors duration-500 ${
                      state === "active"
                        ? "text-terracotta"
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
              className="absolute inset-0 z-50"
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
                className="absolute inset-0 bg-gradient-to-t from-parchment via-parchment/70 to-transparent"
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
                <p className="eyebrow mb-4 text-terracotta">The Signature Blend</p>
                <p className="text-serif text-[clamp(2.4rem,5.5vw,4.8rem)] font-bold text-chocolate">
                  Appu Premium Mix
                </p>
                <p className="mt-4 max-w-md text-sm text-chocolate/65 md:text-base">
                  All six treasures, in the proportion we serve our own family —
                  poured from one honest packet.
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
