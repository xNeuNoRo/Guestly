import {
  getPropertyBlocks,
  getPricePreview,
  getReservationById,
  searchReservations,
} from "@/api/ReservationsAPI";
import { reservationKeys } from "@/lib/queryKeys";
import type { ReservationSearchRequest } from "@/schemas/reservations.schemas";
import { useQuery } from "@tanstack/react-query";

/**
 * @description Hook para obtener los detalles de una reserva específica.
 * @param id El ID de la reserva.
 */
export function useReservation(id?: string) {
  const validId = id ?? "";

  return useQuery({
    queryKey: reservationKeys.detail(validId),
    queryFn: () => getReservationById(validId),
    enabled: !!id, // Solo se ejecuta si el ID está presente
  });
}

/**
 * @description Hook para buscar y filtrar reservas.
 * @param params Criterios de búsqueda (propiedad, usuario, fechas, estado).
 */
export function useSearchReservations(params: ReservationSearchRequest = {}) {
  return useQuery({
    queryKey: reservationKeys.search(params),
    queryFn: () => searchReservations(params),
    staleTime: 1000 * 60 * 5, // 5 minutos de caché para evitar spam de peticiones
  });
}

/**
 * @description Hook para obtener una previsualización de precios antes de confirmar una reserva.
 * @param propertyId ID de la propiedad.
 * @param startDate Fecha de check-in.
 * @param endDate Fecha de check-out.
 */
export function usePricePreview(
  propertyId?: string,
  startDate?: string,
  endDate?: string,
) {
  const validPropertyId = propertyId ?? "";
  const validStart = startDate ?? "";
  const validEnd = endDate ?? "";

  return useQuery({
    queryKey: reservationKeys.pricePreview(validPropertyId, validStart, validEnd),
    queryFn: () => getPricePreview(validPropertyId, validStart, validEnd),
    // Solo dispara la cotización cuando el usuario ha seleccionado las dos fechas
    enabled: !!propertyId && !!startDate && !!endDate,
  });
}

/**
 * @description Hook para obtener los bloques manuales de disponibilidad de una propiedad.
 * @param propertyId ID de la propiedad.
 */
export function usePropertyBlocks(propertyId?: string) {
  const validPropertyId = propertyId ?? "";

  return useQuery({
    queryKey: reservationKeys.blocks(validPropertyId),
    queryFn: () => getPropertyBlocks(validPropertyId),
    enabled: !!propertyId,
  });
}