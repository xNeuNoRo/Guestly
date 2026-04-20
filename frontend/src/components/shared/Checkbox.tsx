"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, disabled, ...props }, ref) => {
    const checkboxId = id ?? (label ? label.toLowerCase().replaceAll(/\s+/g, "-") : undefined);
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-1">
        <div className="relative flex items-start gap-3">
          <div className="flex h-5 items-center">
            <input
              id={checkboxId}
              type="checkbox"
              ref={ref}
              disabled={disabled}
              className={clsx(
                // Ocultamos el diseño por defecto pero mantenemos la accesibilidad
                "peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 transition-all",
                "checked:border-primary-600 checked:bg-primary-600",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100",
                hasError ? "border-red-500" : "border-slate-300 hover:border-primary-500",
                className
              )}
              {...props}
            />
            {/* Icono de Check (Solo visible cuando peer:checked es true) */}
            <svg
              className="absolute left-0.75 top-0.75 pointer-events-none h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className={clsx(
                "text-sm font-medium select-none cursor-pointer pt-0.5",
                disabled ? "text-slate-400" : "text-slate-700"
              )}
            >
              {label}
            </label>
          )}
        </div>

        {hasError && (
          <p className="text-sm text-red-600 font-medium pl-8 animate-in fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";