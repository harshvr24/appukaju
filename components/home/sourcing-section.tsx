"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { farms } from "@/lib/data/farms";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

/** Stylised India silhouette (not to scale) in a 100×118 viewBox. */
const INDIA_PATH =
  "M36 2 Q42 4 43 10 Q47 12 46 17 Q52 18 56 22 Q64 20 70 23 Q78 20 80 26 Q74 28 72 32 Q66 34 63 32 Q60 36 55 35 Q54 42 57 48 Q60 56 56 64 Q54 74 48 82 Q44 92 40 100 Q38 106 36 98 Q31 88 29 78 Q25 70 26 62 Q21 58 20 52 Q12 50 11 45 Q16 42 20 44 Q21 36 24 30 Q26 20 30 14 Q32 6 36 2 Z";

const LUCKNOW = farms.find((f) => f.id === "lucknow")!;

export function SourcingSection() {
  const [active, setActive] = useState(farms[0].id);

  return (
    <section className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-36">
      <SectionHeading
        eyebrow="How carefully we source"
        title="Five origins. One obsession."
        description="Every ingredient is bought at its source — at the drying yard, the orchard, the vineyard — never at a commodity market. Our graders travel; middlemen don't."
      />

      <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        {/* Map */}
        <Reveal className="relative mx-auto w-full max-w-xl">
          <svg
            viewBox="0 0 100 118"
            className="w-full"
            role="img"
            aria-label="Stylised map of India showing Appu Kaju sourcing regions"
          >
            <path
              d={INDIA_PATH}
              fill="rgb(245 179 1 / 0.07)"
              stroke="rgb(198 161 91 / 0.7)"
              strokeWidth="0.5"
            />
            {/* Routes to the Lucknow factory */}
            {farms
              .filter((f) => f.id !== "lucknow")
              .map((farm) => (
                <motion.line
                  key={farm.id}
                  x1={farm.coordinates.x}
                  y1={farm.coordinates.y}
                  x2={LUCKNOW.coordinates.x}
                  y2={LUCKNOW.coordinates.y}
                  stroke="rgb(198 161 91 / 0.5)"
                  strokeWidth="0.35"
                  strokeDasharray="1.6 1.6"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
                />
              ))}
            {/* Nodes */}
            {farms.map((farm) => {
              const isActive = active === farm.id;
              const isFactory = farm.id === "lucknow";
              return (
                <g
                  key={farm.id}
                  transform={`translate(${farm.coordinates.x}, ${farm.coordinates.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setActive(farm.id)}
                  onClick={() => setActive(farm.id)}
                >
                  <circle
                    r={isActive ? 3.4 : 2.2}
                    fill="none"
                    stroke={isActive ? "#e09e00" : "rgb(198 161 91 / 0.5)"}
                    strokeWidth="0.35"
                    className="transition-all duration-500"
                  >
                    {isActive && (
                      <animate attributeName="r" values="2.6;4;2.6" dur="2.4s" repeatCount="indefinite" />
                    )}
                  </circle>
                  <circle
                    r={isFactory ? 1.7 : 1.2}
                    fill={isActive ? "#f5b301" : isFactory ? "#e09e00" : "#c6a15b"}
                    className="transition-colors duration-500"
                  />
                  <text
                    x={farm.coordinates.x > 60 ? -3 : 4}
                    y="1"
                    textAnchor={farm.coordinates.x > 60 ? "end" : "start"}
                    className="select-none"
                    fill={isActive ? "#2b1d14" : "rgb(43 29 20 / 0.5)"}
                    fontSize="2.9"
                    fontWeight={isActive ? 600 : 400}
                  >
                    {farm.region}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-3 text-center text-[0.65rem] text-chocolate/40">
            Stylised map · not to scale
          </p>
        </Reveal>

        {/* Farm details */}
        <div className="space-y-3">
          {farms.map((farm) => {
            const isActive = active === farm.id;
            return (
              <button
                key={farm.id}
                type="button"
                onMouseEnter={() => setActive(farm.id)}
                onClick={() => setActive(farm.id)}
                aria-expanded={isActive}
                className={cn(
                  "block w-full cursor-pointer rounded-3xl border p-6 text-left transition-all duration-500 ease-(--ease-out-expo)",
                  isActive
                    ? "border-sunshine/60 bg-white shadow-soft"
                    : "border-chocolate/10 hover:border-chocolate/25"
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold text-chocolate">
                    {farm.region}
                    <span className="ml-3 font-body text-xs font-normal text-chocolate/45">
                      {farm.state}
                    </span>
                  </h3>
                  <span className="eyebrow shrink-0 text-[0.58rem] text-sunshine-deep">
                    {farm.crop}
                  </span>
                </div>
                <div
                  className={cn(
                    "grid transition-all duration-600 ease-(--ease-out-expo)",
                    isActive ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-chocolate/65">
                      {farm.description}
                    </p>
                    <p className="mt-3 text-xs text-chocolate/45">
                      Harvest · {farm.harvest}
                      {farm.altitude ? ` · ${farm.altitude}` : ""}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
