import type { Project } from "./types";
import { voltkos } from "./voltkos";
import { octo } from "./octo";
import { fylo } from "./fylo";

/**
 * Case studies, in the order they appear on the site.
 * To use real images: put files in /public/work/ and add `src: "/work/file.jpg"` to any Art object.
 */
export const projects: Project[] = [
  {
    slug: "wilson-real-estate",
    title: "Wilson Real Estate",
    cover: { ph: "pw1", alt: "Wilson Real Estate cover" },
    industry: "Real Estate",
    client: "Wilson Real Estate & Development",
    year: "2026", // TODO: confirm
    experience: "UX/UI Design",
    sections: [
      {
        type: "did",
        label: "what I did.",
        items: [
          {
            title: "UX Research",
            body: "Audited Wilson’s existing site to map every listing field and content gap, surfacing real inconsistencies that shaped the new data model.",
          },
          {
            title: "UI Design",
            body: "Designed Wilson’s full page system — homepage, listings, property detail, locations, services, about, contact — plus a dedicated paid-ads landing page, in a cream/charcoal/gold editorial visual language.",
          },
          {
            title: "Prototyping",
            body: "Built fully annotated wireframes at low- and high-fidelity, desktop and mobile, giving a direct implementation blueprint.",
          },
        ],
      },
      {
        type: "text",
        label: "about.",
        body: "Wilson Real Estate & Development offers coastal and investment land across northern Albania. The redesign turned a generic listings template into a premium property-discovery experience for buyers across the Albanian-speaking region and diaspora.",
      },
      { type: "image", art: { ph: "pw2" } },
      {
        type: "text",
        label: "challenges.",
        body: "The old site buried Wilson’s strongest asset — direct, verified ownership — inside an inconsistent, generic template. The challenge was making each listing instantly scannable while building a brand identity premium enough to match Wilson’s coastal, investment-led positioning.",
      },
      { type: "pair", arts: [{ ph: "pw3" }, { ph: "pw4" }] },
      {
        type: "text",
        label: "results.",
        body: "The redesign delivered a reusable property-card system, a clearer site-wide architecture, and one cohesive visual identity across every page — a buildable blueprint reflecting Wilson’s real differentiators instead of a generic template.",
      },
      { type: "image", art: { ph: "pw1" } },
    ],
  },
  voltkos,
  octo,
  fylo,
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
