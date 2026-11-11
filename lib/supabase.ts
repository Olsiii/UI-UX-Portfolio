/**
 * Minimal Supabase client for the server (no SDK needed).
 * Uses the service-role key, so it must only ever be imported by server code:
 * pages, server actions and other files in /lib.
 */
const URL_ = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const BUCKET = process.env.SUPABASE_BUCKET || "portfolio";
export const supabaseReady = Boolean(URL_ && KEY);
/** Where uploaded media lives, e.g. https://xyz.supabase.co/storage/v1/object/public/ */
export const storageBase = URL_ ? `${URL_}/storage/v1/object/public/` : "";

const headers = () => ({ apikey: KEY, Authorization: `Bearer ${KEY}` });

type RestInit = { method?: string; body?: unknown; prefer?: string; revalidate?: number };

/** Call the database REST API, e.g. db("projects?select=*&order=sort_order"). */
export async function db<T>(path: string, init: RestInit = {}): Promise<T> {
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    method: init.method ?? "GET",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    ...(init.revalidate === undefined ? { cache: "no-store" as const } : { next: { revalidate: init.revalidate } }),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/** Public URL of a file in the media bucket. */
export const publicUrl = (path: string) => `${URL_}/storage/v1/object/public/${BUCKET}/${path}`;

/**
 * One-time upload link. The browser sends the file straight to Supabase with it,
 * so large images and videos never pass through this site's server.
 */
export async function signedUpload(path: string): Promise<{ uploadUrl: string; publicUrl: string }> {
  const res = await fetch(`${URL_}/storage/v1/object/upload/sign/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: "{}",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase storage ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const { url } = (await res.json()) as { url: string };
  return { uploadUrl: `${URL_}/storage/v1${url}`, publicUrl: publicUrl(path) };
}
