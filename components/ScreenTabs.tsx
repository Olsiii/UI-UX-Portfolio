"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LabeledShot } from "@/data/types";

type Props = {
  tabs: LabeledShot[];
  label?: string;
  /** Text shown in the address bar of the browser frame. */
  url?: string;
  /** Aspect ratio of the visible area. Taller screens are cropped until "View full screen" is pressed. */
  ratio?: string;
};

const toNumber = (ratio: string) => {
  const [a, b] = ratio.split("/").map(Number);
  return a && b ? a / b : 1.6;
};

/**
 * Browser frame with a row of tabs, one screen at a time.
 * Long screens are cropped to the frame and expand in place, so the page
 * never has a second scroll area fighting the main one.
 */
export default function ScreenTabs({ tabs, label, url, ratio = "16 / 10" }: Props) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const win = useRef<HTMLDivElement>(null);
  const shot = tabs[active];
  const tall = shot.w / shot.h < toNumber(ratio) * 0.98;

  const pick = (i: number) => {
    setActive(i);
    setOpen(false);
  };
  const toggle = () => {
    setOpen((o) => !o);
    if (open) requestAnimationFrame(() => win.current?.scrollIntoView({ block: "nearest" }));
  };

  return (
    <div className="scr fade">
      <div className="blk-head">
        <span>{label}</span>
        <span>
          {active + 1} / {tabs.length}
        </span>
      </div>
      <div className="scr-tabs" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button key={t.src} type="button" role="tab" aria-selected={i === active} onClick={() => pick(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="win" ref={win}>
        <div className="win-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          {url && <span className="win-url">{url}</span>}
        </div>
        <div
          className={`win-view${tall && !open ? " cut" : ""}`}
          style={{ aspectRatio: tall && !open ? ratio : `${shot.w} / ${shot.h}` } as CSSProperties}
          role="tabpanel"
        >
          <img key={shot.src} src={shot.src} alt={shot.alt ?? shot.label} width={shot.w} height={shot.h} decoding="async" />
        </div>
      </div>
      {tall && (
        <button type="button" className="cmp-toggle" onClick={toggle} aria-expanded={open}>
          {open ? "Collapse" : "View full screen"}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d={open ? "M2 9l5-5 5 5" : "M2 5l5 5 5-5"} />
          </svg>
        </button>
      )}
    </div>
  );
}
