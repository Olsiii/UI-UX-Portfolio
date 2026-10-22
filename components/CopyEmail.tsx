"use client";

import { useRef, useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const selectText = () => {
    const node = textRef.current;
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      selectText();
    }
  };

  return (
    <button className={`copy${copied ? " done" : ""}`} type="button" onClick={copy}>
      <span ref={textRef}>{email}</span>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" />
        <path d="M13 7V3H3v10h4" />
      </svg>
      <span className="tip">{copied ? "Copied!" : "Copy to Clipboard"}</span>
    </button>
  );
}
