"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Art, LabeledShot, Section, Shot } from "@/data/types";
import { createUpload, saveProject, type ProjectInput } from "../../../actions";

// ---------------------------------------------------------------- uploads

const isVideo = (src: string) => /\.(mp4|webm)(\?|$)/i.test(src);

/** Pixel size of an image file (needed by the slider, browser frame and phones). */
function measure(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) return resolve({ w: 0, h: 0 });
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ w: 0, h: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

async function upload(file: File) {
  const [{ uploadUrl, publicUrl }, size] = await Promise.all([createUpload(file.name), measure(file)]);
  const body = new FormData();
  body.append("cacheControl", "31536000");
  body.append("", file);
  const res = await fetch(uploadUrl, { method: "PUT", body, headers: { "x-upsert": "true" } });
  if (!res.ok) throw new Error(`Upload failed (${res.status}).`);
  return { src: publicUrl, ...size };
}

type MediaValue = { src: string; w?: number; h?: number };

/** File picker with a preview. A path like /work/file.jpg or an https link can also be pasted. */
function Media({ value, onChange, accept = "image/*", label }: { value: MediaValue; onChange: (v: MediaValue) => void; accept?: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await upload(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="adm-media">
      <span className="adm-flabel">{label}</span>
      <div className="adm-media-row">
        <div className="adm-preview">
          {value.src ? isVideo(value.src) ? <video src={value.src} muted playsInline /> : <img src={value.src} alt="" /> : <span>None</span>}
        </div>
        <div className="adm-media-side">
          <input ref={input} type="file" accept={accept} hidden onChange={(e) => pick(e.target.files?.[0])} />
          <div className="adm-row">
            <button type="button" className="adm-btn small" disabled={busy} onClick={() => input.current?.click()}>
              {busy ? "Uploading…" : value.src ? "Replace" : "Upload"}
            </button>
            {value.src && (
              <button type="button" className="adm-btn small" onClick={() => onChange({ src: "", w: 0, h: 0 })}>
                Remove
              </button>
            )}
          </div>
          <input
            className="adm-path"
            value={value.src}
            placeholder="or paste a path / link"
            aria-label={`${label} path`}
            onChange={(e) => onChange({ ...value, src: e.target.value })}
          />
          {error && <p className="adm-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- small fields

function Field({ label, value, onChange, area, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; area?: boolean; placeholder?: string; hint?: string }) {
  return (
    <label className="adm-field">
      <span className="adm-flabel">{label}</span>
      {area ? (
        <textarea value={value} placeholder={placeholder} rows={4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function ArtField({ label, value, onChange }: { label: string; value: Art; onChange: (v: Art) => void }) {
  return (
    <div className="adm-stack">
      <Media label={label} value={{ src: value.src ?? "" }} onChange={(m) => onChange({ ...value, src: m.src || undefined })} />
      <Field label="Description (for screen readers)" value={value.alt ?? ""} onChange={(alt) => onChange({ ...value, alt })} />
    </div>
  );
}

function ShotField({ label, value, onChange }: { label: string; value: Shot; onChange: (v: Shot) => void }) {
  return (
    <div className="adm-stack">
      <Media label={label} value={value} onChange={(m) => onChange({ ...value, src: m.src, w: m.w ?? value.w, h: m.h ?? value.h })} />
      <Field label="Description (for screen readers)" value={value.alt ?? ""} onChange={(alt) => onChange({ ...value, alt })} />
      {value.src && (!value.w || !value.h) && <SizeFix value={value} onChange={onChange} />}
    </div>
  );
}

/** A pasted path has no size yet: read it from the image itself. */
function SizeFix({ value, onChange }: { value: Shot; onChange: (v: Shot) => void }) {
  useEffect(() => {
    const img = new Image();
    img.onload = () => onChange({ ...value, w: img.naturalWidth, h: img.naturalHeight });
    img.src = value.src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.src]);
  return <small className="adm-warn">Reading the image size…</small>;
}

/** A reorderable list of labelled screens (browser tabs or phones). */
function ShotList({ items, onChange, noun }: { items: LabeledShot[]; onChange: (v: LabeledShot[]) => void; noun: string }) {
  const set = (i: number, v: LabeledShot) => onChange(items.map((it, j) => (j === i ? v : it)));
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="adm-sub">
      {items.map((it, i) => (
        <div className="adm-subitem" key={i}>
          <div className="adm-subhead">
            <b>
              {noun} {i + 1}
            </b>
            <div className="adm-row">
              <button type="button" className="adm-icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
              <button type="button" className="adm-icon" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
              <button type="button" className="adm-icon danger" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${noun.toLowerCase()}`}>×</button>
            </div>
          </div>
          <Field label="Label" value={it.label} onChange={(label) => set(i, { ...it, label })} />
          <ShotField label="Image" value={it} onChange={(s) => set(i, { ...it, ...s })} />
        </div>
      ))}
      <button type="button" className="adm-btn small" onClick={() => onChange([...items, { label: "", src: "", w: 0, h: 0 }])}>
        Add {noun.toLowerCase()}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- blocks

const emptyShot = (): Shot => ({ src: "", w: 0, h: 0 });

const BLOCKS: { type: Section["type"]; name: string; hint: string; make: () => Section }[] = [
  { type: "part", name: "Part heading", hint: "Splits a case study into parts (Part 1, Part 2).", make: () => ({ type: "part", label: "Part 1", title: "" }) },
  { type: "did", name: "What I did", hint: "A list of roles with a short description each.", make: () => ({ type: "did", label: "what I did.", items: [{ title: "", body: "" }] }) },
  { type: "text", name: "Text", hint: "A labelled paragraph: about, challenges, results.", make: () => ({ type: "text", label: "about.", body: "" }) },
  { type: "compare", name: "Wireframe / final slider", hint: "Drag slider. Both images must be the same size.", make: () => ({ type: "compare", label: "", before: emptyShot(), after: emptyShot() }) },
  { type: "screens", name: "Screens in a browser", hint: "One screen per tab. Long screens expand.", make: () => ({ type: "screens", label: "", url: "", ratio: "16 / 10", tabs: [] }) },
  { type: "phones", name: "Phones", hint: "A row of phone frames on a coloured band.", make: () => ({ type: "phones", label: "Mobile", bg: "#0b0b0b", fg: "#ffffff", items: [] }) },
  { type: "pair", name: "Two images", hint: "Side by side.", make: () => ({ type: "pair", ratio: "3 / 2", arts: [{ ph: "p1" }, { ph: "p8" }] }) },
  { type: "image", name: "Wide image", hint: "One full-width image.", make: () => ({ type: "image", art: { ph: "p1" } }) },
];
const blockName = (t: Section["type"]) => BLOCKS.find((b) => b.type === t)?.name ?? t;

function BlockFields({ s, set }: { s: Section; set: (s: Section) => void }) {
  switch (s.type) {
    case "part":
      return (
        <div className="adm-grid">
          <Field label="Small label" value={s.label} onChange={(label) => set({ ...s, label })} />
          <Field label="Heading" value={s.title} onChange={(title) => set({ ...s, title })} />
        </div>
      );
    case "text":
      return (
        <>
          <Field label="Label" value={s.label} onChange={(label) => set({ ...s, label })} />
          <Field label="Text" area value={s.body} onChange={(body) => set({ ...s, body })} />
        </>
      );
    case "did":
      return (
        <>
          <Field label="Label" value={s.label} onChange={(label) => set({ ...s, label })} />
          <div className="adm-sub">
            {s.items.map((it, i) => (
              <div className="adm-subitem" key={i}>
                <div className="adm-subhead">
                  <b>Item {i + 1}</b>
                  <button type="button" className="adm-icon danger" aria-label="Remove item" onClick={() => set({ ...s, items: s.items.filter((_, j) => j !== i) })}>×</button>
                </div>
                <Field label="Title" value={it.title} onChange={(title) => set({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, title } : x)) })} />
                <Field label="Description" area value={it.body} onChange={(body) => set({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, body } : x)) })} />
              </div>
            ))}
            <button type="button" className="adm-btn small" onClick={() => set({ ...s, items: [...s.items, { title: "", body: "" }] })}>
              Add item
            </button>
          </div>
        </>
      );
    case "image":
      return <ArtField label="Image" value={s.art} onChange={(art) => set({ ...s, art })} />;
    case "pair":
      return (
        <div className="adm-grid">
          <ArtField label="Left image" value={s.arts[0]} onChange={(a) => set({ ...s, arts: [a, s.arts[1]] })} />
          <ArtField label="Right image" value={s.arts[1]} onChange={(a) => set({ ...s, arts: [s.arts[0], a] })} />
        </div>
      );
    case "compare":
      return (
        <>
          <Field label="Label" value={s.label ?? ""} placeholder="Homepage" onChange={(label) => set({ ...s, label })} />
          <div className="adm-grid">
            <ShotField label="Wireframe (left)" value={s.before} onChange={(before) => set({ ...s, before })} />
            <ShotField label="Final design (right)" value={s.after} onChange={(after) => set({ ...s, after })} />
          </div>
          {s.before.w > 0 && s.after.w > 0 && (s.before.w !== s.after.w || s.before.h !== s.after.h) && (
            <p className="adm-warn">
              The two images are different sizes ({s.before.w}×{s.before.h} and {s.after.w}×{s.after.h}), so they won&apos;t line up. Export both at the same size.
            </p>
          )}
        </>
      );
    case "screens":
      return (
        <>
          <div className="adm-grid">
            <Field label="Label" value={s.label ?? ""} onChange={(label) => set({ ...s, label })} />
            <Field label="Address bar text" value={s.url ?? ""} placeholder="example.com/page" onChange={(url) => set({ ...s, url })} />
          </div>
          <ShotList noun="Screen" items={s.tabs} onChange={(tabs) => set({ ...s, tabs })} />
        </>
      );
    case "phones":
      return (
        <>
          <div className="adm-grid three">
            <Field label="Label" value={s.label ?? ""} onChange={(label) => set({ ...s, label })} />
            <label className="adm-field">
              <span className="adm-flabel">Band colour</span>
              <input type="color" value={s.bg ?? "#0b0b0b"} onChange={(e) => set({ ...s, bg: e.target.value })} />
            </label>
            <label className="adm-field">
              <span className="adm-flabel">Text colour</span>
              <input type="color" value={s.fg ?? "#ffffff"} onChange={(e) => set({ ...s, fg: e.target.value })} />
            </label>
          </div>
          <ShotList noun="Phone" items={s.items} onChange={(items) => set({ ...s, items })} />
        </>
      );
  }
}

// ---------------------------------------------------------------- editor

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function Editor({ id, initial }: { id: string; initial: ProjectInput }) {
  const [p, setP] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "error"; text?: string }>({ kind: "idle" });
  const [adding, setAdding] = useState(false);
  // The link name follows the title until it has been set by hand (or already saved once).
  const [slugLocked, setSlugLocked] = useState(!initial.slug.startsWith("new-case-study"));
  const dirty = JSON.stringify(p) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const patch = (v: Partial<ProjectInput>) => setP((old) => ({ ...old, ...v }));
  const setSection = (i: number, s: Section) => patch({ sections: p.sections.map((x, j) => (j === i ? s : x)) });
  const moveSection = (i: number, d: number) => {
    const next = [...p.sections];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    patch({ sections: next });
  };

  const save = async (override?: Partial<ProjectInput>) => {
    const data = { ...p, ...override };
    setStatus({ kind: "saving" });
    try {
      const res = await saveProject(id, data);
      if (res.ok) {
        setP(data);
        setSaved(data);
        setSlugLocked(true);
        setStatus({ kind: "ok", text: data.published ? "Saved and live." : "Saved as draft." });
      } else setStatus({ kind: "error", text: res.error });
    } catch {
      setStatus({ kind: "error", text: "Could not save. Check the connection and try again." });
    }
  };

  return (
    <div className="adm-editor">
      <div className="adm-bar">
        <Link href="/admin" className="adm-link" onClick={(e) => dirty && !window.confirm("Leave without saving your changes?") && e.preventDefault()}>
          ← Case studies
        </Link>
        <div className="adm-row">
          <span className={`adm-status ${status.kind}`} role="status">
            {status.kind === "saving" ? "Saving…" : status.text ?? (dirty ? "Unsaved changes" : "")}
          </span>
          <span className={`adm-badge${p.published ? " on" : ""}`}>{p.published ? "Published" : "Draft"}</span>
          {saved.published && (
            <a className="adm-btn small" href={`/works/${saved.slug}`} target="_blank" rel="noopener noreferrer">
              View ↗
            </a>
          )}
          <button type="button" className="adm-btn" disabled={status.kind === "saving"} onClick={() => save({ published: !p.published })}>
            {p.published ? "Unpublish" : "Save & publish"}
          </button>
          <button type="button" className="adm-btn primary" disabled={status.kind === "saving" || !dirty} onClick={() => save()}>
            Save
          </button>
        </div>
      </div>

      <section className="adm-card">
        <h2>Details</h2>
        <div className="adm-grid">
          <Field
            label="Title"
            value={p.title}
            onChange={(title) => patch(slugLocked ? { title } : { title, slug: slugify(title) || p.slug })}
          />
          <Field
            label="Link name"
            value={p.slug}
            hint={`The page address: /works/${p.slug || "…"}`}
            onChange={(slug) => {
              setSlugLocked(true);
              patch({ slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-") });
            }}
          />
          <Field label="Client" value={p.client} onChange={(client) => patch({ client })} />
          <Field label="Industry" value={p.industry} onChange={(industry) => patch({ industry })} />
          <Field label="Year" value={p.year} onChange={(year) => patch({ year })} />
          <Field label="Experience" value={p.experience} placeholder="UX/UI Design" onChange={(experience) => patch({ experience })} />
        </div>
        <Field label="Live site link (optional)" value={p.liveUrl} placeholder="https://" onChange={(liveUrl) => patch({ liveUrl })} />
        <label className="adm-check">
          <input type="checkbox" checked={p.featured} onChange={(e) => patch({ featured: e.target.checked })} />
          <span>
            Show on the home page
            <small>When off, it only appears on the Work page.</small>
          </span>
        </label>
      </section>

      <section className="adm-card">
        <h2>Cover</h2>
        <div className="adm-grid">
          <ArtField label="Cover image (work cards and the top of the page)" value={p.cover} onChange={(cover) => patch({ cover })} />
          <div className="adm-stack">
            <Media
              label="Hero video (optional, replaces the cover at the top of the page)"
              accept="video/mp4,video/webm"
              value={{ src: p.coverVideo.src }}
              onChange={(m) => patch({ coverVideo: { ...p.coverVideo, src: m.src } })}
            />
            <small>A short, silent loop. It plays automatically, so keep it under about 2 MB.</small>
          </div>
        </div>
      </section>

      <h2 className="adm-h">Page blocks</h2>
      <p className="adm-note">These appear on the page from top to bottom. Blocks with no images or text yet are skipped on the site.</p>

      {p.sections.map((s, i) => (
        <section className="adm-card adm-block" key={i}>
          <div className="adm-subhead">
            <h3>
              <span>{i + 1}</span> {blockName(s.type)}
            </h3>
            <div className="adm-row">
              <button type="button" className="adm-icon" disabled={i === 0} onClick={() => moveSection(i, -1)} aria-label="Move block up">↑</button>
              <button type="button" className="adm-icon" disabled={i === p.sections.length - 1} onClick={() => moveSection(i, 1)} aria-label="Move block down">↓</button>
              <button
                type="button"
                className="adm-icon danger"
                aria-label="Remove block"
                onClick={() => window.confirm(`Remove this “${blockName(s.type)}” block?`) && patch({ sections: p.sections.filter((_, j) => j !== i) })}
              >
                ×
              </button>
            </div>
          </div>
          <BlockFields s={s} set={(next) => setSection(i, next)} />
        </section>
      ))}

      <div className="adm-add">
        {adding ? (
          <div className="adm-card">
            <div className="adm-subhead">
              <h3>Add a block</h3>
              <button type="button" className="adm-link" onClick={() => setAdding(false)}>
                Cancel
              </button>
            </div>
            <div className="adm-choices">
              {BLOCKS.map((b) => (
                <button
                  type="button"
                  key={b.type}
                  onClick={() => {
                    patch({ sections: [...p.sections, b.make()] });
                    setAdding(false);
                  }}
                >
                  <b>{b.name}</b>
                  <span>{b.hint}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button type="button" className="adm-btn" onClick={() => setAdding(true)}>
            + Add block
          </button>
        )}
      </div>
    </div>
  );
}
