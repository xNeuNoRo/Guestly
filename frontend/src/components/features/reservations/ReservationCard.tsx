"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IoCalendarOutline, IoLocationOutline } from "react-icons/io5";

import { formatCurrency } from "@/helpers/formatCurrency";
import { ReservationStatusBadge } from "./ReservationStatusBadge";

import type { ReservationResponse } from "@/schemas/reservations.schemas";
import { ROUTES } from "@/constants/routes";
import { JSX } from "react";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";

interface ReservationCardProps {
  reservation: ReservationResponse;
  isHostMode?: boolean;
}

export function ReservationCard({
  reservation,
  isHostMode = false,
}: Readonly<ReservationCardProps>) {
  const router = useRouter();
  const checkIn = new Date(reservation.checkInDate);
  const checkOut = new Date(reservation.checkOutDate);

  const isSameMonth = checkIn.getMonth() === checkOut.getMonth();
  const dateString = isSameMonth
    ? `${format(checkIn, "d")} - ${format(checkOut, "d 'de' MMM, yyyy", { locale: es })}`
    : `${format(checkIn, "d 'de' MMM", { locale: es })} - ${format(checkOut, "d 'de' MMM, yyyy", { locale: es })}`;

  const imageUrl =
    reservation.propertyThumbnailUrl || "/placeholder-property.jpg";

  const displayTitle = isHostMode
    ? `Reserva de ${reservation.guestName}`
    : reservation.propertyTitle;

  const destinationRoute = isHostMode
    ? ROUTES.HOST.RESERVATIONBYID(reservation.id)
    : ROUTES.USER.RESERVATIONBYID(reservation.id);

  let subtitle: JSX.Element | null = null;
  if (isHostMode) {
    subtitle = (
      <p className="text-sm text-slate-500 flex items-center gap-1.5">
        <IoLocationOutline className="shrink-0" />
        <span className="truncate">{reservation.propertyTitle}</span>
      </p>
    );
  } else if (reservation.propertyLocation) {
    subtitle = (
      <p className="text-sm text-slate-500 flex items-center gap-1.5">
        <IoLocationOutline className="shrink-0" />
        <span className="truncate">{reservation.propertyLocation}</span>
      </p>
    );
  }

  const handlePropertyClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the outer <Link> from navigating
    router.push(ROUTES.PUBLIC.PROPERTY_DETAIL(reservation.propertyId));
  };

  return (
    <Link
      href={destinationRoute}
      className="group flex flex-col sm:flex-row gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Imagen */}
      <div className="relative w-full sm:w-36 h-48 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
        <Image
          src={imageUrl}
          alt={reservation.propertyTitle}
          fill
          sizes="(max-width: 640px) 100vw, 144px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-between flex-1 gap-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          <div className="space-y-1.5">
            <ReservationStatusBadge status={reservation.status} />

            <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
              {displayTitle}
            </h3>

            {subtitle}
          </div>

          {/* Precio Total */}
          <div className="text-left md:text-right shrink-0">
            <p className="text-sm text-slate-500">Total pagado</p>
            <p className="font-bold text-slate-900">
              {formatCurrency(reservation.totalPrice)}
            </p>
          </div>
        </div>

        {/* Footer de la Card: Fechas y Acciones */}
        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
            <IoCalendarOutline className="text-slate-500" size={16} />
            <span className="capitalize">{dateString}</span>
          </div>

          {/* Gatillo de Reseña: Solo para Huéspedes en reservas Completadas */}
          {!isHostMode && (
            <Button
              onClick={handlePropertyClick}
              className="text-sm font-medium bg-primary-600 text-white hover:cursor-pointer hover:scale-105 hover:bg-primary-800 px-4 py-2 rounded-full transition-all duration-200"
            >
              Ir a la propiedad
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
