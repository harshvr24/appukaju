import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { GalleryGrid, type GalleryItem } from "@/components/shared/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery — The Factory, The Farms, The Fruit",
  description:
    "A look inside the Appu Kaju world: the roasting drum, the grading table, the orchards and the packs.",
  alternates: { canonical: "/gallery" },
};

const ITEMS: GalleryItem[] = [
  { src: "/images/gallery/roasting-drum.webp", caption: "The 40 kg drum, mid-roast", accent: "#6b4a2e", tall: true },
  { src: "/images/gallery/grading-table.webp", caption: "Hand grading under daylight lamps", accent: "#e8d8c3" },
  { src: "/images/gallery/cashew-macro.webp", caption: "W180 Rimmee grade, up close", accent: "#f5efe4" },
  { src: "/images/gallery/kashmir-orchard.webp", caption: "Almond blossom, Kashmir valley", accent: "#a8c49a", tall: true },
  { src: "/images/gallery/packing-line.webp", caption: "Sealed and batch-dated, same day", accent: "#c6a15b" },
  { src: "/images/gallery/pista-batch.webp", caption: "Monday's pista batch, cooling", accent: "#a8c49a" },
  { src: "/images/gallery/hamper-making.webp", caption: "Utsav hampers, packed to order", accent: "#d4af37", tall: true },
  { src: "/images/gallery/konkan-yard.webp", caption: "Drying yard, Konkan coast", accent: "#9c6b3f" },
  { src: "/images/gallery/premium-mix.webp", caption: "The Premium Mix, Thursday blend", accent: "#c6a15b" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="The factory, the farms, the fruit."
        lede="No stock photos, no rented kitchens. This is what the work actually looks like."
      />
      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <GalleryGrid items={ITEMS} />
      </section>
    </>
  );
}
