import type { MetadataRoute } from "next";
import { brand } from "@/lib/data/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/cart", "/account"],
      },
    ],
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
