import Image from "next/image";
import type { Art } from "@/data/types";

type Props = { art: Art; className?: string; sizes?: string };

/** Shows a real image when `art.src` is set, otherwise the placeholder art. */
export default function ArtBlock({ art, className = "", sizes = "(max-width: 600px) 100vw, 50vw" }: Props) {
  if (art.src) {
    return (
      <div className={`ph has-img ${className}`}>
        <Image src={art.src} alt={art.alt ?? ""} fill sizes={sizes} />
      </div>
    );
  }
  return <div className={`ph ${art.ph} ${className}`} role="img" aria-label={art.alt ?? "Image placeholder"} />;
}
