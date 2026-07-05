import type { MetadataRoute } from "next";
import { brand } from "@/lib/data/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.name} — Premium Dry Fruits`,
    short_name: brand.name,
    description:
      "Small-batch premium dry fruits, packed fresh in Lucknow since 1998.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6ef",
    theme_color: "#2b1d14",
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  };
}
