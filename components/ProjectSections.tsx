import type { Section } from "@/data/types";
import ArtBlock from "./ArtBlock";
import Compare from "./Compare";
import Phones from "./Phones";
import ScreenTabs from "./ScreenTabs";

export default function ProjectSections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s, i) => {
        switch (s.type) {
          case "part":
            return (
              <div className="part fade" key={i}>
                <span>{s.label}</span>
                <h2>{s.title}</h2>
              </div>
            );
          case "image":
            return <ArtBlock key={i} art={s.art} className="pimg fade" sizes="100vw" />;
          case "pair":
            return (
              <div className="ptwo" key={i}>
                {s.arts.map((a, j) => (
                  <ArtBlock key={j} art={a} className="fade" style={s.ratio ? { aspectRatio: s.ratio } : undefined} />
                ))}
              </div>
            );
          case "compare":
            // Blocks without their images yet (a case study in progress) are left out.
            if (!s.before.src || !s.after.src) return null;
            return <Compare key={i} before={s.before} after={s.after} label={s.label} labels={s.labels} crop={s.crop} />;
          case "screens":
            if (!s.tabs.some((t) => t.src)) return null;
            return <ScreenTabs key={i} tabs={s.tabs.filter((t) => t.src)} label={s.label} url={s.url} ratio={s.ratio} />;
          case "phones":
            if (!s.items.some((p) => p.src)) return null;
            return <Phones key={i} items={s.items.filter((p) => p.src)} label={s.label} bg={s.bg} fg={s.fg} />;
          case "did":
            if (!s.items.some((it) => it.body.trim())) return null;
            return (
              <div className="psec fade" key={i}>
                <h2 className="lab">{s.label}</h2>
                <div className="txt">
                  <div className="did">
                    {s.items.filter((it) => it.body.trim()).map((it) => (
                      <div key={it.title}>
                        <b>{it.title}</b>
                        <p>{it.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          case "text":
            if (!s.body.trim()) return null;
            return (
              <div className="psec fade" key={i}>
                <h2 className="lab">{s.label}</h2>
                <div className="txt">
                  <p className="just">{s.body}</p>
                </div>
              </div>
            );
        }
      })}
    </>
  );
}
