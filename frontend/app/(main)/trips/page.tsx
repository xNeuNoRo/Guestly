"use client";

import { useSearchParams } from "next/navigation";
import { IoAirplaneOutline } from "react-icons/io5";
import { useMemo, type ReactNode } from "react";

import { ReservationCard } from "@/components/features/reservations/ReservationCard";
import { ReservationFiltersBar } from "@/components/features/reservations/ReservationFiltersBar";
import { CancelReservationModal } from "@/components/features/reservations/CancelReservationModal";
import { Skeleton } from "@/components/shared/Skeleton";
import { AuthGuard } from "@/components/auth/AuthGuard";

import { useSearchReservations } from "@/hooks/reservations/useQueries";
import type {
  ReservationSearchRequest,
  ReservationStatus,
} from "@/schemas/reservations.schemas";
import { parseISO } from "date-fns/parseISO";
import { useAuth } from "@/hooks/stores/useAuth";

export default function MyTripsPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const filters = useMemo((): ReservationSearchRequest => {
    const status = searchParams.get("status") as ReservationStatus;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    return {
      status,
      startDate: startDate ? parseISO(startDate) : undefined,
      endDate: endDate ? parseISO(endDate) : undefined,
    };
  }, [searchParams]);

  // El hook usa internamente el reservationSearchSchema
  const {
    data: reservations,
    isLoading,
    isRefetching,
  } = useSearchReservations({ ...filters, guestId: user?.id });

  let tripsContent: ReactNode;

  if (isLoading) {
    tripsContent = Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-48 w-full rounded-3xl" />
    ));
  } else if (reservations?.length) {
    tripsContent = reservations.map((res) => (
      <ReservationCard key={res.id} reservation={res} />
    ));
  } else {
    tripsContent = (
      <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <IoAirplaneOutline size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-900">No hay viajes aquí</h3>
        <p className="text-slate-500">Prueba cambiando el filtro de estado.</p>
      </div>
    );
  }

  return (
    <AuthGuard>
      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-10">
        <header>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Mis Viajes
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            Prepárate para tu próxima aventura.
          </p>
          {isRefetching && (
            <span className="text-xs font-bold text-primary-500 animate-pulse">
              Actualizando...
            </span>
          )}
        </header>

        <ReservationFiltersBar />

        <section className="grid grid-cols-1 gap-6">{tripsContent}</section>

        <CancelReservationModal />
      </main>
    </AuthGuard>
  );
}
