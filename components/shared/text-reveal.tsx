"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";

type RevealTag = "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";

interface TextRevealProps {
  children: string;
  as?: RevealTag;
  className?: string;
  /** "word" slides each word up out of a mask; "line" reveals the block. */
  mode?: "word" | "line";
  delay?: number;
  once?: boolean;
}

/** Scroll-triggered masked text reveal, word by word. */
export function TextReveal({
  children,
  as: Tag = "p",
  className,
  mode = "word",
  delay = 0,
  once = true,
}: TextRevealProps) {
  const words = useMemo(() => children.split(" "), [children]);

  if (mode === "line") {
    return (
      <Tag className={cn("overflow-hidden", className)}>
        <motion.span
          className="block"
          initial={{ y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay }}
        >
          {children}
        </motion.span>
      </Tag>
    );
  }

  return (
    <Tag className={className} aria-label={children}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once, margin: "-10% 0px" }}
            transition={{
              duration: 0.85,
              ease: EASE_OUT_EXPO,
              delay: delay + i * 0.035,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
