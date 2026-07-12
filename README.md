# Appu Kaju — Premium Dry Fruit Experience

A production-grade, cinematic ecommerce experience for **Appu Kaju** (Lucknow, since 1998), in an earthy editorial style — parchment, forest green and terracotta with big Zodiak serif headlines. The signature moment: **"The Appu Story"** — a pinned cinematic prologue starring Appu, a photorealistic elephant. Seven full-bleed scenes crossfade like a film (golden forest dawn → Appu → leaves becoming dry fruits → the gift box → the orchard inside the pouch → the harvest table) and end in a **Canvas-2D golden-particle formation of the wordmark** with the tagline *Nature's Finest. Delivered Fresh.*, before handing off into the catalogue.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC) · React 19 · TypeScript strict |
| Styling | Tailwind CSS v4 (design tokens in `app/globals.css` `@theme`) |
| Micro/UI animation | Framer Motion (`motion` v12) |
| Scroll choreography | GSAP 3 + ScrollTrigger, synced with Lenis smooth scroll |
| State | Zustand (+ `persist`) — cart, wishlist, recently viewed |
| Forms | React Hook Form + Zod |
| Fonts | Zodiak (serif display) + Satoshi (body) + Clash Display (numerals/eyebrows), self-hosted woff2 via `next/font/local` |

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
    hero-section.tsx    #   pinned 700vh "Appu Story" photo film (GSAP progress →
                        #   imperative crossfades; React state only at beat bounds)
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
One pinned 700vh ScrollTrigger plays seven stacked full-bleed photographs (`public/images/story/*.webp` via `scripts/fetch-story.mjs`, plus two scenes reused from `public/images/cinematic/`) as a scroll-scrubbed film with Ken Burns drift and smoothstep crossfades. Beat kinds drive the overlay content: minimal lower-third serif captions for story beats, a serif brand plaque on the gift beat (the AI pouch is deliberately unlabeled — HTML typography is always crisp), a six-treasure chip strip with benefit icons + product links on the harvest beat, and a finale where ~1,800 gold Canvas-2D particles (`components/home/particle-logo.tsx`) converge into the APPU KAJU wordmark. Whole photographs and 2D canvas only — no WebGL, no cutouts — so nothing can fringe or crash. React state changes only at beat boundaries; `--header-fg` flips to parchment while the dark film is pinned.

**Fallback:** `prefers-reduced-motion` renders `hero-fallback.tsx` — the same story as static editorial sections.

### Animation toolkit (`components/shared/` + `lib/animation/`)
Reusable, reduced-motion-aware building blocks — compose these instead of writing one-off scroll code:

| Utility | What it does | Used on |
|---|---|---|
| `LenisProvider` | Smooth scrolling synced to GSAP's ticker (`lib/animation/gsap-config.ts` registers ScrollTrigger once, with `ignoreMobileResize` so pins don't jump when the mobile URL bar collapses) | whole app (`app/layout.tsx`) |
| `Reveal` | Fade-up on scroll into view | everywhere |
| `TextReveal` | Masked serif text reveal, word-by-word or per-line | headings site-wide |
| `Parallax` (`parallax-image.tsx`) | Child drifts slower than scroll for depth | drop-in |
| `PinSection` | Pins children for N viewport-heights, exposes 0–1 progress via `--pin-progress` CSS var and `onProgress`; desktop-only by default | drop-in (the craft section's horizontal pin predates it) |
| `VideoScrub` | Pins a `<video>` and scrubs `currentTime` with scroll (rAF-coalesced seeks, iOS play/pause priming); poster fallback for reduced motion | ready — drop an mp4 in `public/` and pass `src` |
| `LazySection` | `content-visibility` paint skipping (SEO-safe default) or true deferred mounting (`mode="defer"`) | testimonials + recipes on `/` |
| `Marquee` / `Counter` / `TiltCard` / `Magnetic` / `AmbientParticles` | Micro-interactions | various |

Every utility bails to static content under `prefers-reduced-motion`, and a global CSS gate in `globals.css` hard-caps animation durations as a second layer.

### Theme morphing
`ThemeZone` interpolates `--page-bg` / `--page-fg` CSS vars as chapters scroll into view — the page background travels chocolate → cream → forest → cream → chocolate without any section seams.

### Images
All imagery is generated free via Pollinations.ai: `scripts/fetch-images.mjs` (site photography) and `scripts/fetch-cinematic.mjs` + `scripts/fetch-story.mjs` (the cinematic scene sets) — both rerun-safe via seed/marker caches. `ProductVisual` renders every image on a branded gradient stage derived from the product's accent color and degrades gracefully if a file is missing. Replace any file in `public/images/**` with real photography and it appears automatically.

## Ecommerce (demo mode)
Cart/wishlist persist in localStorage. Checkout validates with Zod across 3 animated steps and writes the order to `sessionStorage` for the confirmation page. **No payment is processed.** To go live: create a Razorpay order server-side in a route handler, mount Razorpay checkout in step 3 of `app/checkout/page.tsx`, and verify the signature in a confirmation handler.

## SEO / a11y / performance
- Metadata API on every route, `Organization`/`Product`/`FAQPage` JSON-LD, sitemap, robots, dynamic OG image.
- Radix primitives, focus-visible rings, skip link, `sr-only` hero narrative, reduced-motion respected globally (static `hero-fallback.tsx`).

## TODO before production
1. **Photography** — optionally replace AI imagery with real product shoots (paths in `lib/data/*.ts`).
2. **Payments** — Razorpay integration (structure ready, see above).
3. **Backend** — orders/enquiries currently stay client-side; wire the forms to an API or service.
4. Point `brand.url` DNS at the deployment and verify OG/sitemap URLs.
