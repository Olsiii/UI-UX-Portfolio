"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth, weighted scrolling (Lenis). It still moves the real page scroll, so
 * sticky elements, the footer parallax and scroll-driven reveals keep working.
 *
 * Feel: `lerp` is the main dial — lower = floatier and slower to settle,
 * higher = snappier. 0.07 is soft but not floaty; wheelMultiplier sets how far each scroll travels.
 */
let lenis: Lenis | null = null;

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenis = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 0.72,
      touchMultiplier: 1.4,
      smoothWheel: true,
      anchors: true,
      autoRaf: true,
    });

    // Hold still while the opening intro plays or the mobile menu is open.
    const html = document.documentElement;
    const sync = () =>
      html.classList.contains("intro-on") || html.classList.contains("menu-lock") ? lenis?.stop() : lenis?.start();
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mo.disconnect();
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // New page → start at the top instantly (no smooth glide from the old position).
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
