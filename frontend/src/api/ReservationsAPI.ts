import { handleApiError } from "@/helpers/handleApiError";
import { validateApiRes } from "@/helpers/validateApiRes";
import { api } from "@/lib/axios";
import {
  type CreateReservationRequest,
  type ReservationSearchRequest,
  type UpdateReservationStatusRequest,
  type CreatePropertyBlockRequest,
  type UpdatePropertyBlockRequest,
  type ReservationResponse,
  type PricePreviewResponse,
  type PropertyBlockResponse,
  reservationResponseSchema,
  pricePreviewResponseSchema,
  propertyBlockResponseSchema,
} from "@/schemas/reservations.schemas";

/**
 * @description Crea una nueva solicitud de reserva para una propiedad.
 * @param request - Detalles de la reserva a crear (ID de propiedad, fechas, número de huéspedes).
 */
export const createReservation = async (
  request: CreateReservationRequest,
): Promise<ReservationResponse> => {
  try {
    const { data } = await api.post("/reservations", request);
    return validateApiRes(data, reservationResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene el detalle de una reserva específica por su ID.
 * @param id - El ID de la reserva a consultar.
 */
export const getReservationById = async (
  id: string,
): Promise<ReservationResponse> => {
  try {
    const { data } = await api.get(`/reservations/${id}`);
    return validateApiRes(data, reservationResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Busca y filtra reservas (por propiedad, huésped, anfitrión, estado, o fechas).
 * @param request - Criterios de búsqueda para filtrar las reservas.
 */
export const searchReservations = async (
  request: ReservationSearchRequest,
): Promise<ReservationResponse[]> => {
  try {
    const { data } = await api.get("/reservations", { params: request });
    return validateApiRes(data, reservationResponseSchema.array());
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene una previsualización del desglose de precios antes de reservar.
 * @param propertyId - El ID de la propiedad para la cual se desea obtener el precio.
 * @param startDate - La fecha de inicio de la reserva.
 * @param endDate - La fecha de fin de la reserva.
 */
export const getPricePreview = async (
  propertyId: string,
  startDate: string,
  endDate: string,
): Promise<PricePreviewResponse> => {
  try {
    const { data } = await api.get("/reservations/price-preview", {
      params: { propertyId, startDate, endDate },
    });
    return validateApiRes(data, pricePreviewResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Actualiza el estado de una reserva (Confirmar o Cancelar).
 * @param id - El ID de la reserva a actualizar.
 * @param request - El nuevo estado que se desea establecer para la reserva.
 */
export const updateReservationStatus = async (
  id: string,
  request: UpdateReservationStatusRequest,
): Promise<ReservationResponse> => {
  try {
    const { data } = await api.patch(`/reservations/${id}/status`, request);
    return validateApiRes(data, reservationResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Permite a un Anfitrión bloquear fechas manualmente en una de sus propiedades.
 * @param propertyId - El ID de la propiedad para la cual se desea crear el bloqueo.
 * @param request - Detalles del bloqueo a crear (fechas y motivo opcional).
 */
export const createPropertyBlock = async (
  propertyId: string,
  request: CreatePropertyBlockRequest,
): Promise<PropertyBlockResponse> => {
  try {
    const { data } = await api.post(
      `/reservations/properties/${propertyId}/blocks`,
      request,
    );
    return validateApiRes(data, propertyBlockResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene todos los bloques de fechas establecidos para una propiedad específica.
 * @param propertyId - El ID de la propiedad para la cual se desean obtener los bloques.
 */
export const getPropertyBlocks = async (
  propertyId: string,
): Promise<PropertyBlockResponse[]> => {
  try {
    const { data } = await api.get(
      `/reservations/properties/${propertyId}/blocks`,
    );
    return validateApiRes(data, propertyBlockResponseSchema.array());
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Actualiza un bloqueo de fechas existente (requiere rol de Host).
 * @param id - El ID del bloqueo a actualizar.
 * @param request - Detalles actualizados del bloqueo (fechas y motivo opcional).
 */
export const updatePropertyBlock = async (
  id: string,
  request: UpdatePropertyBlockRequest,
): Promise<PropertyBlockResponse> => {
  try {
    const { data } = await api.put(`/reservations/blocks/${id}`, request);
    return validateApiRes(data, propertyBlockResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Elimina un bloqueo de fechas para volver a habilitar la disponibilidad.
 * @param id - El ID del bloqueo a eliminar.
 */
export const deletePropertyBlock = async (id: string): Promise<void> => {
  try {
    await api.delete(`/reservations/blocks/${id}`);
  } catch (error) {
    handleApiError(error);
  }
};
