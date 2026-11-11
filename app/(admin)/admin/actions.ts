"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Art, LabeledShot, Section, Shot } from "@/data/types";
import { projects as staticProjects } from "@/data/projects";
import { checkCredentials, endSession, requireAdmin, startSession } from "@/lib/auth";
import { adminGet, adminList, projectToRow, type ProjectRow } from "@/lib/projects";
import { db, signedUpload, storageBase } from "@/lib/supabase";
import { templateSections } from "@/lib/template";

/** Make the public pages pick up a change straight away. */
const refresh = () => revalidatePath("/", "layout");

// ---------- sign in / out ----------

export async function login(_: { error: string; email: string } | undefined, form: FormData) {
  const email = String(form.get("email") ?? "");
  const ok = checkCredentials(email, String(form.get("password") ?? ""));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 700)); // slows down guessing
    return { error: "Wrong email or password.", email: email.slice(0, 200) }; // email is handed back so the form keeps it
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---------- list actions ----------

/** Copy the case studies written in /data into the database (only when it is empty). */
export async function importBuiltIn() {
  await requireAdmin();
  if ((await adminList()).length === 0) {
    await db("projects", { method: "POST", body: staticProjects.map((p, i) => projectToRow(p, i)) });
  }
  refresh();
  revalidatePath("/admin");
}

async function freeSlug(base: string) {
  const taken = new Set((await adminList()).map((r) => r.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** New draft that starts from the case-study template. */
export async function createProject() {
  await requireAdmin();
  const rows = await adminList();
  const [row] = await db<ProjectRow[]>("projects", {
    method: "POST",
    prefer: "return=representation",
    body: {
      slug: await freeSlug("new-case-study"),
      title: "New case study",
      year: String(new Date().getFullYear()),
      cover: { ph: "p1" },
      sections: templateSections(),
      sort_order: rows.length,
      published: false,
    },
  });
  revalidatePath("/admin");
  redirect(`/admin/projects/${row.id}`);
}

export async function duplicateProject(id: string) {
  await requireAdmin();
  const src = await adminGet(id);
  if (!src) return;
  const { id: _id, updated_at: _u, ...rest } = src;
  const [row] = await db<ProjectRow[]>("projects", {
    method: "POST",
    prefer: "return=representation",
    body: { ...rest, slug: await freeSlug(`${src.slug}-copy`), title: `${src.title} (copy)`, published: false, sort_order: (await adminList()).length },
  });
  revalidatePath("/admin");
  redirect(`/admin/projects/${row.id}`);
}

export async function deleteProject(id: string) {
  await requireAdmin();
  if (!(await adminGet(id))) return;
  await db(`projects?id=eq.${id}`, { method: "DELETE" });
  refresh();
  revalidatePath("/admin");
}

export async function setPublished(id: string, published: boolean) {
  await requireAdmin();
  if (!(await adminGet(id))) return;
  await db(`projects?id=eq.${id}`, { method: "PATCH", body: { published, updated_at: new Date().toISOString() } });
  refresh();
  revalidatePath("/admin");
}

/** Move a case study one place up (-1) or down (1) in the order shown on the site. */
export async function moveProject(id: string, direction: -1 | 1) {
  await requireAdmin();
  const rows = await adminList();
  const from = rows.findIndex((r) => r.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= rows.length) return;
  [rows[from], rows[to]] = [rows[to], rows[from]];
  await Promise.all(rows.map((r, i) => (r.sort_order === i ? null : db(`projects?id=eq.${r.id}`, { method: "PATCH", body: { sort_order: i } }))));
  refresh();
  revalidatePath("/admin");
}

// ---------- uploads ----------

export async function createUpload(filename: string) {
  await requireAdmin();
  const dot = filename.lastIndexOf(".");
  const ext = (dot > 0 ? filename.slice(dot + 1) : "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!["jpg", "jpeg", "png", "webp", "avif", "gif", "svg", "mp4", "webm"].includes(ext)) {
    throw new Error("That file type isn't supported. Use JPG, PNG, WebP, AVIF, GIF, SVG, MP4 or WebM.");
  }
  const name = (dot > 0 ? filename.slice(0, dot) : filename).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "file";
  return signedUpload(`${Date.now().toString(36)}-${name}.${ext}`);
}

// ---------- save ----------

export type ProjectInput = {
  slug: string;
  title: string;
  industry: string;
  client: string;
  year: string;
  experience: string;
  liveUrl: string;
  cover: Art;
  coverVideo: { src: string; poster?: string };
  sections: Section[];
  featured: boolean;
  published: boolean;
};

const str = (v: unknown, max = 4000) => (typeof v === "string" ? v.slice(0, max) : "");
/** Media must be a file on this site ("/work/..."), an upload in the media bucket, or an https URL. */
const media = (v: unknown) => {
  const s = str(v, 600).trim();
  return (s.startsWith("/") && !s.startsWith("//")) || s.startsWith("https://") || (storageBase && s.startsWith(storageBase)) ? s : "";
};
const ratio = (v: unknown) => {
  const s = str(v, 30).trim();
  return /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(s) ? s : undefined;
};
const color = (v: unknown) => {
  const s = str(v, 12).trim();
  return /^#[0-9a-f]{3,8}$/i.test(s) ? s : undefined;
};
const num = (v: unknown) => (typeof v === "number" && isFinite(v) && v > 0 ? Math.round(v) : 0);
const art = (v: Partial<Art> | undefined): Art => ({ ph: /^p[a-z]?\d$/.test(str(v?.ph, 4)) ? str(v?.ph, 4) : "p1", src: media(v?.src) || undefined, alt: str(v?.alt, 300) || undefined });
const shot = (v: Partial<Shot> | undefined): Shot => ({ src: media(v?.src), w: num(v?.w), h: num(v?.h), alt: str(v?.alt, 300) || undefined });
const shots = (v: unknown): LabeledShot[] => (Array.isArray(v) ? v.slice(0, 20).map((t) => ({ ...shot(t), label: str(t?.label, 80) })) : []);

/** Keep only known block types and fields, so nothing unexpected is stored or rendered. */
function cleanSections(input: unknown): Section[] {
  if (!Array.isArray(input)) return [];
  const out: Section[] = [];
  for (const s of input.slice(0, 60)) {
    switch (s?.type) {
      case "part": out.push({ type: "part", label: str(s.label, 60), title: str(s.title, 120) }); break;
      case "text": out.push({ type: "text", label: str(s.label, 60), body: str(s.body) }); break;
      case "did":
        out.push({ type: "did", label: str(s.label, 60), items: (Array.isArray(s.items) ? s.items : []).slice(0, 12).map((it: { title?: unknown; body?: unknown }) => ({ title: str(it?.title, 80), body: str(it?.body, 1200) })) });
        break;
      case "image": out.push({ type: "image", art: art(s.art) }); break;
      case "pair": out.push({ type: "pair", arts: [art(s.arts?.[0]), art(s.arts?.[1])], ratio: ratio(s.ratio) }); break;
      case "compare": out.push({ type: "compare", label: str(s.label, 80) || undefined, before: shot(s.before), after: shot(s.after), crop: ratio(s.crop) }); break;
      case "screens": out.push({ type: "screens", label: str(s.label, 80) || undefined, url: str(s.url, 120) || undefined, ratio: ratio(s.ratio), tabs: shots(s.tabs) }); break;
      case "phones": out.push({ type: "phones", label: str(s.label, 80) || undefined, bg: color(s.bg), fg: color(s.fg), items: shots(s.items) }); break;
    }
  }
  return out;
}

export async function saveProject(id: string, input: ProjectInput): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const current = await adminGet(id);
  if (!current) return { ok: false, error: "This case study no longer exists." };

  const slug = str(input.slug, 80).trim().toLowerCase();
  const title = str(input.title, 120).trim();
  if (!title) return { ok: false, error: "Add a title." };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return { ok: false, error: "The link name can only use lowercase letters, numbers and dashes (e.g. wilson-real-estate)." };
  if ((await adminList()).some((r) => r.slug === slug && r.id !== id)) return { ok: false, error: `Another case study already uses the link name “${slug}”.` };

  const live = str(input.liveUrl, 300).trim();
  if (live && !/^https?:\/\//.test(live)) return { ok: false, error: "The live site link must start with https://" };

  const video = media(input.coverVideo?.src);
  try {
    await db(`projects?id=eq.${id}`, {
      method: "PATCH",
      body: {
        slug,
        title,
        industry: str(input.industry, 120),
        client: str(input.client, 120),
        year: str(input.year, 20),
        experience: str(input.experience, 120),
        live_url: live || null,
        cover: art(input.cover),
        cover_video: video ? { src: video, poster: media(input.coverVideo?.poster) || undefined } : null,
        sections: cleanSections(input.sections),
        featured: input.featured !== false,
        published: Boolean(input.published),
        updated_at: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Could not save. Check the connection and try again." };
  }
  refresh();
  revalidatePath("/admin");
  return { ok: true };
}
