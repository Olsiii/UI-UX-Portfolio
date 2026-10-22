"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";

/**
 * Opening animation (~2.9s), plays on every full page load.
 *  1. Her photo opens up from the centre of a dark stage.
 *  2. "AN" rises on her left and "LA" on her right — she stands in for the "I".
 *  3. The photo narrows into a pink "I" while the letters close in: ANILA.
 *  4. The stage fades into the site and the word glides into the nav logo.
 *
 * Performance: everything that moves is a plain transform or opacity change on
 * a simple layer, so it runs on the GPU at any screen size. The photo is
 * "cropped" by four solid curtains sliding over it (not clip-path or masks),
 * and its soft edges are baked into the image file.
 *
 * The overlay is server-rendered so the site never flashes first.
 * <html> carries `intro-on` (locks scroll, hides the nav logo) and `intro-hold`
 * (pauses the page's own entrance animations until the stage has mostly faded).
 */

const PHOTO = "/intro/anila-intro.jpg?v=3";
const PHOTO_RATIO = 1080 / 1919; // photo file width / height
const FIGURE_X = 0.49; // horizontal centre of her figure in the photo (0–1)
const FIGURE_W = 0.36; // room to leave for her between the letters, as a share of photo height

// Inter metrics (per 1em) — used to line the photo slit and the logo up with the real glyphs.
const ASC = 0.96875;
const CONTENT = 0.96875 + 0.2412;
const CAP = 0.727;
const I_STEM = 0.13;
const PAD = 0.12; // horizontal padding on each letter mask (see .op-word > span in globals.css)

const EASE_OUT = "cubic-bezier(.22,1,.36,1)";
const EASE_IN_OUT = "cubic-bezier(.76,0,.24,1)";
const EASE_GLIDE = "cubic-bezier(.65,.05,.25,1)";

// Timeline (ms)
const T = {
  open: [0, 800],
  lettersStart: 350,
  letterStagger: 80,
  letterRise: 800,
  close: [1300, 600],
  handover: 1740,
  exit: 1950,
  bgFade: 700,
  fly: 950,
  release: 2750, // page entrance animations start once the word has landed
};

type Rect = { l: number; t: number; r: number; b: number }; // visible area, photo-local px

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const letters = (site.logo || "ANILA").split("");
  const iIndex = letters.findIndex((l) => l.toUpperCase() === "I");

  useEffect(() => {
    const html = document.documentElement;
    const stage = root.current;
    const w = word.current;
    const frame = frameRef.current;
    const img = photo.current;
    let cancelled = false;
    const anims: Animation[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    const finish = () => {
      html.classList.remove("intro-on", "intro-hold");
      if (stage) stage.style.display = "none";
    };

    if (!stage || !w || !frame || !img || iIndex < 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    stage.style.animation = "none"; // JS is running: the CSS no-JS fallback must not cut the intro short
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const ready = Promise.race([Promise.all([document.fonts?.ready, img.decode().catch(() => undefined)]), wait(1500)]);

    ready.then(() => {
      if (cancelled) return;

      // ---- measure everything before any animation touches layout ----
      const vh = window.innerHeight;
      const vw = document.documentElement.clientWidth;
      const F = parseFloat(getComputedStyle(w).fontSize);
      const P = PAD * F;
      const wBox = w.getBoundingClientRect();
      const spans = Array.from(w.querySelectorAll<HTMLSpanElement>(":scope > span"));
      // glyph boxes (strip the mask padding)
      const rects = spans.map((s) => {
        const r = s.getBoundingClientRect();
        return { left: r.left + P, right: r.right - P, top: r.top, width: r.width - 2 * P };
      });
      const iRect = rects[iIndex];
      const baseline = iRect.top + ((1 - CONTENT) / 2) * F + ASC * F; // line-height: 1

      const logo = document.querySelector<HTMLElement>(".nav .logo");
      let logoLeft = 0, logoBaseline = 0, logoSize = 0;
      if (logo) {
        const range = document.createRange();
        range.selectNodeContents(logo);
        const lr = range.getBoundingClientRect();
        logoSize = parseFloat(getComputedStyle(logo).fontSize);
        logoLeft = lr.left;
        logoBaseline = lr.top + ASC * logoSize;
      }

      // ---- place the photo so her figure stands exactly where the "I" goes ----
      const ph = vh;
      const pw = ph * PHOTO_RATIO;
      const iCenter = iRect.left + (iRect.width + 0.06 * F) / 2; // glyph centre (letter-spacing trims the box)
      const left = iCenter - pw * FIGURE_X;
      Object.assign(frame.style, { width: `${pw}px`, height: `${ph}px`, left: `${left}px` });

      // ---- how far apart the letters start ----
      const gapNow = rects[iIndex + 1].left - rects[iIndex - 1].right;
      const restW = rects[rects.length - 1].right - rects[0].left - gapNow;
      const gap = Math.min(ph * FIGURE_W, vw - restW - 24); // keep letters on screen on phones
      const push = Math.max(0, (gap - gapNow) / 2);

      // ---- curtain targets (visible area of the photo, photo-local px) ----
      const full: Rect = { l: 0, t: 0, r: pw, b: ph };
      const shut: Rect = { l: 0, t: ph / 2, r: pw, b: ph / 2 };
      const slit: Rect = {
        l: iCenter - left - (I_STEM / 2) * F,
        r: iCenter - left + (I_STEM / 2) * F,
        t: baseline - CAP * F,
        b: baseline,
      };
      const [cT, cB, cL, cR] = Array.from(frame.querySelectorAll<HTMLElement>(".op-curtain"));
      // each curtain is a solid panel; its resting position (no transform) sits just outside the photo
      const curtain = (rc: Rect) => ({
        top: `translate3d(0,${rc.t}px,0)`,
        bottom: `translate3d(0,${rc.b - ph}px,0)`,
        left: `translate3d(${rc.l}px,0,0)`,
        right: `translate3d(${rc.r - pw}px,0,0)`,
      });

      const go = (el: Element, kf: Keyframe[], o: KeyframeAnimationOptions) => {
        const a = el.animate(kf, { fill: "both", ...o });
        anims.push(a);
        return a;
      };
      const moveCurtains = (a: Rect, b: Rect, o: KeyframeAnimationOptions) => {
        const A = curtain(a), B = curtain(b);
        go(cT, [{ transform: A.top }, { transform: B.top }], o);
        go(cB, [{ transform: A.bottom }, { transform: B.bottom }], o);
        go(cL, [{ transform: A.left }, { transform: B.left }], o);
        go(cR, [{ transform: A.right }, { transform: B.right }], o);
      };

      // 1 — photo opens from the centre, with a gentle zoom-out
      go(frame, [{ opacity: 1 }, { opacity: 1 }], { duration: 1, fill: "forwards" });
      moveCurtains(shut, full, { duration: T.open[1], easing: EASE_IN_OUT });
      go(img, [{ transform: "scale(1.1)" }, { transform: "scale(1)" }], { duration: 1100, easing: EASE_OUT });

      // 2 — letters rise either side of her, 3 — then close in
      let k = 0;
      spans.forEach((s, i) => {
        if (i === iIndex) return;
        const dx = i < iIndex ? -push : push;
        go(s.firstElementChild!, [{ transform: "translate3d(0,110%,0)" }, { transform: "translate3d(0,0,0)" }], {
          duration: T.letterRise, delay: T.lettersStart + k++ * T.letterStagger, easing: EASE_OUT,
        });
        go(s, [{ transform: `translate3d(${dx}px,0,0)` }, { transform: "translate3d(0,0,0)" }], {
          duration: T.close[1], delay: T.close[0], easing: EASE_IN_OUT,
        });
      });

      // 3 — curtains narrow the photo into the "I" stem, then the pink glyph takes over
      moveCurtains(full, slit, { duration: T.close[1], delay: T.close[0], easing: EASE_IN_OUT, fill: "forwards" });
      go(frame, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: T.handover + 20, easing: "linear", fill: "forwards" });
      go(spans[iIndex].firstElementChild!, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: T.handover, easing: "linear" });

      // 4 — stage fades into the site; the word glides into the nav logo
      go(stage.querySelector(".op-bg")!, [{ opacity: 1 }, { opacity: 0 }], {
        duration: T.bgFade, delay: T.exit + 50, easing: "cubic-bezier(.4,0,.2,1)",
      });
      timers.push(setTimeout(() => html.classList.remove("intro-hold"), T.release));

      let fly: Animation;
      if (logo && logoSize) {
        const s = logoSize / F;
        const tx = logoLeft - (wBox.left + s * (rects[0].left - wBox.left));
        const ty = logoBaseline - (wBox.top + s * (baseline - wBox.top));
        fly = go(w, [
          { transform: "translate3d(0,0,0) scale(1)" },
          { transform: `translate3d(${tx}px,${ty}px,0) scale(${s})` },
        ], { duration: T.fly, delay: T.exit, easing: EASE_GLIDE });
      } else {
        fly = go(w, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: T.exit });
      }
      fly.finished.then(() => !cancelled && finish()).catch(() => undefined);
    });

    timers.push(setTimeout(finish, 7000)); // never trap the visitor

    // Cleanup only stops this run (React dev mode mounts effects twice); it doesn't end the intro.
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
    };
  }, [iIndex]);

  return (
    <div className="op-stage" ref={root} aria-hidden="true">
      <div className="op-bg" />
      <div className="op-frame" ref={frameRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={photo} className="op-photo" src={PHOTO} alt="" fetchPriority="high" />
        <i className="op-curtain t" />
        <i className="op-curtain b" />
        <i className="op-curtain l" />
        <i className="op-curtain r" />
      </div>
      <div className="op-word" ref={word}>
        {letters.map((ch, i) => (
          <span key={i} className={i === iIndex ? "is-i" : undefined}>
            <span>{ch}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
