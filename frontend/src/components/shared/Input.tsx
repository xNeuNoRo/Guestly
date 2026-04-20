"use client";

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { IoEyeOutline, IoEyeOffOutline, IoAlertCircleOutline } from "react-icons/io5";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string; // Mensaje de error (típicamente viene de react-hook-form)
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  hint?: string; // Texto de ayuda debajo del input
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      type = "text",
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    
    // Generamos un ID seguro en caso de que no se provea uno, útil para accesibilidad
    const inputId = id ?? (label ? label.toLowerCase().replaceAll(/\s+/g, "-") : undefined);
    
    const isPassword = type === "password";
    const currentType = isPassword && showPassword ? "text" : type;
    const hasError = !!error;

    let ariaDescribedBy: string | undefined;
    if (hasError) {
      ariaDescribedBy = `${inputId}-error`;
    } else if (hint) {
      ariaDescribedBy = `${inputId}-hint`;
    }

    let rightAdornment: ReactNode = null;

    if (isPassword) {
      rightAdornment = (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
        </button>
      );
    } else if (hasError) {
      rightAdornment = (
        <IoAlertCircleOutline size={18} className="text-red-500 pointer-events-none" />
      );
    } else if (rightIcon) {
      rightAdornment = <div className="text-slate-400 pointer-events-none">{rightIcon}</div>;
    }

    let helperMessage: ReactNode = null;
    if (hasError) {
      helperMessage = (
        <p id={`${inputId}-error`} className="text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      );
    } else if (hint) {
      helperMessage = (
        <p id={`${inputId}-hint`} className="text-sm text-slate-500">
          {hint}
        </p>
      );
    }

    return (
      <div className="w-full flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}

        {/* Contenedor del Input */}
        <div className="relative flex items-center">
          {/* Icono Izquierdo */}
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={currentType}
            disabled={disabled}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={ariaDescribedBy}
            className={clsx(
              "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              // Dinámica de Paddings según los iconos
              leftIcon ? "pl-10" : "pl-3",
              (rightIcon || isPassword || hasError) ? "pr-10" : "pr-3",
              // Dinámica de Estados (Error vs Normal)
              hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-300 focus:border-primary-500 focus:ring-primary-500/20",
              className
            )}
            {...props}
          />

          {/* Iconos Derechos (Prioridad: Toggle Password > Error Icon > Custom Right Icon) */}
          <div className="absolute right-3 flex items-center justify-center">
            {rightAdornment}
          </div>
        </div>

        {/* Mensaje de Error o Ayuda */}
        {helperMessage}
      </div>
    );
  }
);

Input.displayName = "Input";