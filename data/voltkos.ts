import type { Project } from "./types";

/** All VoltKos images live in /public/work/voltkos/. */
const img = (file: string) => `/work/voltkos/${file}`;

/**
 * VoltKos case study.
 *
 * Wireframes: `home-wire.webp` and `portal-overview-wire.webp` were generated from the
 * final designs as stand-ins. To use the real wireframes, export them at the same size
 * as the final screen and replace those two files (or point `before.src` to the new file).
 */
export const voltkos: Project = {
  slug: "voltkos",
  title: "VoltKos",
  cover: { ph: "pk1", src: img("cover.jpg"), alt: "VoltKos customer portal and mobile homepage" },
  coverVideo: { src: img("hero.mp4"), poster: img("hero-poster.jpg") },
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
    {
      type: "compare",
      label: "Homepage",
      before: { src: img("home-wire.webp"), w: 1920, h: 5779, alt: "VoltKos homepage wireframe" },
      after: { src: img("home.webp"), w: 1920, h: 5779, alt: "VoltKos homepage, final design" },
    },
    {
      type: "text",
      label: "challenges.",
      body: "The new pages had to feel like part of the homepage without repeating it. I reused its components, such as the hero, icon rows, timeline and CTA blocks, and re-sequenced them for each page’s goal.",
    },
    {
      type: "pair",
      ratio: "3 / 2",
      arts: [
        { ph: "pk3", src: img("home-detail-1.webp"), alt: "How it works: four-step timeline" },
        { ph: "pk4", src: img("home-detail-2.webp"), alt: "Why VoltKos and the personalised offer block" },
      ],
    },
    {
      type: "screens",
      label: "“Apliko Tani” application flow",
      url: "voltkos.com/apliko",
      ratio: "1600 / 1556",
      tabs: [
        { label: "1 · Contact", src: img("apply-1.webp"), w: 1600, h: 1556, alt: "Application step 1: contact person" },
        { label: "2 · Business", src: img("apply-2.webp"), w: 1600, h: 1556, alt: "Application step 2: business details" },
        { label: "3 · Consumption", src: img("apply-3.webp"), w: 1600, h: 1556, alt: "Application step 3: energy consumption" },
        { label: "4 · Notes", src: img("apply-4.webp"), w: 1600, h: 1556, alt: "Application step 4: additional information" },
        { label: "5 · Documents", src: img("apply-5.webp"), w: 1600, h: 1556, alt: "Application step 5: document upload" },
        { label: "Sent", src: img("apply-6.webp"), w: 1600, h: 1556, alt: "Application sent confirmation" },
      ],
    },
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
    {
      type: "compare",
      label: "Portal overview",
      before: { src: img("portal-overview-wire.webp"), w: 1920, h: 3605, alt: "Customer portal overview wireframe" },
      after: { src: img("portal-overview.webp"), w: 1920, h: 3605, alt: "Customer portal overview, final design" },
    },
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
    {
      type: "screens",
      label: "Portal views",
      url: "portal.voltkos.com",
      ratio: "1920 / 1180",
      tabs: [
        { label: "Overview", src: img("portal-overview.webp"), w: 1920, h: 3605, alt: "Portal: overview" },
        { label: "Consumption", src: img("portal-consumption.webp"), w: 1920, h: 3140, alt: "Portal: consumption" },
        { label: "Invoices", src: img("portal-invoices.webp"), w: 1920, h: 1839, alt: "Portal: invoices and payments" },
        { label: "Contracts", src: img("portal-contracts.webp"), w: 1920, h: 1839, alt: "Portal: supply contracts" },
        { label: "Reports", src: img("portal-reports.webp"), w: 1920, h: 1839, alt: "Portal: reports and documents" },
        { label: "Sign in", src: img("portal-signin.webp"), w: 1920, h: 1365, alt: "Portal: sign-in screen" },
      ],
    },
    {
      type: "phones",
      label: "Mobile",
      bg: "#D4FF3D",
      fg: "#060104",
      items: [
        { label: "Website homepage", src: img("m-home.webp"), w: 804, h: 8886, alt: "VoltKos mobile homepage" },
        { label: "Portal overview", src: img("m-portal.webp"), w: 804, h: 4974, alt: "Customer portal overview on mobile" },
        { label: "Portal sign in", src: img("m-signin.webp"), w: 804, h: 1748, alt: "Customer portal sign-in on mobile" },
      ],
    },
    {
      type: "text",
      label: "results.",
      body: "The new portal is clearer, more actionable and more self-service. I haven't measured its impact yet, as the work is at prototype stage.",
    },
  ],
};
