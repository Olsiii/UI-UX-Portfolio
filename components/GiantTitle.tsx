type Props = { lines: string[]; className?: string };

/** The huge uppercase title whose lines slide up on page load. */
export default function GiantTitle({ lines, className = "" }: Props) {
  return (
    <h1 className={`giant ${className}`}>
      {lines.map((line) => (
        <span className="l" key={line}>
          <span>{line}</span>
        </span>
      ))}
    </h1>
  );
}
