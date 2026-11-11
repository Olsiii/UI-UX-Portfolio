import type { Metadata } from "next";
import GiantTitle from "@/components/GiantTitle";
import CopyEmail from "@/components/CopyEmail";
import ContactForm from "@/components/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="page">
      <div className="wrap">
        <GiantTitle lines={["Shoot a", "Request"]} className="ctop" />
        <div className="cgrid intro">
          <CopyEmail email={site.email} />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
