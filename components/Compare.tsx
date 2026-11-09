"use client";

import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import type { Shot } from "@/data/types";

type Props = {
  /** Left side of the handle (the wireframe). */
  before: Shot;
  /** Right side of the handle (the finished design). */
  after: Shot;
  label?: string;
  labels?: [string, string];
  /** Aspect ratio of the collapsed frame, e.g. "16 / 10". The full page shows when expanded. */
  crop?: string;
};

const clamp = (n: number) => Math.min(97, Math.max(3, n));

/** Drag-to-compare slider: wireframe on the left of the handle, final design on the right. */
export default function Compare({ before, after, label, labels = ["Wireframe", "Final design"], crop = "16 / 10" }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);
  const [open, setOpen] = useState(false);

  const move = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (r) setPos(clamp(((clientX - r.left) / r.width) * 100));
  };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    move(e.clientX);
  };
  const drag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) move(e.clientX);
  };
  const up = () => {
    dragging.current = false;
  };

  const key = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") setPos((p) => clamp(p - step));
    else if (e.key === "ArrowRight") setPos((p) => clamp(p + step));
    else if (e.key === "Home") setPos(3);
    else if (e.key === "End") setPos(97);
    else return;
    e.preventDefault();
  };

  const toggle = () => {
    setOpen((o) => !o);
    // Collapsing a long page: bring the frame back into view.
    if (open) requestAnimationFrame(() => frame.current?.scrollIntoView({ block: "nearest" }));
  };

  const style = {
    "--p": `${pos}%`,
    aspectRatio: open ? `${after.w} / ${after.h}` : crop,
  } as CSSProperties;

  return (
    <figure className={`cmp fade${open ? " open" : ""}`}>
      <div className="blk-head">
        <span>{label}</span>
        <span>Drag to compare</span>
      </div>
      <div
        className="cmp-frame"
        ref={frame}
        style={style}
        onPointerDown={down}
        onPointerMove={drag}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <img src={after.src} alt={after.alt ?? ""} width={after.w} height={after.h} loading="lazy" decoding="async" draggable={false} />
        <div className="cmp-wire">
          <img src={before.src} alt={before.alt ?? ""} width={before.w} height={before.h} loading="lazy" decoding="async" draggable={false} />
        </div>
        <span className="cmp-tag l">{labels[0]}</span>
        <span className="cmp-tag r">{labels[1]}</span>
        <div className="cmp-line">
          <button
            type="button"
            className="cmp-knob"
            role="slider"
            aria-label={`Compare ${labels[0].toLowerCase()} and ${labels[1].toLowerCase()}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={key}
            data-big
          >
            <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 1 1 7l6 6M19 1l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <button type="button" className="cmp-toggle" onClick={toggle} aria-expanded={open}>
        {open ? "Collapse" : "View full page"}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d={open ? "M2 9l5-5 5 5" : "M2 5l5 5 5-5"} />
        </svg>
      </button>
    </figure>
  );
}
