import Image from "next/image";
import GiantTitle from "@/components/GiantTitle";
import CopyEmail from "@/components/CopyEmail";
import SectionHead from "@/components/SectionHead";
import { WorkGrid } from "@/components/WorkCard";
import ArtBlock from "@/components/ArtBlock";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function Home() {
  return (
    <main className="page">
      <div className="wrap">
        <div className="hero">
          <GiantTitle lines={[site.firstName, site.lastName]} />
          <Image className="avatar" src={site.avatar} alt={`${site.firstName} ${site.lastName}`} width={700} height={700} sizes="(max-width: 600px) 40vw, 26vw" priority />
        </div>
        <div className="hero-b intro">
          <CopyEmail email={site.email} />
          <p className="hello just">{site.intro}</p>
        </div>
      </div>

      <div className="band">
        <div className="wrap">
          <SectionHead label="work." moreHref="/works" />
          <WorkGrid items={projects.slice(0, 4)} />
        </div>
      </div>

      <div className="band">
        <div className="wrap">
          <SectionHead label="about." moreHref="/about" />
          <p className="lead just fade">{site.aboutLead}</p>
          <div className="about-row">
            <div />
            <div className="inner fade">
              <ArtBlock art={site.aboutImage} />
              <p className="small just">{site.aboutSmall}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
