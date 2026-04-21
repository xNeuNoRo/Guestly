"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";
import { IoAlertCircleOutline } from "react-icons/io5";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, disabled, rows = 4, ...props }, ref) => {
    const textareaId = id ?? (label ? label.toLowerCase().replaceAll(/\s+/g, "-") : undefined);
    const hasError = !!error;

    let helperMessage: React.ReactNode = null;
    if (hasError) {
      helperMessage = (
        <p id={`${textareaId}-error`} className="text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      );
    } else if (hint) {
      helperMessage = (
        <p id={`${textareaId}-hint`} className="text-sm text-slate-500">
          {hint}
        </p>
      );
    }

    let ariaDescribedBy: string | undefined;
    if (hasError) {
      ariaDescribedBy = `${textareaId}-error`;
    } else if (hint) {
      ariaDescribedBy = `${textareaId}-hint`;
    }

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <div className="relative flex">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            disabled={disabled}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={ariaDescribedBy}
            className={clsx(
              "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 resize-y min-h-20",
              "focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 pr-10"
                : "border-slate-300 focus:border-primary-500 focus:ring-primary-500/20",
              className
            )}
            {...props}
          />

          {hasError && (
            <div className="absolute right-3 top-3 pointer-events-none">
              <IoAlertCircleOutline size={18} className="text-red-500" />
            </div>
          )}
        </div>

        {helperMessage}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";