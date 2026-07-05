"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductVisualProps {
  src: string;
  alt: string;
  accent: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Product imagery with a graceful brand-gradient stage behind it.
 * If the image is missing (pre-asset-generation) the stage stands alone.
 */
export function ProductVisual({
  src,
  alt,
  accent,
  className,
  sizes = "(max-width: 768px) 90vw, 40vw",
  priority = false,
}: ProductVisualProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 90% at 50% 20%, ${accent}55, transparent 70%), linear-gradient(160deg, ${accent}33, transparent 60%)`,
      }}
    >
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-[opacity,transform] duration-1000 ease-(--ease-out-expo)",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
