import type { Project } from "./types";

/** All Octo Events images live in /public/work/octo/. */
const img = (file: string) => `/work/octo/${file}`;
const desk = (file: string, h: number, alt: string) => ({ src: img(file), w: 1440, h, alt });
const mob = (file: string, h: number, alt: string) => ({ src: img(file), w: 440, h, alt });

/**
 * Octo Events case study.
 *
 * TODO (Anila): the texts below are a first draft written from the screens. Please review and rewrite.
 * `home-wire.webp` was generated from the final homepage as a stand-in. To use the real
 * wireframe, export it at 1440 × 4496 and replace that file.
 */
export const octo: Project = {
  slug: "octo-events",
  title: "Octo Events",
  cover: { ph: "p8", src: img("cover.jpg"), alt: "Octo Events homepage on desktop and mobile" },
  coverVideo: { src: img("hero.mp4"), poster: img("hero-poster.jpg") },
  industry: "Events · Ticketing",
  client: "Octo Events",
  year: "2026", // TODO: confirm
  experience: "Website, Mobile & Emails",
  sections: [
    {
      type: "did",
      label: "what I did.",
      items: [
        {
          title: "UX Design",
          body: "I mapped the path from discovering an event to holding a ticket, and split the purchase into three clear steps: details and tickets, attendee names, then review and payment.",
        },
        {
          title: "UI Design",
          body: "I designed the homepage, the all-shows catalogue, the event page, the checkout and the account area in a soft mint-to-lilac gradient with dark navy actions.",
        },
        {
          title: "Mobile & Emails",
          body: "I designed the mobile homepage, sign in, sign up and password recovery, plus the emails a buyer receives: purchase, e-ticket, refund, cancellation and account messages.",
        },
      ],
    },
    {
      type: "text",
      label: "about.",
      body: "Octo Events is a ticketing platform for concerts, festivals, sports and more. Visitors browse what is on, open an event, and buy tickets online in a few steps.",
    },
    {
      type: "compare",
      label: "Homepage",
      before: desk("home-wire.webp", 4496, "Octo Events homepage wireframe"),
      after: desk("home.webp", 4496, "Octo Events homepage, final design"),
    },
    {
      type: "text",
      label: "the flow.",
      body: "Buying a ticket asks for several things at once: who is buying, which tickets, who is attending and how to pay. I kept one decision per step, with the order summary always visible on the right, so the buyer can see the total before paying.",
    },
    {
      type: "screens",
      label: "Ticket purchase flow",
      url: "octoevents.com/checkout",
      ratio: "1440 / 900",
      tabs: [
        { label: "1 · Details & tickets", ...desk("buy-1.webp", 2492, "Checkout step 1: buyer details and ticket selection") },
        { label: "2 · Attendee names", ...desk("buy-2.webp", 2152, "Checkout step 2: attendee names") },
        { label: "3 · Review", ...desk("buy-3.webp", 2263, "Checkout step 3: review the order") },
        { label: "Payment method", ...desk("buy-4.webp", 2182, "Choosing a payment method") },
        { label: "Card details", ...desk("buy-5.webp", 2487, "Entering card details") },
        { label: "Ready to pay", ...desk("buy-6.webp", 2234, "Payment method confirmed") },
        { label: "Confirmed", ...desk("buy-7.webp", 1603, "Order confirmed") },
      ],
    },
    {
      type: "screens",
      label: "Pages",
      url: "octoevents.com",
      ratio: "1440 / 900",
      tabs: [
        { label: "Homepage", ...desk("home.webp", 4496, "Homepage") },
        { label: "All shows", ...desk("shows.webp", 3621, "All shows catalogue") },
        { label: "Event page", ...desk("show.webp", 2932, "Event details page") },
        { label: "Account", ...desk("account.webp", 1813, "Account settings") },
      ],
    },
    {
      type: "phones",
      label: "Mobile",
      bg: "#06081E",
      fg: "#ffffff",
      items: [
        { label: "Homepage", ...mob("m-home.webp", 5924, "Mobile homepage") },
        { label: "Sign in", ...mob("m-signin.webp", 956, "Mobile sign in") },
        { label: "Sign up", ...mob("m-signup.webp", 956, "Mobile sign up") },
        { label: "Recover password", ...mob("m-recover.webp", 956, "Choose how to recover the password") },
        { label: "Recovery code", ...mob("m-recover-code.webp", 956, "Entering the recovery code") },
        { label: "New password", ...mob("m-recover-new.webp", 956, "Setting a new password") },
      ],
    },
    {
      type: "text",
      label: "emails.",
      body: "The experience continues after checkout. Every message a buyer can receive shares the same header, tone and layout: the ticket confirmation with its QR code, the e-ticket PDF, refunds, cancellations and account emails.",
    },
    {
      type: "screens",
      label: "Emails & e-ticket",
      url: "Inbox",
      ratio: "1440 / 900",
      tabs: [
        { label: "Ticket purchase", ...desk("mail-purchase.webp", 2121, "Ticket purchase email") },
        { label: "E-ticket PDF", ...desk("mail-ticket.webp", 2121, "E-ticket PDF") },
        { label: "Refund", ...desk("mail-refund.webp", 2121, "Ticket refund email") },
        { label: "Cancellation", ...desk("mail-cancelled.webp", 2121, "Event cancellation email") },
      ],
    },
    {
      type: "phones",
      label: "Account emails",
      bg: "#CDC6FF",
      fg: "#060104",
      items: [
        { label: "Reset password", ...mob("mail-reset.webp", 1208, "Reset password email") },
        { label: "Recovery code", ...mob("mail-code.webp", 1208, "Recovery code email") },
        { label: "Account approved", ...mob("mail-approved.webp", 1208, "Account approval email") },
      ],
    },
  ],
};
