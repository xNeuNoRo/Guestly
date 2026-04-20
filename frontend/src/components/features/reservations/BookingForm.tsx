"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseISO } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Form } from "@/components/shared/form/Form";
import { BookingDatePicker } from "./BookingDatePicker";
import { PricePreviewWidget } from "./PricePreviewWidget";
import {
  createReservationSchema,
  type CreateReservationRequest,
} from "@/schemas/reservations.schemas";
import { useCreateReservation } from "@/hooks/reservations";
import { ROUTES } from "@/constants/routes";
import { useQueryString } from "@/hooks/shared/useQueryString";

interface BookingFormProps {
  propertyId: string;
}

/**
 * @description Organismo que gestiona el flujo completo de reserva.
 * Sincroniza el estado del formulario con la URL para asegurar persistencia total.
 */
export function BookingForm({ propertyId }: Readonly<BookingFormProps>) {
  const router = useRouter();
  const { searchParams } = useQueryString();
  const { mutate: createReservation, isPending } = useCreateReservation();

  // --- Fuente de Verdad: URL ---
  const urlStart = searchParams.get("startDate");
  const urlEnd = searchParams.get("endDate");

  const form = useForm<CreateReservationRequest>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      propertyId,
      startDate: urlStart ? parseISO(urlStart) : undefined,
      endDate: urlEnd ? parseISO(urlEnd) : undefined,
    },
  });

  // REDENCIÓN: Sincronización bidireccional. Si la URL cambia (ej. el DatePicker actualiza los params), 
  // el formulario se resetea para mantenerse en sintonía con la fuente de verdad.
  useEffect(() => {
    form.reset({
      propertyId,
      startDate: urlStart ? parseISO(urlStart) : undefined,
      endDate: urlEnd ? parseISO(urlEnd) : undefined,
    });
  }, [urlStart, urlEnd, form, propertyId]);

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  const onSubmit = (data: CreateReservationRequest) => {
    createReservation(data, {
      onSuccess: () => {
        toast.success("¡Reserva confirmada con éxito!");
        router.push(ROUTES.USER.RESERVATIONS);
      },
      onError: () => {
        toast.error(
          "No se pudo crear la reserva. Las fechas podrían no estar disponibles.",
        );
      },
    });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sticky top-24">
      <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Reserva tu estancia
          </h3>
          <p className="text-sm text-slate-500">
            Selecciona tus fechas para continuar
          </p>
        </div>

        {/* El BookingDatePicker ahora es inteligente y gestiona la URL. 
          Al interactuar con él, la URL cambiará, disparando nuestro useEffect y sincronizando el Form.
        */}
        <Controller
          name="startDate"
          control={form.control}
          render={({ fieldState }) => (
            <BookingDatePicker
              propertyId={propertyId}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* El Widget de Precios lee directamente de lo que ya está en la URL para evitar estados locales redundantes */}
        <PricePreviewWidget
          propertyId={propertyId}
          startDate={urlStart ?? undefined}
          endDate={urlEnd ?? undefined}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full py-4 text-lg"
          isLoading={isPending}
          disabled={!startDate || !endDate}
        >
          {startDate && endDate ? "Reservar ahora" : "Selecciona fechas"}
        </Button>

        <p className="text-center text-xs text-slate-400">
          Se te enviará una confirmación por correo una vez aceptada.
        </p>
      </Form>
    </div>
  );
}