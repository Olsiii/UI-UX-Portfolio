import Link from "next/link";
import GiantTitle from "@/components/GiantTitle";

export default function NotFound() {
  return (
    <main className="page">
      <div className="wrap" style={{ paddingBlock: "80px 160px" }}>
        <GiantTitle lines={["404"]} />
        <p className="hello" style={{ textIndent: 0, marginTop: 40 }}>
          This page doesn&apos;t exist. <Link href="/" style={{ textDecoration: "underline" }}>Go home</Link>
        </p>
      </div>
    </main>
  );
}
