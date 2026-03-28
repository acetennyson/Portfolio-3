import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to merge tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
          "bg-gray-800 text-white hover:bg-gray-700": variant === "secondary",
          "border border-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800": variant === "outline",
          "bg-red-600 text-white hover:bg-red-700": variant === "danger",
          "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300": variant === "ghost",
          "h-9 px-3 text-sm": size === "sm",
          "h-10 py-2 px-4": size === "md",
          "h-11 px-8 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
