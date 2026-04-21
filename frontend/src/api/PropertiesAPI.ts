import { handleApiError } from "@/helpers/handleApiError";
import { objectToFormData } from "@/helpers/objectToFormData";
import { validateApiRes } from "@/helpers/validateApiRes";
import { api } from "@/lib/axios";
import {
  type PropertyResponse,
  type DateRangeResponse,
  type PropertySearchRequest,
  type CreatePropertyRequest,
  type UpdatePropertyRequest,
  propertyResponseSchema,
  dateRangeResponseSchema,
} from "@/schemas/properties.schemas";

/**
 * @description Busca propiedades basándose en filtros opcionales.
 * @param request - Filtros de búsqueda (ubicación, fechas, capacidad, precio).
 * @returns Lista de propiedades que coinciden con la búsqueda.
 */
export const searchProperties = async (
  request: PropertySearchRequest,
): Promise<PropertyResponse[]> => {
  try {
    const { data } = await api.get("/properties", { params: request });
    return validateApiRes(data, propertyResponseSchema.array());
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene los detalles de una propiedad específica por su ID.
 * @param id - GUID de la propiedad.
 */
export const getPropertyById = async (
  id: string,
): Promise<PropertyResponse> => {
  try {
    const { data } = await api.get(`/properties/${id}`);
    return validateApiRes(data, propertyResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Verifica las fechas reservadas de una propiedad en un rango específico.
 * @param id - GUID de la propiedad.
 */
export const getPropertyAvailability = async (
  id: string,
  startDate: string,
  endDate: string,
): Promise<DateRangeResponse[]> => {
  try {
    const { data } = await api.get(`/properties/${id}/availability`, {
      params: { startDate, endDate },
    });
    return validateApiRes(data, dateRangeResponseSchema.array());
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Lista todas las propiedades publicadas por el Host autenticado.
 * @returns Lista de propiedades del anfitrión.
 */
export const getPropertiesByHost = async (): Promise<PropertyResponse[]> => {
  try {
    const { data } = await api.get("/properties/host");
    return validateApiRes(data, propertyResponseSchema.array());
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Crea una nueva propiedad enviando datos y archivos (Multipart).
 * @param request - Datos de la propiedad e imágenes.
 */
export const createProperty = async (
  request: CreatePropertyRequest,
): Promise<PropertyResponse> => {
  try {
    const formData = objectToFormData(request);
    const { data } = await api.post("/properties", formData);
    return validateApiRes(data, propertyResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Actualiza una propiedad existente, permitiendo subir nuevas fotos o borrar anteriores.
 */
export const updateProperty = async (
  id: string,
  request: UpdatePropertyRequest,
): Promise<PropertyResponse> => {
  try {
    const formData = objectToFormData(request);
    const { data } = await api.put(`/properties/${id}`, formData);
    return validateApiRes(data, propertyResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Elimina una propiedad permanentemente.
 * @param id - GUID de la propiedad a eliminar.
 */
export const deleteProperty = async (id: string): Promise<void> => {
  try {
    await api.delete(`/properties/${id}`);
  } catch (error) {
    handleApiError(error);
  }
};
