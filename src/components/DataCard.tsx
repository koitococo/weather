import {
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface DataCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title?: string;
  extra?: ReactNode;
  titleBg?: string;
  onTitleClick?: MouseEventHandler<HTMLDivElement>;
  loading?: boolean;
  noHeader?: boolean;
}

const DataCard = forwardRef(
  (
    {
      icon,
      title,
      children,
      className,
      extra,
      titleBg,
      onTitleClick,
      loading,
      noHeader,
      ...props
    }: DataCardProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "relative flex flex-col overflow-hidden rounded bg-white/20 px-3 pb-2 text-card-foreground shadow-sm", // Adjusted base styles: bg, border, text color, padding
          noHeader ? "pt-2" : "", // Conditional top padding
          loading ? "" : "backdrop-blur-sm", // Apply blur only when not loading
          className,
        )}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm">
            {/* Add a spinner component here if desired */}
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        )}

        {/* Header */}
        {!noHeader && (
          <div
            className={cn(
              "flex items-center justify-between gap-2 py-2 px-3 -mx-3",
              "transition-colors duration-200",
              onTitleClick ? "cursor-pointer" : "",
              titleBg ? `bg-[${titleBg}]` : "bg-opacity-80",
            )}
            onClick={onTitleClick}
          >
            <div className="flex items-center gap-2">
              {icon && <span>{icon}</span>}
              {title && <span className="text-sm font-medium">{title}</span>}
            </div>
            {extra && <div>{extra}</div>}
          </div>
        )}

        {/* Content */}
        <div className="flex-grow">{children}</div>
      </div>
    );
  },
);

DataCard.displayName = "DataCard"; // Add display name for DevTools

export default DataCard;
