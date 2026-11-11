# Anila Merovci — Portfolio

Next.js 16 (App Router) + TypeScript + React 19. Requires Node 20.9+. No UI libraries; all styling is in `app/globals.css`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the build
```

## Edit content (no code changes needed)

| What | File |
|---|---|
| Name, email, phone, intro, about text, socials, services, client logos, FAQs | `data/site.ts` |
| Case studies (Wilson Real Estate, …) | `/admin` once set up, otherwise `data/projects.ts` |
| VoltKos case study | `data/voltkos.ts`, images in `public/work/voltkos/` |
| Profile photo | `public/anila.jpg` |

Lines marked `// TODO` are still placeholders.

### Adding real images

Put images in `public/work/` and add `src` to any image object:

```ts
cover: { ph: "pw1", src: "/work/wilson-cover.jpg", alt: "Wilson homepage" }
```

Without `src`, the tinted placeholder art (`ph`) is shown.

### Adding a project

Add an object to the `projects` array in `data/projects.ts`. Section types:
`part` (Part 1 / Part 2 heading), `did` (what I did list), `text` (about / challenges / results), `image`, `pair` (two images side by side).

Showcase blocks for real screens (see `data/voltkos.ts` for a full example; styles are in `app/showcase.css`):

| Type | What it shows |
|---|---|
| `compare` | Drag slider with the wireframe on the left and the final design on the right. Both images must be the same size. "View full page" expands it. |
| `screens` | Browser frame with tabs, one screen per tab. Long screens are cropped and expand with "View full screen". |
| `phones` | Row of phone frames on a coloured band. Long screens glide through on hover. | Its page is created automatically at `/works/<slug>`.

## Admin panel (`/admin`)

Case studies can be added, edited, reordered, published and deleted at `/admin`, with image and video uploads. Until it is set up, the site shows the case studies written in `data/`.

Setup (once):

1. Create a project at [supabase.com](https://supabase.com).
2. In Supabase → **SQL Editor**, paste the contents of `supabase/schema.sql` and run it. It creates the `projects` table and a public `portfolio` media bucket.
3. Add these environment variables (locally in `.env.local`, and on Vercel under Settings → Environment Variables), then redeploy:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` key (secret, never shared) |
| `ADMIN_EMAIL` | The email used to sign in at `/admin` |
| `ADMIN_PASSWORD` | The password (at least 8 characters) |
| `ADMIN_SESSION_SECRET` | Optional: any long random string |

4. Sign in at `/admin` and press **Import them so they can be edited here** to copy the existing case studies (Wilson, VoltKos) into the database.

How it works:

- **New case study** starts from the template in `lib/template.ts`, which mirrors the VoltKos layout. Change that file to change what new case studies start with.
- Blocks with no images or text yet are skipped on the site, so a half-filled case study never looks broken.
- **Draft** case studies are hidden from visitors. The order in the list is the order on the site.
- Uploads go straight from the browser to Supabase Storage. Changes show on the site right after saving.
- The public pages live in `app/(site)/`, the admin in `app/(admin)/`.

## Contact form

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_FORMSPREE_ID` to a Formspree form ID to receive messages by email. Without it, the form only validates.

## Brand

- Accent pink `#FA34E6` (logo + section labels) — `--pink` in `app/globals.css`
- Font: Inter (self-hosted via `@fontsource-variable/inter`)

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. On [vercel.com/new](https://vercel.com/new), import the repo. Framework preset **Next.js** is detected automatically; leave build settings as default.
3. Under **Environment Variables**, optionally add:
   - `NEXT_PUBLIC_FORMSPREE_ID` — enables the contact form.
   - `NEXT_PUBLIC_SITE_URL` — your custom domain (e.g. `https://anilamerovci.com`). Without it, the Vercel production URL is used for the sitemap and social previews.
4. Deploy. Add a custom domain under **Settings → Domains**.

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.
