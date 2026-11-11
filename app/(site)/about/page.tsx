import type { Metadata } from "next";
import ArtBlock from "@/components/ArtBlock";
import GiantTitle from "@/components/GiantTitle";
import SectionHead from "@/components/SectionHead";
import Services from "@/components/Services";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "About" };

const plus = (
  <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M8 1v14M1 8h14" />
  </svg>
);

export default function AboutPage() {
  const logos = [...site.clients, ...site.clients];
  return (
    <main className="page">
      <div className="wrap">
        <GiantTitle lines={[site.firstName, site.lastName]} className="ahero" />
      </div>

      <div className="band">
        <div className="wrap">
          <SectionHead label="about." moreHref={site.cvUrl || "/contact"} moreLabel="Read.cv" />
          <p className="lead just fade">{site.aboutLead}</p>
          <div className="ab2 fade">
            <ArtBlock art={site.aboutPageImage} />
            <p className="small just">{site.aboutSmall}</p>
          </div>
          <div style={{ height: 110 }} />
        </div>
      </div>

      <div className="band">
        <div className="wrap">
          <SectionHead label="services." />
          <Services items={site.services} />
          <div className="marq" aria-label="Clients">
            <div className="mtrack">
              {logos.map((c, i) => (
                <b key={i} aria-hidden={i >= site.clients.length || undefined}>
                  <i />
                  {c}
                </b>
              ))}
            </div>
          </div>
          <div className="duo fade">
            <ArtBlock art={site.aboutPair[0]} />
            <ArtBlock art={site.aboutPair[1]} />
          </div>
        </div>
      </div>

      <div className="band">
        <div className="wrap">
          <SectionHead label="FAQs." />
          <div className="faq">
            <div />
            <div className="list fade">
              {site.faqs.map((f) => (
                <details key={f.q}>
                  <summary>
                    {f.q}
                    {plus}
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
