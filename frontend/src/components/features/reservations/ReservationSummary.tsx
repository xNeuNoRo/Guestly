"use client";

import { differenceInDays, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  IoDocumentTextOutline,
  IoLocationOutline,
  IoCalendarOutline,
} from "react-icons/io5";

import { formatCurrency } from "@/helpers/formatCurrency";
import { ReservationStatusBadge } from "./ReservationStatusBadge";
import type { ReservationResponse } from "@/schemas/reservations.schemas";

interface ReservationSummaryProps {
  reservation: ReservationResponse;
}

/**
 * @description Componente de resumen financiero y logístico de una reserva confirmada.
 * Utiliza datos históricos (AtBooking) para garantizar que la información sea inmutable.
 */
export function ReservationSummary({
  reservation,
}: Readonly<ReservationSummaryProps>) {
  const nights = differenceInDays(
    new Date(reservation.checkOutDate),
    new Date(reservation.checkInDate),
  );

  const formatDate = (date: Date) =>
    format(new Date(date), "PPP", { locale: es });

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Cabecera de Identificación */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
              {reservation.propertyTitle}
            </h3>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <IoLocationOutline /> {reservation.propertyLocation}
            </p>
          </div>
          <ReservationStatusBadge status={reservation.status} size="md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
            <IoCalendarOutline className="text-primary-600" size={20} />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Llegada
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {formatDate(reservation.checkInDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
            <IoCalendarOutline className="text-primary-600" size={20} />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Salida
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {formatDate(reservation.checkOutDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose Financiero (Snapshot Histórico) */}
      <div className="p-6 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
          <IoDocumentTextOutline size={18} className="text-slate-400" />
          Detalles del pago
        </h4>

        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>
              {formatCurrency(reservation.pricePerNightAtBooking)} x {nights}{" "}
              noches
            </span>
            <span className="font-medium text-slate-900">
              {formatCurrency(reservation.pricePerNightAtBooking * nights)}
            </span>
          </div>

          {reservation.cleaningFeeAtBooking > 0 && (
            <div className="flex justify-between">
              <span>Gastos de limpieza</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(reservation.cleaningFeeAtBooking)}
              </span>
            </div>
          )}

          {reservation.serviceFeeAtBooking > 0 && (
            <div className="flex justify-between">
              <span>Comisión por servicio Guestly</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(reservation.serviceFeeAtBooking)}
              </span>
            </div>
          )}

          {reservation.taxesAtBooking > 0 && (
            <div className="flex justify-between">
              <span>Impuestos</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(reservation.taxesAtBooking)}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-base font-bold text-slate-900">
            Total (USD)
          </span>
          <span className="text-xl font-black text-primary-700">
            {formatCurrency(reservation.totalPrice)}
          </span>
        </div>
      </div>

      {/* Información del Host (Contexto Rápido) */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Gestionado por{" "}
          <span className="font-semibold text-slate-700">
            {reservation.hostName}
          </span>
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          ID de reserva: {reservation.id}
        </p>
      </div>
    </div>
  );
}
