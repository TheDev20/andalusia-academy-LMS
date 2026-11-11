import "./Alumni-logos.css";

const companies = [
  {
    name: "Google",
    logo: "/images/logos/google.svg",
    className: "google",
  },
  {
    name: "Microsoft",
    logo: "/images/logos/microsoft.svg",
    className: "microsoft",
  },
  {
    name: "Amazon",
    logo: "/images/logos/amazon.svg",
    className: "amazon",
  },
  {
    name: "Stripe",
    logo: "/images/logos/stripe.svg",
    className: "stripe",
  },
  {
    name: "Meta",
    logo: "/images/logos/meta.svg",
    className: "meta",
  },
  {
    name: "Netflix",
    logo: "/images/logos/netflix.svg",
    className: "netflix",
  },
  {
    name: "SAP",
    logo: "/images/logos/sap.svg",
    className: "sap",
  },
  {
    name: "Salesforce",
    logo: "/images/logos/salesforce.svg",
    className: "salesforce",
  },
  {
    name: "Intel",
    logo: "/images/logos/intel.svg",
    className: "intel",
  },
  {
    name: "Uber",
    logo: "/images/logos/uber.svg",
    className: "uber",
  },
  {
    name: "Adobe",
    logo: "/images/logos/adobe.svg",
    className: "adobe",
  },
  {
    name: "NVIDIA",
    logo: "/images/logos/nvidia.svg",
    className: "nvidia",
  },
  {
    name: "Oracle",
    logo: "/images/logos/oracle.svg",
    className: "oracle",
  },
];

/**
 * The ticker renders the list twice and slides the pair left by exactly one
 * list-width, so the loop is seamless. The visible window (see the CSS) is
 * narrower than one list, so the same company is never on screen twice at
 * once - keep the list long enough to preserve that if logos are removed.
 */
function LogoList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className="alumni-track"
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : "Alumni employment partners"}
    >
      {companies.map((company) => (
        <li key={company.name} className="alumni-logo-item">
          <img
            src={company.logo}
            alt={hidden ? "" : company.name}
            className={`alumni-logo ${company.className}`}
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );
}

export default function Alumni() {
  return (
    <div className="alumni">
      <span className="alumni-title">WHERE OUR ALUMNI ENGINEER THE FUTURE</span>

      <div className="alumni-marquee">
        <div className="alumni-marquee-inner">
          <LogoList />
          <LogoList hidden />
        </div>
      </div>
    </div>
  );
}
