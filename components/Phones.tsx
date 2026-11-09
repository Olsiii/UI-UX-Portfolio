import type { CSSProperties } from "react";
import type { LabeledShot } from "@/data/types";

type Props = {
  items: LabeledShot[];
  label?: string;
  /** Background colour of the band behind the phones. */
  bg?: string;
  /** Text colour on that background. */
  fg?: string;
};

/** Seconds for a long screen to glide from top to bottom (about 140 design px per second). */
const duration = (w: number, h: number) => Math.max(4, Math.round(((h / w) * 402 - 874) / 140));

/**
 * A row of phone frames. Long mobile screens glide through on hover
 * (and play on their own on touch devices), so nothing traps the page scroll.
 */
export default function Phones({ items, label, bg = "#0b0b0b", fg = "#fff" }: Props) {
  return (
    <div className="fade">
      <div className="blk-head">
        <span>{label}</span>
        <span className="hint-hover">Hover a phone to scroll it</span>
      </div>
      <div className="phones" style={{ background: bg, color: fg } as CSSProperties}>
        {items.map((p) => (
          <figure className="phone" key={p.src}>
            <div className="phone-body">
              <div className="phone-screen" style={{ "--dur": `${duration(p.w, p.h)}s` } as CSSProperties}>
                <img src={p.src} alt={p.alt ?? p.label} width={p.w} height={p.h} loading="lazy" decoding="async" />
              </div>
            </div>
            <figcaption>{p.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
