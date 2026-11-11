import Link from "next/link";
import { projects as builtIn } from "@/data/projects";
import { adminList, type ProjectRow } from "@/lib/projects";
import { supabaseReady } from "@/lib/supabase";
import { createProject, deleteProject, duplicateProject, importBuiltIn, moveProject, setPublished } from "../actions";
import ConfirmButton from "./ConfirmButton";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!supabaseReady) {
    return (
      <div className="adm-card">
        <h1>Connect the database</h1>
        <p className="adm-note">The site is showing the built-in case studies. To manage them here:</p>
        <ol className="adm-steps">
          <li>Create a project at supabase.com.</li>
          <li>
            Open SQL Editor, paste the contents of <code>supabase/schema.sql</code> and run it.
          </li>
          <li>
            Add <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> (Settings → API) to the environment
            variables, then redeploy.
          </li>
        </ol>
      </div>
    );
  }

  let rows: ProjectRow[];
  try {
    rows = await adminList();
  } catch (e) {
    console.error(e);
    return (
      <div className="adm-card">
        <h1>Can&apos;t reach the database</h1>
        <p className="adm-note">
          Check the Supabase URL and service-role key, and that <code>supabase/schema.sql</code> has been run.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Case studies</h1>
          <p className="adm-note">The order here is the order on the site. Drafts are hidden from visitors.</p>
        </div>
        <form action={createProject}>
          <button className="adm-btn primary">New case study</button>
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="adm-card adm-empty">
          <p>
            No case studies in the database yet, so the site is showing the {builtIn.length} built-in ones ({builtIn.map((p) => p.title).join(", ")}).
          </p>
          <form action={importBuiltIn}>
            <button className="adm-btn">Import them so they can be edited here</button>
          </form>
        </div>
      ) : (
        <ul className="adm-list">
          {rows.map((r, i) => (
            <li key={r.id}>
              <div className="adm-thumb">{r.cover?.src && <img src={r.cover.src} alt="" />}</div>
              <div className="adm-meta">
                <Link href={`/admin/projects/${r.id}`}>{r.title || "Untitled"}</Link>
                <span>
                  /works/{r.slug} · {r.client || "No client"}
                </span>
              </div>
              <span className="adm-row">
                {r.featured !== false && <span className="adm-badge">Home page</span>}
                <span className={`adm-badge${r.published ? " on" : ""}`}>{r.published ? "Published" : "Draft"}</span>
              </span>
              <div className="adm-actions">
                <form action={moveProject.bind(null, r.id, -1)}>
                  <button className="adm-icon" disabled={i === 0} aria-label="Move up" title="Move up">↑</button>
                </form>
                <form action={moveProject.bind(null, r.id, 1)}>
                  <button className="adm-icon" disabled={i === rows.length - 1} aria-label="Move down" title="Move down">↓</button>
                </form>
                <form action={setPublished.bind(null, r.id, !r.published)}>
                  <button className="adm-btn small">{r.published ? "Unpublish" : "Publish"}</button>
                </form>
                <Link className="adm-btn small" href={`/admin/projects/${r.id}`}>
                  Edit
                </Link>
                <form action={duplicateProject.bind(null, r.id)}>
                  <button className="adm-btn small">Duplicate</button>
                </form>
                <form action={deleteProject.bind(null, r.id)}>
                  <ConfirmButton className="adm-btn small danger" message={`Delete “${r.title}”? This can't be undone.`}>
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
