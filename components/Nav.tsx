"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const links = [
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  // Go solid once the dark footer slides up under the nav (frosted glass over black looks muddy).
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const foot = document.querySelector("footer");
      const nav = document.querySelector<HTMLElement>(".nav");
      if (!foot || !nav) return;
      setSolid(foot.getBoundingClientRect().top < nav.getBoundingClientRect().bottom);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Full-screen menu on phones: lock the page behind it and close on Escape.
  useEffect(() => {
    document.documentElement.classList.toggle("menu-lock", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className={`nav${solid ? " solid" : ""}`} aria-label="Main">
      <div className="in">
        <Link className="logo" href="/">
          {site.logo}
        </Link>
        <div className={`menu${open ? " open" : ""}`}>
          <div className="links">
            {links.map((l) => (
              <Link key={l.href} href={l.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
          <button
            className="dots"
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span>
              <i />
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
