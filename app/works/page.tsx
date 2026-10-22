import type { Metadata } from "next";
import GiantTitle from "@/components/GiantTitle";
import { WorkGrid } from "@/components/WorkCard";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Work" };

export default function WorksPage() {
  return (
    <main className="page">
      <div className="wrap">
        <GiantTitle lines={["Work"]} className="wtop" />
        <p className="range intro">{site.workRange}</p>
        <WorkGrid items={projects} />
      </div>
    </main>
  );
}
