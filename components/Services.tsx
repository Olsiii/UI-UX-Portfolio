"use client";

import { useState } from "react";
import type { Art } from "@/data/types";
import ArtBlock from "./ArtBlock";

type Service = { name: string; art: Art };

/** Big italic service names; hovering one fades the rest and shows a tilted image behind it. */
export default function Services({ items }: { items: Service[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [tilt, setTilt] = useState(0);
  const shown = items[active ?? 0];

  return (
    <div className="svc">
      <div className={`pv${active !== null ? " on" : ""}`} style={{ rotate: `${tilt}deg` }} aria-hidden="true">
        <ArtBlock art={shown.art} className="pv-art" sizes="440px" />
      </div>
      {items.map((s, i) => (
        <h3
          key={s.name}
          onMouseEnter={() => {
            setActive(i);
            setTilt(Number((Math.random() * 10 - 5).toFixed(1)));
          }}
          onMouseLeave={() => setActive(null)}
        >
          {s.name}
        </h3>
      ))}
    </div>
  );
}
