import Link from "next/link";
import type { Project } from "@/data/types";
import ArtBlock from "./ArtBlock";

export default function WorkCard({ project }: { project: Project }) {
  return (
    <Link className="card fade" href={`/works/${project.slug}`} data-big>
      <ArtBlock art={project.cover} />
      <h3>{project.title}</h3>
    </Link>
  );
}

export function WorkGrid({ items }: { items: Project[] }) {
  return (
    <div className="grid">
      {items.map((p) => (
        <WorkCard key={p.slug} project={p} />
      ))}
    </div>
  );
}
