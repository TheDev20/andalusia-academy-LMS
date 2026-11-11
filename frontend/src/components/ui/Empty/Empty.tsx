/**
 * Composable empty-state primitives.
 *
 * Adapted from the "Empty" component by cnippet-dev on 21st.dev
 * (https://21st.dev/r/cnippet-dev/cnippet-empty), restyled with this
 * project's brand tokens. Compose as:
 *   <Empty><EmptyHeader><EmptyMedia variant="icon"><Icon /></EmptyMedia>
 *   <EmptyTitle>…</EmptyTitle><EmptyDescription>…</EmptyDescription>
 *   </EmptyHeader><EmptyContent>actions</EmptyContent></Empty>
 */
import type { ComponentProps, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/utils";

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-11 rounded-xl border border-brand-border bg-white text-brand-primary-hover shadow-sm",
      },
    },
  },
);

export function Empty({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-brand-border bg-white px-6 py-12 text-center text-balance",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-md flex-col items-center text-center", className)}
      {...props}
    />
  );
}

export function EmptyMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant }), "mb-4", className)}
      {...props}
    />
  );
}

/** Renders a heading element; pass `as` so it fits the page's heading order. */
export function EmptyTitle({
  as: Tag = "h2",
  className,
  ...props
}: ComponentProps<"h2"> & { as?: ElementType }) {
  return (
    <Tag
      data-slot="empty-title"
      className={cn("m-0 text-lg font-semibold text-brand-heading", className)}
      {...props}
    />
  );
}

export function EmptyDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "m-0 mt-1.5 text-sm leading-relaxed text-brand-muted [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex w-full min-w-0 max-w-md flex-wrap items-center justify-center gap-3 text-sm", className)}
      {...props}
    />
  );
}
