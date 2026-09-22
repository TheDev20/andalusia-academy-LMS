import React from 'react';

export interface BrandProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

export default function Brand({ href = '#home', onClick, className = '' }: BrandProps) {
  return (
    <a
      className={`brand-link ${className}`}
      href={href}
      onClick={onClick}
      aria-label="Andalusia Academy home"
    >
      <img
        src="/images/andalusia-logo-clean.png"
        alt="Andalusia Academy — أكاديمية أندلسية"
        className="brand-logo-img"
      />
    </a>
  );
}
