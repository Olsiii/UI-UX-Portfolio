import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./admin.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

/** The admin panel has its own shell: none of the public site's intro, nav or background. */
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="adm">{children}</body>
    </html>
  );
}
