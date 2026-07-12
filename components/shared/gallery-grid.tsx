"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { ProductVisual } from "@/components/shared/product-visual";
import { Reveal } from "@/components/shared/reveal";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";

export interface GalleryItem {
  src: string;
  caption: string;
  accent: string;
  /** Row-span weight for the masonry rhythm. */
  tall?: boolean;
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {items.map((item, i) => (
          <Reveal key={item.src} delay={(i % 3) * 0.06} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(item)}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] text-left shadow-soft transition-shadow duration-500 hover:shadow-lift"
              aria-label={`View: ${item.caption}`}
            >
              <ProductVisual
                src={item.src}
                alt={item.caption}
                accent={item.accent}
                sizes="(max-width: 768px) 92vw, 30vw"
                className={`${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"} transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.04]`}
              />
              <span className="block bg-cashew px-5 py-3.5 text-xs font-medium tracking-wide text-chocolate/70">
                {item.caption}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={open.caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[66] grid place-items-center bg-cocoa/85 p-5 backdrop-blur-md"
            onClick={() => setOpen(null)}
          >
            <motion.figure
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } }}
              exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
              className="w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ProductVisual
                src={open.src}
                alt={open.caption}
                accent={open.accent}
                sizes="90vw"
                className="aspect-[4/3] rounded-[2rem] shadow-lift"
              />
              <figcaption className="mt-4 flex items-center justify-between text-sm text-cream/80">
                {open.caption}
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                  className="grid size-10 cursor-pointer place-items-center rounded-full border border-cream/25 transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  <X className="size-4" />
                </button>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
