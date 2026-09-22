import './SectionHeading.css';
import React from 'react';

export interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
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
