import { notFound } from "next/navigation";
import { adminGet } from "@/lib/projects";
import { supabaseReady } from "@/lib/supabase";
import Editor from "./Editor";

export const dynamic = "force-dynamic";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  if (!supabaseReady) notFound();
  const row = await adminGet((await params).id);
  if (!row) notFound();
  return (
    <Editor
      id={row.id}
      initial={{
        slug: row.slug,
        title: row.title,
        industry: row.industry,
        client: row.client,
        year: row.year,
        experience: row.experience,
        liveUrl: row.live_url ?? "",
        cover: { ...row.cover, ph: row.cover?.ph || "p1" },
        coverVideo: { src: row.cover_video?.src ?? "", poster: row.cover_video?.poster ?? "" },
        sections: Array.isArray(row.sections) ? row.sections : [],
        featured: row.featured !== false,
        published: row.published,
      }}
    />
  );
}
