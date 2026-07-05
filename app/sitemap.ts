import type { MetadataRoute } from "next";
import { brand } from "@/lib/data/brand";
import { products } from "@/lib/data/products";
import { recipes } from "@/lib/data/recipes";
import { blogPosts } from "@/lib/data/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "",
    "/products",
    "/about",
    "/our-farms",
    "/quality-process",
    "/health-benefits",
    "/recipes",
    "/blogs",
    "/gallery",
    "/corporate-gifting",
    "/wholesale",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${brand.url}${path}`,
    lastModified: now,
    changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.6,
  }));

  return [
    ...staticPages,
    ...products.map((p) => ({
      url: `${brand.url}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...recipes.map((r) => ({
      url: `${brand.url}/recipes/${r.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...blogPosts.map((b) => ({
      url: `${brand.url}/blogs/${b.slug}`,
      lastModified: new Date(b.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
