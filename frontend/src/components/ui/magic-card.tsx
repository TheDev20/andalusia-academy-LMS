import { useCallback, useRef } from "react";

import { cn } from "@/utils/utils";

interface MagicCardProps {
  children?: React.ReactNode;
  className?: string;
  mode?: "gradient";
  /** Radius of the glow that follows the pointer, in px. */
  gradientSize?: number;
  /** Colour of the glow painted over the card face. */
  gradientColor?: string;
  gradientOpacity?: number;
  /** Border highlight colours. */
  gradientFrom?: string;
  gradientTo?: string;
}

/**
 * A card whose border and face are lit by a glow that follows the pointer.
 * The pointer position is written to CSS variables on the element, so moving the mouse repaints the
 * gradients without re-rendering React or pulling in an animation library.
 */
export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const parked = `${-gradientSize}px`;

  const moveGlow = useCallback((x: string, y: string) => {
    ref.current?.style.setProperty("--mx", x);
    ref.current?.style.setProperty("--my", y);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    moveGlow(`${e.clientX - rect.left}px`, `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "group relative isolate overflow-hidden rounded-[inherit] border border-transparent",
        className,
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => moveGlow(parked, parked)}
      onPointerCancel={() => moveGlow(parked, parked)}
      style={
        {
          "--mx": parked,
          "--my": parked,
          background: `
            linear-gradient(var(--color-background) 0 0) padding-box,
            radial-gradient(${gradientSize}px circle at var(--mx) var(--my),
              ${gradientFrom},
              ${gradientTo},
              var(--color-border) 100%
            ) border-box
          `,
        } as React.CSSProperties
      }
    >
      <div className="bg-background absolute inset-px z-20 rounded-[inherit]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-px z-30 rounded-[inherit]"
        style={{
          opacity: gradientOpacity,
          background: `radial-gradient(${gradientSize}px circle at var(--mx) var(--my), ${gradientColor}, transparent 100%)`,
        }}
      />
      <div className="relative z-40">{children}</div>
    </div>
  );
}
