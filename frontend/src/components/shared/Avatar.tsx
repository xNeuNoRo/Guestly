"use client";

import { useState } from "react";
import clsx from "clsx";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * @description Componente de Avatar con fallback automático a iniciales.
 * Evita que se muestre el icono de "imagen rota" del navegador.
 */
export function Avatar({ src, alt, initials, size = "md", className }: Readonly<AvatarProps>) {
  // Estado para detectar si la carga de la imagen falló
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-xl",
  };

  // Si no hay src, o si la imagen falló al cargar, mostramos el rescate
  const showFallback = !src || hasError;

  // Calculamos las iniciales de forma segura (máximo 2 letras)
  const safeInitials = initials ? initials.trim().slice(0, 2).toUpperCase() : "?";

  return (
    <div
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium transition-colors",
        showFallback ? "bg-primary-100 text-primary-700" : "bg-slate-200",
        sizes[size],
        className
      )}
    >
      {showFallback ? (
        <span>{safeInitials}</span>
      ) : (
        <img
          src={src}
          alt={alt || "Avatar del usuario"}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}