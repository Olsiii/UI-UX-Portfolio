"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolling is the browser's own (no scroll library), so it feels the same as
 * every other site on the visitor's device. This only makes sure a new page
 * starts at the top.
 *
 * The previous Lenis version is in git history if the weighted feel is wanted back.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
