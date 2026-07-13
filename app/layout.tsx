import type { Metadata, Viewport } from "next";
import { clashDisplay, satoshi, zodiak } from "@/lib/fonts";
import { brand } from "@/lib/data/brand";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Header } from "@/components/layout/header";
import { NavOverlay } from "@/components/layout/nav-overlay";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { SearchOverlay } from "@/components/shop/search-overlay";
import { CustomCursor } from "@/components/shared/custom-cursor";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — Premium Dry Fruits, Fresh from Lucknow Since ${brand.foundedYear}`,
    template: `%s · ${brand.name}`,
  },
  description:
    "India's most premium dry fruit experience. Small-batch cashews, Kashmiri almonds and walnuts, pistachios, raisins and dates — roasted, graded and packed fresh in Lucknow since 1998.",
  keywords: [
    "dry fruits",
    "premium cashews",
    "kaju",
    "Lucknow",
    "Kashmiri almonds",
    "dry fruit gifting",
  ],
  openGraph: {
    type: "website",
    siteName: brand.name,
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6efe1",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  legalName: brand.legalName,
  url: brand.url,
  foundingDate: String(brand.foundedYear),
  email: brand.email,
  telephone: brand.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: brand.city,
    addressRegion: brand.state,
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${satoshi.variable} ${zodiak.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <LenisProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-chocolate focus:px-5 focus:py-2.5 focus:text-cream"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <CustomCursor />
          <Header />
          <NavOverlay />
          <CartDrawer />
          <SearchOverlay />
          <main id="main">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
