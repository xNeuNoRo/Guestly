"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    // Diccionario de Variantes (Colores y bordes)
    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 shadow-sm focus-visible:ring-primary-500 border border-transparent",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500 border border-transparent",
      outline:
        "bg-transparent text-slate-700 hover:bg-slate-50 border border-slate-300 focus-visible:ring-slate-500",
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500 border border-transparent",
      danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-sm focus-visible:ring-red-500 border border-transparent",
    };

    // Diccionario de Tamaños (Paddings y tipografía)
    const sizes = {
      sm: "px-3 py-1.5 text-sm font-medium",
      md: "px-4 py-2 text-sm font-semibold",
      lg: "px-6 py-3 text-base font-semibold",
    };

    // Si está cargando o explícitamente deshabilitado, anulamos la interacción
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={clsx(
          // Clases base compartidas por todos los botones
          "relative inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ease-in-out hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {/* Spinner animado centralizado */}
        {isLoading && (
          <svg
            className="animate-spin -ml-1 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Icono Izquierdo (se oculta si está cargando para no empujar el texto) */}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}

        {/* Contenido (Texto) */}
        <span>{children}</span>

        {/* Icono Derecho */}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
