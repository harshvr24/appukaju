"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
  once?: boolean;
}

/** Generic fade-up on scroll into view. */
export function Reveal({
  delay = 0,
  y = 32,
  once = true,
  children,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
