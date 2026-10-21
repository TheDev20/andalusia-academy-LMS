import { Award, ShieldCheck, Cpu, Building2, Globe, Cloud } from "lucide-react";
import "./PartnersTrustSection.css";

export default function PartnersTrustSection() {
  const partners = [
    {
      name: "Microsoft Learn Partner",
      type: "Official .NET & Azure Curriculum",
      icon: Cloud,
      sub: "Enterprise Cloud & C# Standards",
    },
    {
      name: "AWS Academy Member",
      type: "Cloud Architecture & DevOps",
      icon: Globe,
      sub: "Authorized Cloud Certification Prep",
    },
    {
      name: "Google Cloud Education",
      type: "BigQuery & Machine Learning",
      icon: Cpu,
      sub: "Modern Data Stack & AI Frameworks",
    },
    {
      name: "IEEE Computer Society",
      type: "Technical Curricula Alignment",
      icon: Award,
      sub: "Software Engineering Standards",
    },
    {
      name: "Regional Tech Consortium",
      type: "Direct Hiring & Talent Network",
      icon: Building2,
      sub: "240+ Hiring Corporate Partners",
    },
    {
      name: "Cybersecurity Defense Alliance",
      type: "OWASP & DevSecOps Benchmark",
      icon: ShieldCheck,
      sub: "Secure Coding Certification",
    },
  ];

  return (
    <section
      className="partners-section"
      aria-label="Partners and Accreditations"
    >
      <div className="section-container">
        <div className="partners-intro">
          <h3 className="partners-heading">
            Trusted by Top Engineering Organizations & Cloud Providers
          </h3>
        </div>

        <div className="partners-grid">
          {partners.map((partner, pIdx) => {
            const Icon = partner.icon;
            return (
              <div key={pIdx} className="partner-card">
                <div className="partner-icon-frame">
                  <Icon size={26} aria-hidden="true" />
                </div>
                <div className="partner-info">
                  <h4 className="partner-name">{partner.name}</h4>
                  <p className="partner-type">{partner.type}</p>
                  <span className="partner-sub">{partner.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
