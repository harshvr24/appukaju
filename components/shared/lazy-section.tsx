"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  /**
   * "paint" (default): children are server-rendered (SEO-safe) and the
   * browser skips their layout/paint while offscreen via content-visibility.
   * "defer": children don't mount at all until the viewport approaches —
   * use for client-heavy, SEO-irrelevant chunks only.
   */
  mode?: "paint" | "defer";
  /** Reserved height while unmounted/offscreen, to avoid layout shift. */
  minHeight?: string;
  /** How early to mount in "defer" mode (IntersectionObserver rootMargin). */
  rootMargin?: string;
}

/**
 * Below-the-fold performance wrapper. In "paint" mode it costs nothing and
 * removes offscreen layout/paint work; in "defer" mode it also skips
 * mounting the React subtree until the user scrolls near it.
 */
export function LazySection({
  children,
  className,
  mode = "paint",
  minHeight = "60vh",
  rootMargin = "800px 0px",
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(mode === "paint");

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;
    if (!("IntersectionObserver" in window)) {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: `auto ${minHeight}`,
        minHeight: mounted ? undefined : minHeight,
      }}
    >
      {mounted ? children : null}
    </div>
  );
}
