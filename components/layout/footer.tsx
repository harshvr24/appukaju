import Link from "next/link";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import { fullNav, brand } from "@/lib/data/brand";

export function Footer() {
  return (
    <footer className="noise relative overflow-hidden bg-forest-deep text-parchment">
      <div className="mx-auto max-w-[1600px] px-5 pt-24 pb-10 md:px-10">
        {/* Oversized CTA */}
        <div className="mb-20 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-5 text-gold">Taste the difference</p>
            <p className="text-serif max-w-3xl text-[clamp(2.6rem,6.5vw,5.5rem)] text-parchment">
              A handful of health, <span className="text-gold-shimmer">delivered fresh</span> from Lucknow.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex h-14 shrink-0 items-center gap-3 rounded-full bg-terracotta px-9 font-medium text-parchment transition-all duration-500 ease-(--ease-out-expo) hover:bg-terracotta-deep"
          >
            Shop the collection
            <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <hr className="gold-hairline origin-center opacity-40 [animation:divider-in_1.4s_var(--ease-out-expo)_both]" />

        {/* Link columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <p className="text-serif text-2xl font-bold">Appu Kaju</p>
            <p className="eyebrow mt-1 text-[0.6rem] text-parchment/50">
              Since {brand.foundedYear} · {brand.city}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-parchment/60">
              A family factory and shop delivering crunchy, healthy, delicious
              dry fruits across India for over {new Date().getFullYear() - brand.foundedYear} years.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-parchment/70">
              <a href={brand.phoneHref} className="flex items-center gap-2.5 transition-colors hover:text-gold">
                <Phone className="size-3.5 text-gold" /> {brand.phone}
              </a>
              <a href={brand.emailHref} className="flex items-center gap-2.5 transition-colors hover:text-gold">
                <Mail className="size-3.5 text-gold" /> {brand.email}
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin className="size-3.5 text-gold" /> {brand.city}, {brand.state}
              </p>
            </div>
          </div>

          {fullNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <p className="eyebrow mb-5 text-gold">{group.heading}</p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-parchment/65 transition-colors duration-300 hover:text-parchment"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Giant wordmark */}
        <div aria-hidden className="pointer-events-none select-none overflow-hidden">
          <p className="text-serif translate-y-[18%] bg-gradient-to-b from-parchment/12 to-parchment/0 bg-clip-text text-center text-[clamp(4rem,16vw,15rem)] leading-none text-transparent">
            APPU&nbsp;KAJU
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-parchment/10 pt-8 text-xs text-parchment/45 sm:flex-row">
          <p>© {new Date().getFullYear()} {brand.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-parchment">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-parchment">Terms</Link>
            <Link href="/faq" className="transition-colors hover:text-parchment">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
