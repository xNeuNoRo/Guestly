"use client";

import { IoCalendarOutline } from "react-icons/io5";

import { ReservationCard } from "@/components/features/reservations/ReservationCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { useSearchReservations } from "@/hooks/reservations/useQueries";

export function RecentHostBookings() {
  const { data: bookings, isLoading } = useSearchReservations();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  // Tomamos solo las 3 reservas más recientes para no saturar el Dashboard
  const recentBookings = bookings?.slice(0, 3);

  if (!recentBookings || recentBookings.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-200 border-dashed p-12 text-center">
        <IoCalendarOutline size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">
          Aquí aparecerán tus próximas reservas confirmadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentBookings.map((booking) => (
        <ReservationCard key={booking.id} reservation={booking} />
      ))}
    </div>
  );
}
