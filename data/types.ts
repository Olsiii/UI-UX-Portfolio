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

export type Section =
  | { type: "part"; label: string; title: string }
  | { type: "text"; label: string; body: string }
  | { type: "did"; label: string; items: { title: string; body: string }[] }
  | { type: "image"; art: Art }
  | { type: "pair"; arts: [Art, Art] };

export type Project = {
  slug: string;
  title: string;
  cover: Art;
  industry: string;
  client: string;
  year: string;
  experience: string;
  liveUrl?: string;
  sections: Section[];
};

export type Testimonial = { quote: string; name: string; role: string };
