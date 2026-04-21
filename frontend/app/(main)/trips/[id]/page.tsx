"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  IoLocationOutline,
  IoChevronBack,
  IoInformationCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";

import { ReservationStatusBadge } from "@/components/features/reservations/ReservationStatusBadge";
import { HostReservationActions } from "@/components/features/reservations/HostReservationActions";
import { CancelReservationModal } from "@/components/features/reservations/CancelReservationModal";
import { LeaveReviewButton } from "@/components/features/reviews/LeaveReviewButton";
import { ReviewFormModal } from "@/components/features/reviews/ReviewFormModal";
import { Button } from "@/components/shared/Button";
import { Skeleton } from "@/components/shared/Skeleton";
import { formatCurrency } from "@/helpers/formatCurrency";
import { useReservation } from "@/hooks/reservations/useQueries";
import { useReviewByReservation } from "@/hooks/reviews";
import { useQueryString } from "@/hooks/shared/useQueryString";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/stores/useAuth";
import { ROUTES } from "@/constants/routes";

interface ReservationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ReservationDetailPage({
  params,
}: Readonly<ReservationDetailPageProps>) {
  const { id } = use(params);
  const router = useRouter();
  const { createUrl } = useQueryString();
  const { data: reservation, isLoading, isError } = useReservation(id);
  const { user } = useAuth();

  // Verificamos si el usuario actual es el Anfitrión o Huésped de esta reserva
  const isHost = user?.id === reservation?.hostId;
  const isGuest = user?.id === reservation?.guestId;

  // Consultamos si el huésped ya dejó una reseña para esta reserva (solo si es huésped y la reserva está completada)
  const shouldCheckReviews = isGuest && reservation?.status === "Completed";
  const { data: existingReview, isLoading: isCheckingReview } =
    useReviewByReservation(shouldCheckReviews ? reservation?.id : undefined);

  const tripsPage = isHost
    ? ROUTES.HOST.RESERVATIONS
    : ROUTES.USER.RESERVATIONS;

  if (isLoading) return <ReservationDetailSkeleton />;

  if (isError || !reservation) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Reserva no encontrada
        </h1>
        <Button onClick={() => router.push(tripsPage)} variant="ghost" className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  const nights = differenceInDays(
    reservation.checkOutDate,
    reservation.checkInDate,
  );

  const openCancelModal = () => {
    router.push(createUrl({ modal: "cancel-reservation", cancelId: id }), {
      scroll: false,
    });
  };

  // Si el huésped ya tiene una review para esta reserva, no mostramos el botón de dejar reseña sino un mensaje de agradecimiento
  const hasAlreadyReviewed = !!existingReview;

  let completedGuestReviewContent = null;

  if (isCheckingReview) {
    completedGuestReviewContent = (
      <Skeleton className="h-14 w-full sm:w-48 rounded-xl" />
    );
  } else if (hasAlreadyReviewed) {
    completedGuestReviewContent = (
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
          <IoInformationCircleOutline size={20} />
        </div>
        <p className="text-sm font-bold text-emerald-800">
          Ya calificaste esta estancia. ¡Gracias por tu opinión!
        </p>
      </div>
    );
  } else {
    completedGuestReviewContent = (
      <LeaveReviewButton
        propertyId={reservation.propertyId}
        reservationId={reservation.id}
      />
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header de Navegación */}
      <button
        onClick={() => router.push(tripsPage)}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:cursor-pointer hover:text-slate-900 mb-6 transition-colors"
      >
        <IoChevronBack size={18} />
        {isHost ? "Volver a mis reservas recibidas" : "Volver a mis viajes"}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* COLUMNA IZQUIERDA: Info de la Estancia */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {isGuest ? "Detalles del viaje" : "Detalles de la reserva"}
              </h1>
              <ReservationStatusBadge status={reservation.status} />
            </div>

            <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm">
              <Image
                src={reservation.propertyThumbnailUrl}
                alt={reservation.propertyTitle}
                fill
                className="object-cover"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-4xl border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Alojamiento
              </p>
              <h3 className="text-xl font-bold text-slate-900">
                {reservation.propertyTitle}
              </h3>
              <p className="flex items-center gap-1 text-slate-500 font-medium">
                <IoLocationOutline /> {reservation.propertyLocation}
              </p>
            </div>

            {isGuest ? (
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Anfitrión
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {reservation.hostName}
                </h3>
                <Link
                  href={`/profile/${reservation.hostId}`}
                  className="text-primary-600 font-bold text-sm hover:underline"
                >
                  Ver perfil del anfitrión
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Huésped
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {reservation.guestName}
                </h3>
                <Link
                  href={`/profile/${reservation.guestId}`}
                  className="text-primary-600 font-bold text-sm hover:underline"
                >
                  Ver perfil del huésped
                </Link>
              </div>
            )}

            <div className="md:col-span-2 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Llegada
                </p>
                <p className="font-bold text-slate-900">
                  {format(reservation.checkInDate, "EEEE, d 'de' MMMM", {
                    locale: es,
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Salida
                </p>
                <p className="font-bold text-slate-900">
                  {format(reservation.checkOutDate, "EEEE, d 'de' MMMM", {
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* Acciones Contextuales y Estados Especiales */}
          <div className="flex flex-col gap-4">
            {/* Lógica de Pendiente */}
            {reservation.status === "Pending" && (
              <div
                className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border ${isHost ? "bg-indigo-50 border-indigo-100" : "bg-amber-50 border-amber-100"} gap-4`}
              >
                <div className="flex items-start gap-3">
                  {isHost ? (
                    <IoTimeOutline
                      size={24}
                      className="text-indigo-600 mt-0.5 shrink-0"
                    />
                  ) : (
                    <IoInformationCircleOutline
                      size={24}
                      className="text-amber-600 mt-0.5 shrink-0"
                    />
                  )}
                  <div>
                    <h4
                      className={`font-bold ${isHost ? "text-indigo-900" : "text-amber-900"}`}
                    >
                      {isHost
                        ? "Solicitud de reserva pendiente"
                        : "Esperando confirmación"}
                    </h4>
                    <p
                      className={`text-sm font-medium ${isHost ? "text-indigo-700" : "text-amber-800"}`}
                    >
                      {isHost
                        ? `El huésped "${reservation.guestName}" desea alojarse en estas fechas. ¿Aceptas la solicitud?`
                        : "El anfitrión tiene 24 horas para aceptar o rechazar esta solicitud."}
                    </p>
                  </div>
                </div>

                {isHost && (
                  <div className="shrink-0 w-full sm:w-auto">
                    <HostReservationActions
                      reservationId={reservation.id}
                      status={reservation.status}
                    />
                  </div>
                )}

                {isGuest && (
                  <div className="shrink-0 w-full sm:w-auto">
                    <Button
                      variant="danger"
                      className="w-full sm:w-auto"
                      onClick={openCancelModal}
                    >
                      Cancelar Reserva
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Lógica de Calificación (Solo Huésped) */}
            {isGuest && reservation.status === "Completed" && (
              <div className="mt-2">{completedGuestReviewContent}</div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Desglose de Pago */}
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm sticky top-28 space-y-6">
            <h2 className="text-xl font-black text-slate-900">
              Información del pago
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>
                  {formatCurrency(reservation.pricePerNightAtBooking)} x{" "}
                  {nights} noches
                </span>
                <span>
                  {formatCurrency(reservation.pricePerNightAtBooking * nights)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Tarifa de limpieza</span>
                <span>{formatCurrency(reservation.cleaningFeeAtBooking)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Comisión de servicio</span>
                <span>{formatCurrency(reservation.serviceFeeAtBooking)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Impuestos</span>
                <span>{formatCurrency(reservation.taxesAtBooking)}</span>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between text-xl font-black text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(reservation.totalPrice)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <CancelReservationModal />
      <ReviewFormModal propertyId={reservation.propertyId} />
    </main>
  );
}

function ReservationDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-pulse">
      <Skeleton className="h-6 w-32 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-100 w-full rounded-[2.5rem]" />
          <Skeleton className="h-64 w-full rounded-4xl" />
        </div>
        <Skeleton className="h-112.5 w-full rounded-4xl" />
      </div>
    </div>
  );
}
