import type { Section } from "@/data/types";

/**
 * The starting layout for a new case study. It mirrors the VoltKos case study:
 * what I did → about → wireframe/final slider → challenges → two detail shots →
 * tabbed screens → mobile → results. Empty media blocks stay hidden on the site
 * until images are added, so a half-filled case study never looks broken.
 *
 * Change this list to change what every new case study starts with.
 */
export function templateSections(): Section[] {
  const shot = { src: "", w: 0, h: 0, alt: "" };
  return [
    {
      type: "did",
      label: "what I did.",
      items: [
        { title: "UX Research", body: "" },
        { title: "UI Design", body: "" },
        { title: "Prototyping", body: "" },
      ],
    },
    { type: "text", label: "about.", body: "" },
    { type: "compare", label: "Homepage", before: { ...shot }, after: { ...shot } },
    { type: "text", label: "challenges.", body: "" },
    { type: "pair", ratio: "3 / 2", arts: [{ ph: "p1" }, { ph: "p8" }] },
    { type: "screens", label: "Screens", url: "", ratio: "16 / 10", tabs: [] },
    { type: "phones", label: "Mobile", bg: "#0b0b0b", fg: "#ffffff", items: [] },
    { type: "text", label: "results.", body: "" },
  ];
}
