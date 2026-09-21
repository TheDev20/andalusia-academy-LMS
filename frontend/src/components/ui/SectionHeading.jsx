import React from 'react';

export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className = ''
}) {
  return (
    <div className={`section-header align-${align} ${className}`}>
      <h2>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
