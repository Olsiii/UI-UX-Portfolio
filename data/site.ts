import type { Art } from "./types";

/** Everything personal on the site lives here. Placeholder values are marked TODO. */
export const site = {
  firstName: "Anila",
  lastName: "Merovci",
  logo: "ANILA",
  avatar: "/anila-portrait.jpg",
  email: "hello@anilamerovci.com", // TODO: real email
  phone: "+383 44 000 000", // TODO: real phone (or remove)
  copyrightYear: 2026,

  intro:
    "Hello, I'm a UI/UX designer crafting clean, intuitive digital products with 4 years of experience — based in Prishtina, working worldwide. Let's create!", // TODO

  aboutLead:
    "I design apps and websites for teams of every size, turning complex ideas into experiences people enjoy using every day.", // TODO
  aboutSmall:
    "I'm dedicated to designing interfaces that look beautiful, feel effortless, and help my clients reach their long-term goals.", // TODO
  aboutImage: { ph: "p5" } as Art,
  aboutPageImage: { ph: "p6" } as Art,
  aboutPair: [{ ph: "p1" }, { ph: "p8" }] as [Art, Art],

  workRange: "work 2022 - 2026",
  cvUrl: "", // TODO: link to CV (Read.cv, PDF in /public, etc.)

  socials: [
    { label: "Linkedin", href: "https://www.linkedin.com" }, // TODO
    { label: "Behance", href: "https://www.behance.net" }, // TODO
    { label: "Dribbble", href: "https://dribbble.com" }, // TODO
  ],

  services: [
    { name: "UX Research", art: { ph: "p1" } },
    { name: "UI Design", art: { ph: "p8" } },
    { name: "Prototyping", art: { ph: "p7" } },
    { name: "Design Systems", art: { ph: "p4" } },
    { name: "Web Design", art: { ph: "p5" } },
  ] as { name: string; art: Art }[],

  clients: ["Northwind", "Lumen", "Kora", "Fieldnote", "Orbit", "Atlas"], // TODO: real client names

  faqs: [
    {
      q: "What is your design process like?",
      a: "I start with research to understand your users and goals, map the key flows in wireframes, then design high-fidelity screens and a clickable prototype that we test before handoff.",
    },
    {
      q: "What is your typical project timeline?",
      a: "A landing page takes about two weeks. A full app or dashboard usually takes four to eight weeks, depending on the number of screens and testing rounds.",
    },
    {
      q: "How do I get started on a project with you?",
      a: "Send a short brief through the contact page. I'll reply within two working days to book a call and scope the work together.",
    },
    {
      q: "What should I do if you're fully booked?",
      a: "Get in touch anyway. I can reserve a slot for the next opening or recommend a designer I trust.",
    },
  ],

  footerTitle: ["Curious about what we can create together?", "Let's design something people love to use!"],
};
