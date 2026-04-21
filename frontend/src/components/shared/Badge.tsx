"use client";

import { type HTMLAttributes } from "react";
import clsx from "clsx";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "brand";
  size?: "sm" | "md";
  dot?: boolean; // Un puntito de color indicador de estado (muy premium)
}

/**
 * @description Átomo para etiquetas de estado, categorías o contadores.
 */
export function Badge({
  children,
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  ...props
}: Readonly<BadgeProps>) {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    brand: "bg-primary-50 text-primary-700 border-primary-200",
  };

  const dotColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    neutral: "bg-slate-500",
    brand: "bg-primary-500",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className={clsx("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", dotColors[variant])} />
          <span className={clsx("relative inline-flex h-2 w-2 rounded-full", dotColors[variant])} />
        </span>
      )}
      {children}
    </span>
  );
}