"use client";

import { Switch } from "@headlessui/react";
import clsx from "clsx";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled = false }: Readonly<ToggleProps>) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className={clsx("text-sm font-medium text-slate-900", disabled && "opacity-50")}>
              {label}
            </span>
          )}
          {description && (
            <span className={clsx("text-xs text-slate-500", disabled && "opacity-50")}>
              {description}
            </span>
          )}
        </div>
      )}

      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          "group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          checked ? "bg-primary-600" : "bg-slate-200",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span className="sr-only">Alternar {label}</span>
        <span
          aria-hidden="true"
          className={clsx(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </Switch>
    </div>
  );
}