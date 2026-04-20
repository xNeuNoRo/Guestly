"use client";

import { useMemo, useState } from "react";
import { type DateRange, type Matcher } from "react-day-picker";
import { addMonths, format, startOfDay, isWithinInterval, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { IoAlertCircleOutline } from "react-icons/io5";

import { Calendar } from "@/components/shared/Calendar";
import { Skeleton } from "@/components/shared/Skeleton";
import { usePropertyAvailability } from "@/hooks/properties";
import { useQueryString } from "@/hooks/shared/useQueryString";

export interface BookingDatePickerProps {
  propertyId: string;
  onChange?: (range: DateRange | undefined) => void;
  error?: string;
}

/**
 * @description Organismo de Calendario para el flujo de reservas.
 * Fuente de verdad: URL (startDate, endDate, bookingError).
 */
export function BookingDatePicker({
  propertyId,
  onChange,
  error,
}: Readonly<BookingDatePickerProps>) {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  // --- Fuente de Verdad: URL ---
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const bookingError = searchParams.get("bookingError");

  const selectedRange: DateRange | undefined = useMemo(() => {
    if (!startDateParam) return undefined;
    return {
      from: parseISO(startDateParam),
      to: endDateParam ? parseISO(endDateParam) : undefined,
    };
  }, [startDateParam, endDateParam]);

  // Calculamos la ventana de disponibilidad (Fija, no necesita URL)
  const [dateWindow] = useState(() => {
    const today = startOfDay(new Date());
    const sixMonthsLater = addMonths(today, 6);
    return {
      start: today,
      end: sixMonthsLater,
      startFormatted: format(today, "yyyy-MM-dd"),
      endFormatted: format(sixMonthsLater, "yyyy-MM-dd"),
    };
  });

  const { data: blockedDates, isLoading } = usePropertyAvailability(
    propertyId,
    dateWindow.startFormatted,
    dateWindow.endFormatted,
  );

  const disabledDays = useMemo<Matcher[]>(() => {
    const disabled: Matcher[] = [{ before: dateWindow.start }];

    if (blockedDates && blockedDates.length > 0) {
      blockedDates.forEach((block) => {
        if (block.startDate && block.endDate) {
          disabled.push({
            from: startOfDay(new Date(block.startDate)),
            to: startOfDay(new Date(block.endDate)),
          });
        }
      });
    }

    return disabled;
  }, [blockedDates, dateWindow.start]);

  const isRangeValid = (range: DateRange) => {
    if (!range.from || !range.to) return true;

    const blockedRanges =
      blockedDates?.filter((b) => b.startDate && b.endDate) || [];

    for (const block of blockedRanges) {
      const blockStart = startOfDay(new Date(block.startDate));
      const blockEnd = startOfDay(new Date(block.endDate));

      if (
        isWithinInterval(blockStart, { start: range.from, end: range.to }) ||
        isWithinInterval(blockEnd, { start: range.from, end: range.to })
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSelect = (range: DateRange | undefined) => {
    let newParams: Record<string, string | null> = {
      bookingError: null,
    };

    if (range?.from && range?.to) {
      if (!isRangeValid(range)) {
        newParams = {
          startDate: format(range.from, "yyyy-MM-dd"),
          endDate: null,
          bookingError: "El rango seleccionado incluye fechas no disponibles.",
        };
        router.push(createUrl(newParams), { scroll: false });
        if (onChange) onChange(undefined);
        return;
      }
    }

    newParams = {
      startDate: range?.from ? format(range.from, "yyyy-MM-dd") : null,
      endDate: range?.to ? format(range.to, "yyyy-MM-dd") : null,
      bookingError: null,
    };

    router.push(createUrl(newParams), { scroll: false });
    if (onChange) onChange(range);
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-white w-fit shadow-sm">
        <Skeleton variant="rectangular" className="h-75 w-70" />
        <Skeleton
          variant="rectangular"
          className="h-75 w-70 hidden sm:block"
        />
      </div>
    );
  }

  const displayError = bookingError || error;

  return (
    <div className="flex flex-col gap-2 w-fit">
      <Calendar
        mode="range"
        selected={selectedRange}
        onSelect={handleSelect}
        disabled={disabledDays}
        numberOfMonths={2}
        pagedNavigation
      />

      {displayError && (
        <div className="flex items-center gap-1.5 text-red-600 mt-1 animate-in fade-in">
          <IoAlertCircleOutline size={16} />
          <p className="text-sm font-medium">{displayError}</p>
        </div>
      )}
    </div>
  );
}