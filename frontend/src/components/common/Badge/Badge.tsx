import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { BADGE_ICON_SIZE } from "../../../constants/ui";
import "./Badge.css";

export interface BadgeProps {
  children: ReactNode;
  variant?: "bronze" | "gold" | "glass" | "emerald" | "subtle";
  dot?: boolean;
  className?: string;
  icon?: LucideIcon;
}

export default function Badge({
  children,
  variant = "bronze",
  dot = false,
  className = "",
  icon: Icon,
}: BadgeProps) {
  return (
    <span className={`academy-badge badge-${variant} ${className}`}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {Icon && <Icon size={BADGE_ICON_SIZE} className="badge-icon" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
