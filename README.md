# Appu Kaju — Premium Dry Fruit Experience

A production-grade, cinematic ecommerce experience for **Appu Kaju** (Lucknow, since 1998), built as one continuous scroll story on a white/yellow palette: a photographic packet hero hands off into six ingredient chapters — real photography revealed with masked wipes and Ken Burns motion — before combining into the Premium Mix finale.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC) · React 19 · TypeScript strict |
| Styling | Tailwind CSS v4 (design tokens in `app/globals.css` `@theme`) |
| Micro/UI animation | Framer Motion (`motion` v12) |
| Scroll choreography | GSAP 3 + ScrollTrigger, synced with Lenis smooth scroll |
| State | Zustand (+ `persist`) — cart, wishlist, recently viewed |
| Forms | React Hook Form + Zod |
| Fonts | Clash Display + Satoshi, self-hosted woff2 via `next/font/local` |

**Division of labor:** GSAP owns scroll-driven timelines · Framer Motion owns enter/hover/exit/layout. No WebGL — the hero is photographic, so it cannot jank or crash on weak GPUs.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (all routes prerender)
```

## Architecture

```
app/                    # one folder per route; RSC by default
components/
  home/                 # story chapters (hero, legacy, sourcing map, craft, …)
    hero-section.tsx    #   pinned 560vh photo-cinematic hero (GSAP progress →
                        #   imperative fades; React state only at chapter bounds)
  product/, shop/       # cards, detail, nutrition wheel, cart drawer, search
  shared/               # animation utilities (TextReveal, Reveal, Marquee,
                        #   Counter, TiltCard, Magnetic, Parallax, particles)
  layout/, ui/, forms/
lib/
  data/                 # typed mock data layer — products, ingredients, recipes,
                        #   blogs, faqs, farms, brand constants (swap for a CMS later)
  stores/               # zustand: cart, wishlist, ui
  hooks/                # reduced-motion, media-query, mounted
  animation/            # gsap config, easings, FM variants
```

### The hero, briefly
One pinned 560vh ScrollTrigger drives the story: intro headline + floating packet photo → gold-ring handoff → six ingredient chapters (arch-masked photo reveals + benefit panels from `lib/data/ingredients.ts`, photos in `public/images/hero/`) → Premium Mix finale with CTAs. Continuous values (fades, packet scale/exit) are set imperatively via `gsap.set` on refs; React state changes only at chapter boundaries, so scrolling never re-renders per frame.

**Fallback:** `prefers-reduced-motion` renders `hero-fallback.tsx` — the same story as static editorial sections.

### Theme morphing
`ThemeZone` interpolates `--page-bg` / `--page-fg` CSS vars as chapters scroll into view — the page background travels chocolate → cream → forest → cream → chocolate without any section seams.

### Images
`ProductVisual` renders every image on a branded gradient stage derived from the product's accent color; if the file is missing it degrades to the stage alone. The site currently ships **without photography** (image generation was blocked — see TODO). Drop real files into `public/images/{products,recipes,blog,gallery}/` with the paths in `lib/data/*.ts` and they appear automatically.

## Ecommerce (demo mode)
Cart/wishlist persist in localStorage. Checkout validates with Zod across 3 animated steps and writes the order to `sessionStorage` for the confirmation page. **No payment is processed.** To go live: create a Razorpay order server-side in a route handler, mount Razorpay checkout in step 3 of `app/checkout/page.tsx`, and verify the signature in a confirmation handler.

## SEO / a11y / performance
- Metadata API on every route, `Organization`/`Product`/`FAQPage` JSON-LD, sitemap, robots, dynamic OG image.
- Radix primitives, focus-visible rings, skip link, `sr-only` hero narrative, reduced-motion respected globally.
- Hero 3D is dynamically imported (`ssr:false`); Three.js never blocks first paint. DPR capped, physics instanced.

## TODO before production
1. **Photography** — generate/shoot the image set listed in `lib/data/*.ts` paths.
2. **Payments** — Razorpay integration (structure ready, see above).
3. **Backend** — orders/enquiries currently stay client-side; wire the forms to an API or service.
4. Point `brand.url` DNS at the deployment and verify OG/sitemap URLs.
