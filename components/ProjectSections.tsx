import type { Section } from "@/data/types";
import ArtBlock from "./ArtBlock";

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
                  <ArtBlock key={j} art={a} className="fade" />
                ))}
              </div>
            );
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
