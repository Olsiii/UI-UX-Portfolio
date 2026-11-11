import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { siteUrl } from "@/data/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const pages = ["", "/works", "/about", "/contact", ...projects.map((p) => `/works/${p.slug}`)];
  return pages.map((path) => ({ url: `${siteUrl}${path}` }));
}
