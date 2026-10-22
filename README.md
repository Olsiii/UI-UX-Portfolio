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
| Case studies (Wilson Real Estate, VoltKos, …) | `data/projects.ts` |
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
`part` (Part 1 / Part 2 heading), `did` (what I did list), `text` (about / challenges / results), `image`, `pair` (two images side by side). Its page is created automatically at `/works/<slug>`.

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
