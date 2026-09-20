import React from 'react';

export default function SectionHeading({
  badgeText,
  title,
  subtitle,
  align = 'center',
  className = ''
}) {
  return (
    <div className={`section-header align-${align} ${className}`}>
      {badgeText && (
        <div className="section-label">
          <span aria-hidden="true" />
          {badgeText}
        </div>
      )}
      <h2>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
