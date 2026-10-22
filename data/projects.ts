import type { Project } from "./types";

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
  {
    slug: "voltkos",
    title: "VoltKos",
    cover: { ph: "pk1", alt: "VoltKos cover" },
    industry: "Energy · B2B",
    client: "VoltKos",
    year: "2026", // TODO: confirm
    experience: "Website & Portal",
    sections: [
      { type: "part", label: "Part 1", title: "Website Redesign" },
      {
        type: "did",
        label: "what I did.",
        items: [
          {
            title: "UX Research",
            body: "I analyzed the existing homepage to map its structure and design language, then planned the content flow for each new page.",
          },
          {
            title: "UI Design",
            body: "I designed the Services, About Us, How It Works and Contact pages as natural extensions of the homepage: black, white and neon lime, with bold editorial type and thin dividers.",
          },
          {
            title: "Prototyping",
            body: "I built desktop and mobile wireframes for every page, including the mobile navigation with a persistent “Apliko Tani” button.",
          },
        ],
      },
      {
        type: "text",
        label: "about.",
        body: "VoltKos is a B2B energy supplier in Kosovo. I expanded its homepage into a full website that explains its services, builds trust and makes it easy to request an offer.",
      },
      { type: "image", art: { ph: "pk2" } },
      {
        type: "text",
        label: "challenges.",
        body: "The new pages had to feel like part of the homepage without repeating it. I reused its components, such as the hero, icon rows, timeline and CTA blocks, and re-sequenced them for each page’s goal.",
      },
      { type: "pair", arts: [{ ph: "pk3" }, { ph: "pk4" }] },
      {
        type: "text",
        label: "results.",
        body: "The result is a consistent, scalable site with clear paths to contact and apply. I haven't measured its impact yet, as the work is at wireframe stage.",
      },
      { type: "part", label: "Part 2", title: "Customer Portal" },
      {
        type: "did",
        label: "what I did.",
        items: [
          {
            title: "UX Research",
            body: "I analyzed the existing portal to find where it fell short for business customers, then rebuilt its information architecture.",
          },
          {
            title: "UI Design",
            body: "I redesigned it in the VoltKos visual language, so it feels like an extension of the website.",
          },
          {
            title: "Prototyping",
            body: "I built a working prototype with five views (Overview, Consumption, Invoices, Contracts, Reports & Documents), a sign-in screen and mobile versions.",
          },
        ],
      },
      {
        type: "text",
        label: "about.",
        body: "The Customer Portal lets VoltKos clients track their consumption, invoices, contracts and reports without contacting the company manually.",
      },
      { type: "image", art: { ph: "pk4" } },
      {
        type: "text",
        label: "challenges.",
        body: "The old portal worked like a generic analytics dashboard. Every metric had equal weight, the chart and table repeated the same data, and nothing showed what needed action. I rebuilt it around what customers actually ask: is my account fine, and do I need to do anything?",
      },
      {
        type: "text",
        label: "what I changed.",
        body: "I replaced the equal KPI cards with a status greeting and an attention area for unpaid invoices and contract renewals. I removed the duplicated data, moved details to a dedicated Consumption page, and made invoices, contracts and documents easy to reach. The navigation also scales to customers with multiple locations and contracts. On mobile, the sidebar becomes a bottom tab bar.",
      },
      { type: "pair", arts: [{ ph: "pk1" }, { ph: "pk2" }] },
      {
        type: "text",
        label: "results.",
        body: "The new portal is clearer, more actionable and more self-service. I haven't measured its impact yet, as the work is at prototype stage.",
      },
      { type: "image", art: { ph: "pk3" } },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
