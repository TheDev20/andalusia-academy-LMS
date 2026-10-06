import { Link } from "react-router-dom";
import "./Brand.css";

export interface BrandProps {
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

export default function Brand({
  to = "/",
  href,
  onClick,
  className = "",
}: BrandProps) {
  const target = href || to;

  return (
    <Link
      to={target}
      className={`brand-link ${className}`}
      onClick={onClick}
      aria-label="Andalusia Academy home"
    >
      <img
        src="/images/andalusia-logo-clean.png"
        alt="Andalusia Academy — أكاديمية أندلسية"
        className="brand-logo-img"
      />
    </Link>
  );
}