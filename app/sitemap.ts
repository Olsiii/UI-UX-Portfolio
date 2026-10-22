import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteUrl } from "@/data/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/works", "/about", "/contact", ...projects.map((p) => `/works/${p.slug}`)];
  return pages.map((path) => ({ url: `${siteUrl}${path}` }));
}
