import {
  getReviewById,
  getReviewByReservation,
  getReviewsByProperty,
  getReviewsByUser,
} from "@/api/ReviewsAPI";
import { reviewKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

/**
 * @description Hook para obtener los detalles de una reseña específica.
 * @param id - El ID de la reseña que se desea consultar.
 */
export function useReview(id?: string) {
  const validId = id ?? "";

  return useQuery({
    queryKey: reviewKeys.detail(validId),
    queryFn: () => getReviewById(validId),
    enabled: !!id, // Solo se ejecuta si el ID existe
  });
}

/**
 * @description Hook para obtener la reseña asociada a una reserva específica (si existe).
 * @param reservationId - El ID de la reserva para la cual se desea obtener la reseña.
 * @returns Un objeto de React Query con la reseña asociada a la reserva, o undefined si no existe.
 */
export function useReviewByReservation(reservationId?: string) {
  const validReservationId = reservationId ?? "";

  return useQuery({
    queryKey: reviewKeys.byReservation(validReservationId),
    queryFn: () => getReviewByReservation(validReservationId),
    enabled: !!reservationId, // Solo se ejecuta si el ID de reserva existe
  });
}

/**
 * @description Hook para obtener todas las reseñas asociadas a una propiedad.
 * @param propertyId - El ID de la propiedad.
 */
export function usePropertyReviews(propertyId?: string) {
  const validPropertyId = propertyId ?? "";

  return useQuery({
    queryKey: reviewKeys.byProperty(validPropertyId),
    queryFn: () => getReviewsByProperty(validPropertyId),
    enabled: !!propertyId,
  });
}

/**
 * @description Hook para obtener todas las reseñas escritas por un usuario específico.
 * @param userId - El ID del usuario o huésped.
 */
export function useUserReviews(userId?: string) {
  const validUserId = userId ?? "";

  return useQuery({
    queryKey: reviewKeys.byUser(validUserId),
    queryFn: () => getReviewsByUser(validUserId),
    enabled: !!userId,
  });
}
