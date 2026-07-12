"use client";

import { useEffect, useRef } from "react";
import { ensureGsap } from "@/lib/animation/gsap-config";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface VideoScrubProps {
  /** MP4/WebM source. Encode with frequent keyframes (`-g 15`) for smooth seeking. */
  src: string;
  /** Shown before metadata loads and as the reduced-motion fallback. */
  poster?: string;
  className?: string;
  /** Scroll distance the scrub spans, in viewport-heights (default 2). */
  length?: number;
  /** Extra content overlaid on the pinned video. */
  children?: React.ReactNode;
}

/**
 * Scroll-scrubbed video: the section pins for `length` viewport-heights and
 * scroll position drives `currentTime`, so the footage plays forward and
 * backward under the user's thumb. Seeks are rAF-coalesced (at most one per
 * frame) and eased slightly so mobile decoders keep up.
 *
 * Reduced-motion users get the poster (or the video's first frame) as a
 * plain, unpinned image.
 */
export function VideoScrub({
  src,
  poster,
  className,
  length = 2,
  children,
}: VideoScrubProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (reduced || !wrap || !video) return;
    const { gsap, ScrollTrigger } = ensureGsap();

    let target = 0;
    let current = 0;
    let raf = 0;
    const tick = () => {
      raf = 0;
      // Ease toward the target so fast flicks don't queue dozens of seeks.
      current += (target - current) * 0.35;
      if (Math.abs(target - current) < 0.01) current = target;
      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        video.currentTime = current;
      }
      if (current !== target) raf = requestAnimationFrame(tick);
    };

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: () => `+=${length * window.innerHeight}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (!Number.isFinite(video.duration)) return;
        target = self.progress * Math.max(0, video.duration - 0.05);
        if (!raf) raf = requestAnimationFrame(tick);
      },
    });

    // iOS only exposes frames for seeking after a play/pause handshake.
    const prime = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    if (video.readyState >= 1) prime();
    else video.addEventListener("loadedmetadata", prime, { once: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      st.kill();
      gsap.set(wrap, { clearProps: "all" });
    };
  }, [reduced, length]);

  if (reduced) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="h-full w-full object-cover" />
        ) : (
          <video src={src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
        )}
        {children}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={cn("relative h-screen overflow-hidden", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {children}
    </div>
  );
}
