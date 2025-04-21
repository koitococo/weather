import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Assuming shadcn/ui setup with a utility function

export interface DataItemsProps {
  data: {
    icon?: ReactNode;
    title: ReactNode;
    value?: ReactNode;
    fallback?: ReactNode;
  }[];
  fallback?: ReactNode;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl"; // Map Mantine sizes to Tailwind spacing if needed
  withBorder?: boolean;
  align?: "left" | "right" | "center";
}

// Helper to map spacing prop to Tailwind padding classes (adjust values as needed)
const spacingMap = {
  xs: "py-1",
  sm: "py-2",
  md: "py-3",
  lg: "py-4",
  xl: "py-5",
};

// Helper to map align prop to Tailwind text alignment classes
const alignMap = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export default function DataItems({
  data,
  fallback,
  spacing = "sm",
  withBorder,
  align = "left",
}: DataItemsProps) {
  const verticalPaddingClass = spacingMap[spacing] || spacingMap.sm;
  const textAlignClass = alignMap[align] || alignMap.left;

  return (
    <div
      className={cn(
        "w-full",
        withBorder && "border border-border divide-y divide-border"
      )}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex justify-between items-center",
            verticalPaddingClass,
            "px-2" // Add horizontal padding if needed
          )}
        >
          <div
            className={cn(
              "text-muted-foreground", // Use a muted color for the title cell
              textAlignClass,
              "flex-1 pr-4" // Add padding between title and value
            )}
          >
            {item.icon ? (
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </div>
            ) : (
              item.title
            )}
          </div>
          <div className={cn(textAlignClass, "flex-1")}>
            {item.value ?? item.fallback ?? fallback}
          </div>
        </div>
      ))}
    </div>
  );
}
