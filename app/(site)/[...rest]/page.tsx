import { notFound } from "next/navigation";

/** Any URL that matches no page shows the site's own 404 (app/(site)/not-found.tsx). */
export default function CatchAll() {
  notFound();
}
