import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps): React.ReactElement {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "Avatar"}
        className={cn("rounded-full object-cover", sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600",
        sizeMap[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
