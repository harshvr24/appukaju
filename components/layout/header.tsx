"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "motion/react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { navLinks, brand } from "@/lib/data/brand";
import { useCartTotals } from "@/lib/stores/cart";
import { useUi } from "@/lib/stores/ui";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/shared/magnetic";

export function Header() {
  const pathname = usePathname();
  const { count } = useCartTotals();
  const mounted = useMounted();
  const { setNavOpen, setCartOpen, setSearchOpen } = useUi();
  const { scrollY } = useScroll();
  const pillOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-700"
      style={{ color: "var(--header-fg)" }}
    >
      <div className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-10">
        {/* Frosted pill that fades in once scrolled */}
        <motion.div
          aria-hidden
          style={{ opacity: pillOpacity }}
          className="glass absolute inset-x-3 top-3 bottom-3 -z-10 rounded-full md:inset-x-8"
        />

        <Link
          href="/"
          className="group flex flex-col leading-none"
          aria-label={`${brand.name} — home`}
        >
          <span className="font-display text-[1.35rem] font-semibold tracking-tight">
            Appu&nbsp;Kaju
          </span>
          <span className="eyebrow mt-0.5 text-[0.55rem] opacity-60">
            Since {brand.foundedYear}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-2 text-[0.82rem] font-medium tracking-wide transition-opacity duration-300 hover:opacity-100",
                pathname === link.href ? "opacity-100" : "opacity-70"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-px h-px origin-left bg-current transition-transform duration-500 ease-(--ease-out-expo)",
                  pathname === link.href ? "scale-x-100" : "scale-x-0"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="grid size-11 cursor-pointer place-items-center rounded-full transition-colors duration-300 hover:bg-current/10"
            >
              <Search className="size-[1.15rem]" strokeWidth={1.75} />
            </button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <button
              type="button"
              id="cart-button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart${mounted && count > 0 ? `, ${count} items` : ""}`}
              className="relative grid size-11 cursor-pointer place-items-center rounded-full transition-colors duration-300 hover:bg-current/10"
            >
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.75} />
              {mounted && count > 0 && (
                <span className="absolute right-1 top-1 grid size-4.5 place-items-center rounded-full bg-gold text-[0.6rem] font-bold text-cocoa">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className="grid size-11 cursor-pointer place-items-center rounded-full transition-colors duration-300 hover:bg-current/10"
            >
              <Menu className="size-[1.2rem]" strokeWidth={1.75} />
            </button>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
