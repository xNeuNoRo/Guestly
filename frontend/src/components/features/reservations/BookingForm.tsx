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

export function BookingForm({ propertyId }: Readonly<BookingFormProps>) {
  const router = useRouter();
  const { searchParams } = useQueryString();
  const { mutate: createReservation, isPending } = useCreateReservation();

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
        toast.success("¡Reserva confirmada!");
        router.push(ROUTES.USER.RESERVATIONS);
      },
    });
  };

  return (
    <div className="w-full bg-white rounded-4xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-6 lg:p-8 sticky top-32 z-10">
      <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
        <header>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Reserva ahora
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Selecciona fechas para ver el precio
          </p>
        </header>

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

        <PricePreviewWidget
          propertyId={propertyId}
          startDate={urlStart ?? undefined}
          endDate={urlEnd ?? undefined}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full py-4 text-lg font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all hover:shadow-primary-500/40 hover:-translate-y-0.5"
          isLoading={isPending}
          disabled={!startDate || !endDate}
        >
          {startDate && endDate ? "Reservar estancia" : "Ver disponibilidad"}
        </Button>

        <p className="text-center text-[10px] uppercase tracking-widest font-bold text-slate-400">
          No se te cobrará nada todavía
        </p>
      </Form>
    </div>
  );
}
