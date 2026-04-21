"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname } from "next/navigation";
import { format, parseISO } from "date-fns";
import { IoFilterOutline, IoCloseOutline } from "react-icons/io5";

import { Form } from "@/components/shared/form/Form";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

import { useQueryString } from "@/hooks/shared/useQueryString";
import {
  reservationSearchSchema,
  type ReservationSearchRequest,
  type ReservationStatus,
} from "@/schemas/reservations.schemas";

/**
 * @description Barra de filtros para listas de reservas.
 * Sincroniza el estado del formulario con los parámetros de la URL de forma bidireccional.
 */
export function ReservationFiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { createUrl, searchParams } = useQueryString();

  // Helper para extraer fechas de la URL de forma segura
  const parseDateParam = (param: string | null): Date | undefined => {
    if (!param) return undefined;
    const parsed = parseISO(param);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const form = useForm<ReservationSearchRequest>({
    resolver: zodResolver(reservationSearchSchema),
    defaultValues: {
      status: (searchParams.get("status") as ReservationStatus) || undefined,
      startDate: parseDateParam(searchParams.get("startDate")),
      endDate: parseDateParam(searchParams.get("endDate")),
    },
  });

  // Sincronización bidireccional. Si la URL cambia (ej. botón atrás), el formulario se resetea.
  useEffect(() => {
    form.reset({
      status: (searchParams.get("status") as ReservationStatus) || undefined,
      startDate: parseDateParam(searchParams.get("startDate")),
      endDate: parseDateParam(searchParams.get("endDate")),
    });
  }, [searchParams, form]);

  // Observamos si hay filtros activos para mostrar el botón de "Limpiar"
  const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

  const onSubmit = (data: ReservationSearchRequest) => {
    const urlWithParams = createUrl({
      status: data.status || null,
      startDate: data.startDate ? format(data.startDate, "yyyy-MM-dd") : null,
      endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : null,
    });

    router.push(urlWithParams, { scroll: false });
  };

  const handleClear = () => {
    form.reset({ status: undefined, startDate: undefined, endDate: undefined });
    router.push(pathname, { scroll: false });
  };

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col md:flex-row items-center gap-3 w-full bg-white p-3 rounded-2xl border border-slate-200 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full flex-1">
        {/* Filtro por Estado */}
        <div className="w-full sm:w-48 shrink-0">
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <select
                className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow cursor-pointer"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value || undefined)}
              >
                <option value="">Todos los estados</option>
                <option value="Pending">Pendientes</option>
                <option value="Confirmed">Confirmadas</option>
                <option value="Completed">Completadas</option>
                <option value="Cancelled">Canceladas</option>
              </select>
            )}
          />
        </div>

        {/* Separador visual en desktop */}
        <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1" />

        {/* Rango de Fechas */}
        <div className="flex items-center gap-2 w-full">
          <Controller
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <Input
                type="date"
                className="h-10 text-sm"
                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseISO(e.target.value) : undefined,
                  )
                }
                placeholder="Desde"
              />
            )}
          />
          <span className="text-slate-400 text-sm">a</span>
          <Controller
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <Input
                type="date"
                className="h-10 text-sm"
                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseISO(e.target.value) : undefined,
                  )
                }
                placeholder="Hasta"
              />
            )}
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            leftIcon={<IoCloseOutline size={18} />}
            className="text-slate-500 hover:text-slate-900 w-full md:w-auto"
          >
            Limpiar
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          leftIcon={<IoFilterOutline size={16} />}
          className="w-full md:w-auto h-10 px-6"
        >
          Filtrar
        </Button>
      </div>
    </Form>
  );
}
