import clsx from "clsx";
import { type HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

/**
 * @description Indicador de carga abstracto. 
 * Centraliza la animación 'pulse' y unifica los tonos de gris de la app.
 */
export function Skeleton({ className, variant = "rectangular", ...props }: Readonly<SkeletonProps>) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-slate-200",
        variant === "rectangular" && "rounded-xl", // Ideal para PropertyCards
        variant === "circular" && "rounded-full",  // Ideal para Avatares
        variant === "text" && "h-4 w-full rounded-md", // Ideal para líneas de texto
        className
      )}
      {...props}
    />
  );
}