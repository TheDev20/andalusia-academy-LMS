import "./SectionHeading.css";

export interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  /** Heading level. Use "h1" when this is the page's main title. */
  as?: "h1" | "h2";
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "",
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div className={`section-header align-${align} ${className}`}>
      <Heading className="section-header-title">{title}</Heading>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
