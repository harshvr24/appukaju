"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  cartOpen: boolean;
  navOpen: boolean;
  searchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setNavOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUi = create<UiState>((set) => ({
  cartOpen: false,
  navOpen: false,
  searchOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setNavOpen: (navOpen) => set({ navOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));

interface RecentlyViewedState {
  slugs: string[];
  push: (slug: string) => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      slugs: [],
      push: (slug) =>
        set((state) => ({
          slugs: [slug, ...state.slugs.filter((s) => s !== slug)].slice(0, 8),
        })),
    }),
    { name: "appu-recently-viewed" }
  )
);
