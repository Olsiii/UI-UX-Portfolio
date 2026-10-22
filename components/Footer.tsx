"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { site } from "@/data/site";

/** Black footer with the parallax reveal: it rises from behind the page as you reach the bottom. */
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ticking = false;

    const update = () => {
      ticking = false;
      const dist = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      const y = reduce.matches ? 0 : -Math.min(500, Math.max(0, dist) * 0.675);
      el.style.transform = y ? `translateY(${y}px)` : "none";
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <footer ref={ref}>
      <div className="wrap">
        <h4 className="ftitle">
          {site.footerTitle[0]}
          <br />
          {site.footerTitle[1]}
        </h4>
        <div className="fcta">
          <Link className="btn-w" href="/contact">
            Get in Touch
          </Link>
          <div className="soc">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="fbot">
          <div>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div>
            <span>Designed &amp; Developed</span>
            <span>
              by {site.firstName} {site.lastName}
            </span>
          </div>
          <div>
            <span>All rights reserved,</span>
            <span>
              {site.logo} ©{site.copyrightYear}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
