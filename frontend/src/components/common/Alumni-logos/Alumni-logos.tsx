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
];

export default function Alumni() {
  return (
    <div className="alumni">
      <span className="alumni-title">WHERE OUR ALUMNI ENGINEER THE FUTURE</span>

      <div className="alumni-marquee" aria-label="Alumni employment partners">
        <div className="alumni-track">
          {[...companies, ...companies].map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="alumni-logo-item"
              aria-hidden={index >= companies.length}
            >
              <img
                src={company.logo}
                alt={index >= companies.length ? "" : company.name}
                className={`alumni-logo ${company.className}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
