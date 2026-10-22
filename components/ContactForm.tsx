"use client";

import { FormEvent, useState } from "react";
import { site } from "@/data/site";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

export default function ContactForm() {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setNote("Please add your name, a valid email, and a message.");
      return;
    }
    if (!FORMSPREE_ID) {
      setNote(`Thanks! This form isn't connected yet, so please email ${site.email} for now.`);
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setNote("Sent! I'll get back to you within two working days.");
    } catch {
      setNote(`Something went wrong sending your message. Please email ${site.email} directly.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <input id="name" name="name" placeholder="Your Name" aria-label="Your name" required />
      <input id="email" name="email" type="email" placeholder="Your Email" aria-label="Your email" required />
      <textarea id="message" name="message" placeholder="Your Masterpiece Starts Here" aria-label="Your message" required />
      <button className="send" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Send It!"}
      </button>
      <p className="fnote" aria-live="polite">
        {note}
      </p>
    </form>
  );
}
