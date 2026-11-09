/**
 * Artwork for a card or image slot.
 * - `ph` is a placeholder art class from globals.css (e.g. "pw1").
 * - Set `src` to a file in /public (e.g. "/work/wilson-cover.jpg") to show a real image instead.
 */
export type Art = {
  ph: string;
  src?: string;
  alt?: string;
};

/** A real screenshot with its pixel size (used by the showcase blocks). */
export type Shot = { src: string; w: number; h: number; alt?: string };
export type LabeledShot = Shot & { label: string };

export type Section =
  | { type: "part"; label: string; title: string }
  | { type: "text"; label: string; body: string }
  | { type: "did"; label: string; items: { title: string; body: string }[] }
  | { type: "image"; art: Art }
  /** Two images side by side. `ratio` (e.g. "3 / 2") overrides the default square. */
  | { type: "pair"; arts: [Art, Art]; ratio?: string }
  /** Drag slider: wireframe (`before`) against final design (`after`). Both images must be the same size. */
  | { type: "compare"; label?: string; before: Shot; after: Shot; labels?: [string, string]; crop?: string }
  /** Browser frame with tabs, one screen per tab. Screens taller than `ratio` scroll inside the frame. */
  | { type: "screens"; label?: string; url?: string; ratio?: string; tabs: LabeledShot[] }
  /** Row of phone frames on a coloured band. */
  | { type: "phones"; label?: string; bg?: string; fg?: string; items: LabeledShot[] };

export type Project = {
  slug: string;
  title: string;
  cover: Art;
  /** Optional looping video for the top of the project page (the cover image stays on the work cards). */
  coverVideo?: { src: string; poster?: string };
  industry: string;
  client: string;
  year: string;
  experience: string;
  liveUrl?: string;
  sections: Section[];
};

export type Testimonial = { quote: string; name: string; role: string };
