"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { X, Phone, Mail } from "lucide-react";
import { fullNav, navLinks, brand } from "@/lib/data/brand";
import { useUi } from "@/lib/stores/ui";
import { getLenis } from "@/lib/lenis";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";

export function NavOverlay() {
  const { navOpen, setNavOpen } = useUi();
  const pathname = usePathname();

  // Close on route change and lock scroll while open.
  useEffect(() => setNavOpen(false), [pathname, setNavOpen]);
  useEffect(() => {
    const lenis = getLenis();
    if (navOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setNavOpen]);

  return (
    <AnimatePresence>
      {navOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{
            clipPath: "inset(0 0 0% 0)",
            transition: { duration: 0.8, ease: EASE_OUT_EXPO },
          }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.5, ease: [0.4, 0, 1, 1] },
          }}
          className="noise fixed inset-0 z-[60] overflow-y-auto bg-forest-deep text-parchment"
          data-lenis-prevent
        >
          <div className="mx-auto flex min-h-full max-w-[1600px] flex-col px-5 py-6 md:px-10">
            <div className="flex items-center justify-between">
              <span className="text-serif text-xl font-bold">
                Appu&nbsp;Kaju
              </span>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
                className="grid size-12 cursor-pointer place-items-center rounded-full border border-parchment/20 transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid flex-1 content-center gap-14 py-16 lg:grid-cols-[1.2fr_1fr]">
              {/* Hero links */}
              <nav aria-label="Main pages" className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <div key={link.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{
                        y: 0,
                        transition: {
                          duration: 0.9,
                          ease: EASE_OUT_EXPO,
                          delay: 0.15 + i * 0.06,
                        },
                      }}
                    >
                      <Link
                        href={link.href}
                        className="group flex items-baseline gap-4 py-1"
                      >
                        <span className="font-body text-xs text-gold">
                          0{i + 1}
                        </span>
                        <span className="text-serif text-[clamp(2.4rem,6vw,4.5rem)] text-parchment transition-colors duration-400 group-hover:text-gold">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </nav>

              {/* Secondary columns */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.45 },
                }}
                className="grid grid-cols-2 content-start gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
              >
                {fullNav.map((group) => (
                  <div key={group.heading}>
                    <p className="eyebrow mb-4 text-gold">{group.heading}</p>
                    <ul className="space-y-2.5">
                      {group.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-parchment/70 transition-colors duration-300 hover:text-parchment"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.8 } }}
              className="flex flex-wrap items-center justify-between gap-4 border-t border-parchment/10 py-6 text-sm text-parchment/60"
            >
              <p>
                {brand.city}, {brand.state} · Since {brand.foundedYear}
              </p>
              <div className="flex items-center gap-6">
                <a
                  href={brand.phoneHref}
                  className="flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Phone className="size-3.5" /> {brand.phone}
                </a>
                <a
                  href={brand.emailHref}
                  className="flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Mail className="size-3.5" /> {brand.email}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
