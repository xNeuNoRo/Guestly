"use client";

import { useRef } from "react";
import clsx from "clsx";
import { IoChevronDownOutline, IoAlertCircleOutline, IoCheckmark } from "react-icons/io5";
import { useToggle } from "@/hooks/shared/useToggle";
import { useClickOutside } from "@/hooks/shared/useClickOutside";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción...",
  error,
  hint,
  disabled = false,
  className,
}: Readonly<SelectProps>) {
  const { value: isOpen, toggle, setFalse: close } = useToggle(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Si el usuario hace clic fuera de este contenedor, se cierra el menú
  useClickOutside(containerRef, close);

  const hasError = !!error;
  const selectedOption = options.find((opt) => opt.value === value);

  // Función para manejar la selección y cerrar el menú
  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue);
    close();
  };

  return (
    <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* Botón Disparador (Actúa visualmente como el Input) */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={clsx(
            "w-full flex items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm transition-colors text-left",
            "focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            hasError
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-300 focus:border-primary-500 focus:ring-primary-500/20",
            !selectedOption && "text-slate-400", // Color del placeholder
            selectedOption && "text-slate-900", // Color del valor seleccionado
            className
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          <div className="flex items-center gap-2 text-slate-400 shrink-0">
            {hasError && <IoAlertCircleOutline size={18} className="text-red-500" />}
            <IoChevronDownOutline 
              size={18} 
              className={clsx("transition-transform duration-200", isOpen && "rotate-180")} 
            />
          </div>
        </button>

        {/* Menú Desplegable */}
        {isOpen && (
          <ul
            role="listbox"
            className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in zoom-in-95 duration-100"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-500 text-center">
                No hay opciones disponibles
              </li>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={clsx(
                      "relative flex cursor-pointer select-none items-center justify-between py-2 pl-3 pr-9 text-sm transition-colors",
                      isSelected
                        ? "bg-primary-50 text-primary-900 font-medium"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600">
                        <IoCheckmark size={18} />
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      {/* Mensaje de Error o Ayuda */}
      {hasError ? (
        <p className="text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}