import type { Art, Project, Section } from "@/data/types";
import { projects as staticProjects } from "@/data/projects";
import { db, supabaseReady } from "./supabase";

/**
 * Case studies come from Supabase when it is configured (and has at least one
 * published case study). Otherwise the site uses the ones written in /data,
 * so it keeps working before the admin panel is set up.
 */
export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  industry: string;
  client: string;
  year: string;
  experience: string;
  live_url: string | null;
  cover: Art;
  cover_video: { src: string; poster?: string } | null;
  sections: Section[];
  sort_order: number;
  featured: boolean;
  published: boolean;
  updated_at: string;
};

export const rowToProject = (r: ProjectRow): Project => ({
  slug: r.slug,
  title: r.title,
  cover: { ...r.cover, ph: r.cover?.ph || "p1" },
  featured: r.featured !== false,
  coverVideo: r.cover_video?.src ? r.cover_video : undefined,
  industry: r.industry,
  client: r.client,
  year: r.year,
  experience: r.experience,
  liveUrl: r.live_url || undefined,
  sections: Array.isArray(r.sections) ? r.sections : [],
});

export const projectToRow = (p: Project, sort_order: number) => ({
  slug: p.slug,
  title: p.title,
  industry: p.industry,
  client: p.client,
  year: p.year,
  experience: p.experience,
  live_url: p.liveUrl ?? null,
  cover: p.cover,
  cover_video: p.coverVideo ?? null,
  sections: p.sections,
  sort_order,
  featured: p.featured !== false,
  published: true,
});

/** Published case studies, in display order. */
export async function getProjects(): Promise<Project[]> {
  if (!supabaseReady) return staticProjects;
  try {
    const rows = await db<ProjectRow[]>("projects?select=*&published=eq.true&order=sort_order.asc,created_at.asc", { revalidate: 60 });
    return rows.length ? rows.map(rowToProject) : staticProjects;
  } catch (e) {
    console.error("Could not load case studies from Supabase, using the built-in ones.", e);
    return staticProjects;
  }
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

/** Everything, drafts included. Admin only. */
export const adminList = () => db<ProjectRow[]>("projects?select=*&order=sort_order.asc,created_at.asc");

export async function adminGet(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return undefined;
  return (await db<ProjectRow[]>(`projects?select=*&id=eq.${id}`))[0];
}
