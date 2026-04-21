"use client";

import { JSX, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IoCalendarOutline } from "react-icons/io5";
import { parseISO } from "date-fns"; // ARSENAL: Importación corregida

import { ReservationCard } from "@/components/features/reservations/ReservationCard";
import { ReservationFiltersBar } from "@/components/features/reservations/ReservationFiltersBar";
import { HostReservationActions } from "@/components/features/reservations/HostReservationActions";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useSearchReservations } from "@/hooks/reservations";
import type {
  ReservationSearchRequest,
  ReservationStatus,
} from "@/schemas/reservations.schemas";

export default function HostBookingsPage() {
  const searchParams = useSearchParams();

  // ARSENAL: Construcción de filtros reactivos a la URL
  const filters = useMemo((): ReservationSearchRequest => {
    // Para Host, lo lógico es que por defecto vea "Pending"
    const status =
      (searchParams.get("status") as ReservationStatus) || "Pending";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    return {
      status,
      startDate: startDate ? parseISO(startDate) : undefined,
      endDate: endDate ? parseISO(endDate) : undefined,
    };
  }, [searchParams]);

  // ARSENAL: El hook ahora recibe el objeto memorizado
  const {
    data: bookings,
    isLoading,
    isRefetching,
  } = useSearchReservations(filters);

  let bookingsSection: JSX.Element | JSX.Element[];

  if (isLoading) {
    bookingsSection = <p className="text-slate-400">Cargando reservas...</p>;
  } else if (bookings?.length) {
    bookingsSection = bookings.map((booking) => (
      <div key={booking.id} className="flex flex-col gap-4">
        <ReservationCard isHostMode={true} reservation={booking} />

        {booking.status === "Pending" && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <p className="text-sm font-bold text-slate-600 ml-2">
              Esta reserva está pendiente de tu confirmación.
            </p>
            <HostReservationActions
              status={booking.status}
              reservationId={booking.id}
            />
          </div>
        )}
      </div>
    ));
  } else {
    bookingsSection = (
      <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <IoCalendarOutline size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 font-bold">
          No tienes solicitudes en este estado.
        </p>
      </div>
    );
  }

  return (
    <AuthGuard allowedRoles={["Host"]}>
      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Reservas Recibidas
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-lg">
              Gestiona quién se hospeda en tus propiedades.
            </p>
          </div>
          {/* Indicador visual de que se está buscando en segundo plano */}
          {isRefetching && (
            <span className="text-xs font-bold text-primary-500 animate-pulse">
              Actualizando...
            </span>
          )}
        </header>

        <ReservationFiltersBar />

        <div className="space-y-8">{bookingsSection}</div>
      </main>
    </AuthGuard>
  );
}
