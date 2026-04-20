"use client";

import {
  DayPicker,
  getDefaultClassNames,
  type DayPickerProps,
} from "react-day-picker";
import { es } from "date-fns/locale";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import clsx from "clsx";

export type CalendarProps = DayPickerProps;

/**
 * @description Átomo base del Calendario compatible con react-day-picker v9.
 * Utiliza getDefaultClassNames() para extender los estilos base de forma segura.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      locale={es} // Forzamos el idioma español para Guestly
      showOutsideDays={showOutsideDays}
      className={clsx(
        "p-3 w-fit bg-white rounded-xl border border-slate-200 shadow-sm",
        className,
      )}
      classNames={{
        // Extendemos las clases por defecto de v9 con nuestra capa de Tailwind
        root: `${defaultClassNames.root} font-sans`,
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        nav: "space-x-1 flex items-center justify-between px-2",
        nav_button:
          "h-8 w-8 bg-transparent p-0 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        chevron: "fill-slate-600 w-4 h-4",
        caption_label: "text-sm font-semibold text-slate-900 capitalize",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-slate-500 rounded-md w-9 font-medium text-[0.8rem] capitalize",
        row: "flex w-full mt-2",

        // Celdas y Días
        cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: "group w-9 h-9 p-0 font-medium rounded-md hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-900",

        // Modificadores de estado (Tailwind lo maneja combinando estas clases)
        today: "bg-slate-100 text-primary-700 font-bold",
        outside: "text-slate-400 opacity-50",
        disabled:
          "text-slate-300 opacity-50 cursor-not-allowed hover:bg-transparent line-through",

        // Estilos para RANGOS de fechas (Reservas)
        selected:
          "bg-primary-600 text-white hover:bg-primary-700 focus:bg-primary-600 focus:text-white rounded-md font-bold shadow-sm",
        range_start:
          "day-range-start !bg-primary-600 text-white rounded-r-none",
        range_end: "day-range-end !bg-primary-600 text-white rounded-l-none",
        range_middle:
          "aria-selected:!bg-primary-50 aria-selected:text-primary-900 aria-selected:!rounded-none aria-selected:!shadow-none",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...chevronProps }) => {
          if (orientation === "left") {
            return (
              <IoChevronBack
                className={clsx("h-4 w-4", className)}
                {...chevronProps}
              />
            );
          }
          return (
            <IoChevronForward
              className={clsx("h-4 w-4", className)}
              {...chevronProps}
            />
          );
        },
      }}
      {...props}
    />
  );
}
