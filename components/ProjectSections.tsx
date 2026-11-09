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
            return <Compare key={i} before={s.before} after={s.after} label={s.label} labels={s.labels} crop={s.crop} />;
          case "screens":
            return <ScreenTabs key={i} tabs={s.tabs} label={s.label} url={s.url} ratio={s.ratio} />;
          case "phones":
            return <Phones key={i} items={s.items} label={s.label} bg={s.bg} fg={s.fg} />;
          case "did":
            return (
              <div className="psec fade" key={i}>
                <h2 className="lab">{s.label}</h2>
                <div className="txt">
                  <div className="did">
                    {s.items.map((it) => (
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
