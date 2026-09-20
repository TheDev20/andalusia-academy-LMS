import React from 'react';

export default function Badge({
  children,
  variant = 'bronze',
  dot = false,
  className = '',
  icon: Icon
}) {
  return (
    <span className={`academy-badge badge-${variant} ${className}`}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {Icon && <Icon size={12} className="badge-icon" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
