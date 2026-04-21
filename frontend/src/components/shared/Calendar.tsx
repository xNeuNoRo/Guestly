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

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={clsx(
        "p-3 w-full bg-white rounded-xl border border-slate-200 shadow-sm",
        className,
      )}
      classNames={{
        root: `${defaultClassNames.root} font-sans w-full`,
        // ARSENAL: Solo añadí la animación de fade-in a tu código original
        months:
          "flex flex-col w-full space-y-4 animate-in fade-in duration-300",
        month: "space-y-4 w-full",

        month_caption: "flex justify-center items-center w-full pt-1",
        caption_label:
          "text-sm font-semibold text-slate-900 capitalize tracking-wide",

        nav: "space-x-1 flex items-center justify-between px-2",
        // ARSENAL: Mantuve tu hover:cursor-pointer y tu bg, solo agregué active:scale-95 para el clic
        nav_button:
          "h-8 w-8 bg-transparent p-0 flex items-center hover:cursor-pointer justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        chevron:
          "fill-slate-600 w-6 h-6 hover:cursor-pointer transition-all duration-200 hover:bg-primary-200 rounded-md p-1",

        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex w-full",
        weekday:
          "text-slate-500 flex-1 font-medium text-[0.8rem] capitalize text-center mb-1",
        week: "flex w-full mt-2",
        day: "text-center text-sm p-0 relative flex-1 focus-within:relative focus-within:z-20",
        // ARSENAL: Mantuve tu hover:cursor-pointer, agregué hover sutil del color primario y active:scale-95
        day_button:
          "group hover:cursor-pointer w-full h-9 p-0 font-medium rounded-md hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 active:scale-90 flex items-center justify-center text-slate-900",

        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell:
          "text-slate-500 flex-1 font-medium text-[0.8rem] capitalize text-center mb-1",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative flex-1 focus-within:relative focus-within:z-20",

        today: "bg-slate-100 text-primary-700 font-bold",
        outside: "text-slate-400 opacity-50",
        disabled:
          "text-slate-300 opacity-50 cursor-not-allowed hover:bg-transparent line-through active:scale-100",

        // ARSENAL: Añadida una transición suave de color para cuando se selecciona
        selected:
          "bg-primary-600 text-white hover:bg-primary-700 focus:bg-primary-600 focus:text-white rounded-md font-bold shadow-sm transition-colors duration-200",
        range_start:
          "day-range-start !bg-primary-600 !rounded-lg text-white !rounded-r-none",
        range_end: "day-range-end !bg-primary-600 !rounded-lg text-white !rounded-l-none",
        range_middle:
          "aria-selected:!bg-primary-50 aria-selected:text-primary-900 aria-selected:!rounded-none aria-selected:!shadow-none aria-selected:hover:!bg-primary-100 transition-colors duration-200",

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
