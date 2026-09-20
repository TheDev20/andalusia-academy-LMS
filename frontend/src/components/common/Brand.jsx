import React from 'react';

export default function Brand({ href = '#home', onClick, className = '' }) {
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
