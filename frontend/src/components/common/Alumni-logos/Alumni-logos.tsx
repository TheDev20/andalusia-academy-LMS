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

      <ul className="alumni-track" aria-label="Alumni employment partners">
        {companies.map((company) => (
          <li key={company.name} className="alumni-logo-item">
            <img
              src={company.logo}
              alt={company.name}
              className={`alumni-logo ${company.className}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
