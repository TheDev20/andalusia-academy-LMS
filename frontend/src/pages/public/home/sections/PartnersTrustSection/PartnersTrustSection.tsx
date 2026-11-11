import { Award, ShieldCheck, Cpu, Building2, Globe, Cloud } from "lucide-react";
import "./PartnersTrustSection.css";

export default function PartnersTrustSection() {
  const partners = [
    {
      name: "Microsoft Learn Partner",
      type: "Official .NET & Azure Curriculum",
      icon: Cloud,
      logo: "/images/logos/tech/microsoft-mark.svg",
      sub: "Enterprise Cloud & C# Standards",
    },
    {
      name: "AWS Academy Member",
      type: "Cloud Architecture & DevOps",
      icon: Globe,
      logo: "/images/logos/tech/aws.svg",
      sub: "Authorized Cloud Certification Prep",
    },
    {
      name: "Google Cloud Education",
      type: "BigQuery & Machine Learning",
      icon: Cpu,
      logo: "/images/logos/tech/google-cloud.svg",
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
          <h2 className="partners-heading">
            Trusted by Top Engineering Organizations & Cloud Providers
          </h2>
        </div>

        <div className="partners-grid">
          {partners.map((partner, pIdx) => {
            const Icon = partner.icon;
            return (
              <div key={pIdx} className="partner-card">
                <div className="partner-icon-frame">
                  {partner.logo ? (
                    <img src={partner.logo} alt="" width={24} height={24} className="partner-logo" />
                  ) : (
                    <Icon size={24} aria-hidden="true" />
                  )}
                </div>
                <div className="partner-info">
                  <h3 className="partner-name">{partner.name}</h3>
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
