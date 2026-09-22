import './Badge.css';
import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'bronze' | 'gold' | 'glass' | 'emerald' | 'subtle';
  dot?: boolean;
  className?: string;
  icon?: LucideIcon;
}

export default function Badge({
  children,
  variant = 'bronze',
  dot = false,
  className = '',
  icon: Icon
}: BadgeProps) {
  return (
    <span className={`academy-badge badge-${variant} ${className}`}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {Icon && <Icon size={12} className="badge-icon" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
