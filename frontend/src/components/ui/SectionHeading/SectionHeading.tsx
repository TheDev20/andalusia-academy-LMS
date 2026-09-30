import type { ReactNode } from "react";
import "./SectionHeading.css";

export interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className = ''
}: SectionHeadingProps) {
  return (
    <div className={`section-header align-${align} ${className}`}>
      <h2>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
