"use client";

import Link from "next/link";
import { Heart, Package, Clock, UserRound } from "lucide-react";
import { products } from "@/lib/data/products";
import { useWishlist } from "@/lib/stores/wishlist";
import { useRecentlyViewed } from "@/lib/stores/ui";
import { useMounted } from "@/lib/hooks/use-mounted";
import { PageHero } from "@/components/shared/page-hero";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const wishlistIds = useWishlist((s) => s.ids);
  const recentSlugs = useRecentlyViewed((s) => s.slugs);
  const mounted = useMounted();

  const wishlist = mounted
    ? wishlistIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : [];
  const recent = mounted
    ? recentSlugs
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .slice(0, 6)
    : [];

  return (
    <>
      <PageHero
        eyebrow="Your corner"
        title="Saved, seen, and on the way."
        lede="Wishlist and recently-viewed live on this device. Orders appear here after checkout — sign-in accounts arrive with the production launch."
      />

      <div className="mx-auto max-w-[1600px] space-y-20 px-5 pb-28 md:px-10">
        {/* Orders (demo) */}
        <section aria-labelledby="orders-h">
          <h2 id="orders-h" className="mb-6 flex items-center gap-3 font-display text-2xl font-semibold text-chocolate">
            <Package className="size-5 text-gold" /> Orders
          </h2>
          <div className="rounded-[2rem] border border-dashed border-chocolate/20 p-10 text-center">
            <p className="text-chocolate/60">
              Your most recent demo order appears on its confirmation page.
              Full order history unlocks with accounts at launch.
            </p>
            <Button asChild variant="dark" className="mt-6">
              <Link href="/products">Start an order</Link>
            </Button>
          </div>
        </section>

        {/* Wishlist */}
        <section aria-labelledby="wishlist-h">
          <h2 id="wishlist-h" className="mb-6 flex items-center gap-3 font-display text-2xl font-semibold text-chocolate">
            <Heart className="size-5 text-gold" /> Wishlist
            {mounted && wishlist.length > 0 && (
              <span className="text-base font-normal text-chocolate/50">({wishlist.length})</span>
            )}
          </h2>
          {wishlist.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-chocolate/20 p-10 text-center">
              <p className="text-chocolate/60">
                Tap the heart on any product to save it here.
              </p>
            </div>
          )}
        </section>

        {/* Recently viewed */}
        {recent.length > 0 && (
          <section aria-labelledby="recent-h">
            <h2 id="recent-h" className="mb-6 flex items-center gap-3 font-display text-2xl font-semibold text-chocolate">
              <Clock className="size-5 text-gold" /> Recently viewed
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Sign-in teaser */}
        <section className="rounded-[2rem] bg-cashew p-10 text-center shadow-soft">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold/15 text-gold">
            <UserRound className="size-6" strokeWidth={1.5} />
          </span>
          <p className="mt-5 font-display text-xl font-semibold text-chocolate">
            Accounts arrive with the production launch
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-chocolate/60">
            Order history, saved addresses and one-tap reorders — coming when
            payments go live.
          </p>
        </section>
      </div>
    </>
  );
}
