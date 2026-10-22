import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtBlock from "@/components/ArtBlock";
import GiantTitle from "@/components/GiantTitle";
import SectionHead from "@/components/SectionHead";
import ProjectSections from "@/components/ProjectSections";
import { WorkGrid } from "@/components/WorkCard";
import { getProject, projects } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  return { title: p?.title ?? "Project" };
}

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const more = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <main className="page">
      <div className="wrap">
        <div className="meta intro">
          <div><span>Industry:</span>{project.industry}</div>
          <div><span>Client:</span>{project.client}</div>
          <div><span>Year:</span>{project.year}</div>
          <div><span>Experience:</span>{project.experience}</div>
        </div>
        <div className="ptop">
          <ArtBlock art={project.cover} className="intro" />
          <GiantTitle lines={[project.title]} className="ptitle case" />
        </div>
      </div>

      <div className="band">
        <div className="wrap">
          {project.liveUrl && (
            <div className="psec fade">
              <span />
              <div className="txt">
                <a className="more" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  See It Live
                </a>
              </div>
            </div>
          )}
          <ProjectSections sections={project.sections} />
          <div style={{ height: 60 }} />
        </div>
      </div>

      {more.length > 0 && (
        <div className="band">
          <div className="wrap">
            <SectionHead label="more to explore." moreHref="/works" />
            <WorkGrid items={more} />
          </div>
        </div>
      )}
    </main>
  );
}
