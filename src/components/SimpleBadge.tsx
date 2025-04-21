import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface SimpleBadgeProps extends HTMLAttributes<HTMLSpanElement> {}

export function SimpleBadge({
  className,
  children,
  ...props
}: SimpleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-semi-transparent whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
