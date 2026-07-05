import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
}

/** Infinite marquee — content is duplicated for a seamless loop. */
export function Marquee({
  children,
  className,
  duration = 30,
  reverse = false,
}: MarqueeProps) {
  return (
    <div
      className={cn("group flex overflow-hidden", className)}
      aria-hidden={false}
    >
      <div
        className="flex w-max shrink-0 items-center [animation:marquee-x_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
