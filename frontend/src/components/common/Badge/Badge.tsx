import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { BADGE_ICON_SIZE } from "../../../constants/ui";

export type BadgeVariant =
  | "bronze"
  | "gold"
  | "cream"
  | "espresso"
  | "glass"
  | "emerald"
  | "subtle";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  icon?: LucideIcon;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  bronze: "bg-[#ae8a58]/12 text-[#75552d] border-[#ae8a58]/25",
  gold: "bg-[#d4a359]/15 text-[#ae8a58] border-[#d4a359]/30",
  cream: "bg-[#fdfbf7] text-[#5c4e3f] border-[#dfd7cc]",
  espresso: "bg-white/12 text-[#e8ded1] border-white/22",
  glass: "bg-white/40 text-[#43392f] border-white/60 backdrop-blur-sm",
  emerald: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  subtle: "bg-black/5 text-[#6f6456] border-black/5",
};

export default function Badge({
  children,
  variant = "bronze",
  dot = false,
  className = "",
  icon: Icon,
}: BadgeProps) {
  const variantClass = VARIANT_STYLES[variant] || VARIANT_STYLES.bronze;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold tracking-[0.9px] uppercase whitespace-nowrap ${variantClass} ${className}`.trim()}
    >
      {dot && (
        <span
          className="w-[5px] h-[5px] rounded-full bg-[#ae8a58] shrink-0"
          aria-hidden="true"
        />
      )}
      {Icon && (
        <Icon
          size={BADGE_ICON_SIZE}
          className="shrink-0"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
