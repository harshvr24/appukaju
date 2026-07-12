"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface ParticleLogoProps {
  text?: string;
  /** Formation starts the first time this becomes true; pauses when false. */
  active: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  delay: number;
  size: number;
  color: string;
  twinkle: number;
}

const GOLDS = ["212 175 55", "198 161 91", "240 223 174", "201 111 74"];
const FORM_MS = 2400;

/**
 * Golden particles that converge into the wordmark — plain Canvas 2D
 * (no WebGL). Text pixels are sampled from an offscreen render of the
 * site's serif font; ~1,800 particles fly in with per-particle stagger,
 * then idle with a soft shimmer. Reduced-motion users get the static
 * serif wordmark instead.
 */
export function ParticleLogo({
  text = "APPU KAJU",
  active,
  className,
}: ParticleLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const particlesRef = useRef<Particle[]>([]);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef(0);
  const builtRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (reduced || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(1.5, window.devicePixelRatio || 1);

    const build = async () => {
      if (builtRef.current) return;
      await document.fonts.ready;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      // Sample the wordmark from an offscreen render in the site serif.
      // (canvas fonts can't resolve CSS vars — read the computed family.)
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;font-family:var(--font-serif)";
      document.body.appendChild(probe);
      const serif = getComputedStyle(probe).fontFamily || "Georgia, serif";
      probe.remove();
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d")!;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      let fontSize = canvas.height * 0.6;
      octx.font = `700 ${fontSize}px ${serif}`;
      const w = octx.measureText(text).width;
      fontSize *= Math.min(1, (canvas.width * 0.92) / w);
      octx.font = `700 ${fontSize}px ${serif}`;
      octx.fillStyle = "#fff";
      octx.fillText(text, off.width / 2, off.height / 2);

      const img = octx.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(2, Math.round(Math.sqrt((off.width * off.height) / 1800 / 4)) * 2);
      const pts: Particle[] = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (img[(y * off.width + x) * 4 + 3] > 128) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.max(canvas.width, canvas.height) * (0.4 + Math.random() * 0.5);
            pts.push({
              x: off.width / 2 + Math.cos(angle) * dist,
              y: off.height / 2 + Math.sin(angle) * dist,
              tx: x,
              ty: y,
              delay: Math.random() * 0.55,
              size: (1 + Math.random() * 1.6) * dpr,
              color: GOLDS[Math.floor(Math.random() * GOLDS.length)],
              twinkle: Math.random() * Math.PI * 2,
            });
          }
        }
      }
      particlesRef.current = pts;
      builtRef.current = true;
    };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const draw = (now: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const global = Math.min(1, elapsed / FORM_MS);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particlesRef.current) {
        const local = Math.min(1, Math.max(0, (global - p.delay) / (1 - p.delay)));
        const e = easeOutCubic(local);
        const x = p.x + (p.tx - p.x) * e;
        const y = p.y + (p.ty - p.y) * e;
        const shimmer =
          global >= 1 ? 0.75 + 0.25 * Math.sin(now / 640 + p.twinkle) : 0.5 + 0.5 * local;
        ctx.fillStyle = `rgb(${p.color} / ${0.85 * shimmer})`;
        ctx.fillRect(x, y, p.size, p.size);
      }
    };

    let cancelled = false;
    if (active) {
      build().then(() => {
        if (cancelled || !builtRef.current || rafRef.current) return;
        rafRef.current = requestAnimationFrame(draw);
      });
    }

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      startRef.current = null; // re-activation replays the formation
    };
  }, [active, reduced, text]);

  if (reduced) {
    return (
      <p className={cn("text-serif text-center font-bold text-gold", className)}>
        {text}
      </p>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label={text}
      role="img"
      className={cn("h-full w-full", className)}
    />
  );
}
