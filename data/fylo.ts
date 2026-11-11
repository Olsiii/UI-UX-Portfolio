import type { Project } from "./types";

/** All Fylo images live in /public/work/fylo/. */
const img = (file: string) => `/work/fylo/${file}`;
const s = (label: string, file: string, alt?: string) => ({ label, src: img(`${file}.webp`), w: 375, h: 812, alt: alt ?? label });

/**
 * Fylo case study.
 *
 * TODO (Anila): the texts below are a first draft written from the screens. Please review and rewrite.
 */
export const fylo: Project = {
  slug: "fylo",
  title: "Fylo",
  cover: { ph: "p2", src: img("cover.jpg"), alt: "Three Fylo app screens" },
  coverVideo: { src: img("hero.mp4"), poster: img("hero-poster.jpg") },
  industry: "Dating · AI Coaching",
  client: "Fylo",
  year: "2026", // TODO: confirm
  experience: "Mobile App",
  sections: [
    {
      type: "did",
      label: "what I did.",
      items: [
        {
          title: "UX Design",
          body: "I designed the path from first launch to the first coaching session: onboarding, a short questionnaire that ends in a personal result, then the home screen with every way to get help.",
        },
        {
          title: "UI Design",
          body: "I designed the full app in a deep purple gradient with a lighter lavender theme, including chat, voice calls, coach booking, progress, account and subscriptions.",
        },
        {
          title: "Light & Dark",
          body: "I designed the main screens in both light and dark mode so the app stays comfortable to use at any time of day.",
        },
      ],
    },
    {
      type: "text",
      label: "about.",
      body: "Fylo is a dating coach in your pocket. It pairs an AI coach, available by chat or voice at any moment, with human coaches you can book for a live session.",
    },
    {
      type: "compare",
      label: "Light and dark mode",
      labels: ["Dark", "Light"],
      before: { src: img("modes-dark.webp"), w: 1920, h: 1200, alt: "Login, chat and voice recording screens in dark mode" },
      after: { src: img("modes-light.webp"), w: 1920, h: 1200, alt: "Login, chat and voice recording screens in light mode" },
    },
    {
      type: "phones",
      label: "Onboarding",
      bg: "#17153A",
      fg: "#ffffff",
      items: [s("Welcome", "onboard-screen1"), s("Go Live", "onboard-screen2"), s("Your coach", "onboard-screen3")],
    },
    {
      type: "text",
      label: "the questionnaire.",
      body: "Before any advice, Fylo gets to know the person. The questionnaire asks one thing per screen, mixes single choices with agree/disagree statements, shows progress at the top, and ends with a personal result and a first goal.",
    },
    {
      type: "phones",
      label: "Questionnaire",
      bg: "#E9E5F7",
      fg: "#060104",
      items: [
        s("Intro", "questionnaire1"),
        s("Single choice", "questionnaire3"),
        s("Statement rating", "questionnaire10"),
        s("Before and after", "questionnaire8"),
        s("First goal", "questionnaire7"),
        s("Result", "questionnaire15"),
      ],
    },
    {
      type: "text",
      label: "the coach.",
      body: "The home screen gives four direct ways in: call the AI coach, chat with it, book a human coach, or analyse a conversation. Booking a coach is a short flow: pick a coach, read about them, choose a date and send the request.",
    },
    {
      type: "phones",
      label: "Home and coaching",
      bg: "#17153A",
      fg: "#ffffff",
      items: [
        s("Home", "homepage-light-mode"),
        s("Chat with the AI coach", "chat-with-ai-light-mode"),
        s("Talk with the coach", "talk-with-coach"),
        s("Book a coach", "book-a-coach"),
        s("Coach profile", "book-a-coach-flow1"),
        s("Choose a date", "book-acoach-flow2"),
      ],
    },
    {
      type: "phones",
      label: "Progress and account",
      bg: "#E9E5F7",
      fg: "#060104",
      items: [s("Progress", "progress-screen"), s("Account", "account-screen"), s("Subscriptions", "subscriptions-screen")],
    },
  ],
};
