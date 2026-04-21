import { handleApiError } from "@/helpers/handleApiError";
import { validateApiRes } from "@/helpers/validateApiRes";
import { api } from "@/lib/axios";
import {
  type CreateReviewRequest,
  type UpdateReviewRequest,
  type ReviewResponse,
  reviewResponseSchema,
} from "@/schemas/reviews.schemas";

/**
 * @description Crea una nueva reseña para una reserva completada.
 * @param request - Datos de la reseña (propiedad, reserva, calificación y comentario).
 * @returns La reseña creada.
 */
export const createReview = async (
  request: CreateReviewRequest,
): Promise<ReviewResponse> => {
  try {
    const { data } = await api.post("/reviews", request);
    return validateApiRes(data, reviewResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Actualiza el comentario o la calificación de una reseña existente.
 * @param id - ID de la reseña.
 * @param request - Nueva calificación y comentario.
 * @returns La reseña actualizada.
 */
export const updateReview = async (
  id: string,
  request: UpdateReviewRequest,
): Promise<ReviewResponse> => {
  try {
    const { data } = await api.put(`/reviews/${id}`, request);
    return validateApiRes(data, reviewResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Elimina permanentemente una reseña (solo por su autor).
 * @param id - ID de la reseña a eliminar.
 */
export const deleteReview = async (id: string): Promise<void> => {
  try {
    await api.delete(`/reviews/${id}`);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene los detalles de una reseña específica.
 * @param id - ID de la reseña.
 */
export const getReviewById = async (id: string): Promise<ReviewResponse> => {
  try {
    const { data } = await api.get(`/reviews/${id}`);
    return validateApiRes(data, reviewResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene la reseña asociada a una reserva específica (si existe).
 * @param reservationId - ID de la reserva.
 */
export const getReviewByReservation = async (
  reservationId: string,
): Promise<ReviewResponse> => {
  try {
    const { data } = await api.get(`/reviews/reservations/${reservationId}`);
    return validateApiRes(data, reviewResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene todas las reseñas de una propiedad específica.
 * @param propertyId - ID de la propiedad.
 * @returns Lista de reseñas asociadas a la propiedad.
 */
export const getReviewsByProperty = async (
  propertyId: string,
): Promise<ReviewResponse[]> => {
  try {
    const { data } = await api.get(`/reviews/properties/${propertyId}`);
    return validateApiRes(data, reviewResponseSchema.array());
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene todas las reseñas escritas por un usuario.
 * @param userId - ID del usuario/huésped.
 * @returns Lista de reseñas escritas por el usuario.
 */
export const getReviewsByUser = async (
  userId: string,
): Promise<ReviewResponse[]> => {
  try {
    const { data } = await api.get(`/reviews/users/${userId}`);
    return validateApiRes(data, reviewResponseSchema.array());
  } catch (error) {
    handleApiError(error);
  }
};
