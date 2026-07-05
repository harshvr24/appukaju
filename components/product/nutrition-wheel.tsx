"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { NutritionFacts } from "@/types";

const SEGMENTS: {
  key: keyof Omit<NutritionFacts, "calories">;
  label: string;
  color: string;
}[] = [
  { key: "protein", label: "Protein", color: "#c6a15b" },
  { key: "fat", label: "Good fats", color: "#6b4a2e" },
  { key: "carbs", label: "Carbs", color: "#a8c49a" },
  { key: "fiber", label: "Fiber", color: "#2e4a34" },
];

interface NutritionWheelProps {
  nutrition: NutritionFacts;
}

/** Animated donut of macros per 100 g with calories at the centre. */
export function NutritionWheel({ nutrition }: NutritionWheelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const total = SEGMENTS.reduce((sum, s) => sum + nutrition[s.key], 0);
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div ref={ref} className="flex items-center gap-8">
      <div className="relative size-44 shrink-0 md:size-52">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgb(43 29 20 / 0.08)" strokeWidth="9" />
          {SEGMENTS.map((seg, i) => {
            const frac = nutrition[seg.key] / total;
            const dash = frac * C - 2.5;
            const el = (
              <motion.circle
                key={seg.key}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${Math.max(dash, 1)} ${C}`}
                initial={{ strokeDashoffset: -offset + C * 0.25, opacity: 0 }}
                animate={
                  inView
                    ? { strokeDashoffset: -offset, opacity: 1 }
                    : undefined
                }
                transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              />
            );
            offset += frac * C;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-display text-3xl font-semibold text-chocolate">
              {nutrition.calories}
            </p>
            <p className="text-[0.6rem] tracking-[0.18em] text-chocolate/50 uppercase">
              kcal / 100 g
            </p>
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        {SEGMENTS.map((seg) => (
          <li key={seg.key} className="flex items-center gap-3 text-sm">
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ background: seg.color }}
            />
            <span className="w-20 text-chocolate/60">{seg.label}</span>
            <span className="font-semibold tabular-nums text-chocolate">
              {nutrition[seg.key]} g
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
