import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="adm-top">
        <Link href="/admin" className="adm-brand">
          Admin
        </Link>
        <nav>
          <a href="/" target="_blank" rel="noopener noreferrer">
            View site ↗
          </a>
          <form action={logout}>
            <button className="adm-link">Sign out</button>
          </form>
        </nav>
      </header>
      <main className="adm-main">{children}</main>
    </>
  );
}
