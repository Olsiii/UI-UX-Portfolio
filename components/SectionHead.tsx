import Link from "next/link";

type Props = { label: string; moreHref?: string; moreLabel?: string };

/** Pink lowercase section label with an optional grey "Show More" button. */
export default function SectionHead({ label, moreHref, moreLabel = "Show More" }: Props) {
  const external = moreHref?.startsWith("http");
  return (
    <div className="shead fade">
      <h2 className="lab">{label}</h2>
      {moreHref &&
        (external ? (
          <a className="more" href={moreHref} target="_blank" rel="noopener noreferrer">
            {moreLabel}
          </a>
        ) : (
          <Link className="more" href={moreHref}>
            {moreLabel}
          </Link>
        ))}
    </div>
  );
}
