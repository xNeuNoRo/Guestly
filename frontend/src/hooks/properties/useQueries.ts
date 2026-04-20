import {
  getPropertiesByHost,
  getPropertyAvailability,
  getPropertyById,
  searchProperties,
} from "@/api/PropertiesAPI";
import { useAuth } from "@/hooks/stores/useAuth";
import { propertyKeys } from "@/lib/queryKeys";
import type { PropertySearchRequest } from "@/schemas/properties.schemas";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/**
 * @description Hook para buscar propiedades con filtros (ubicación, fechas, capacidad, etc.).
 * @param params - Objeto con los filtros opcionales para la búsqueda.
 */
export function useSearchProperties(params: PropertySearchRequest = {}) {
  return useQuery({
    // React Query serializa los params automáticamente para crear una caché única por búsqueda
    queryKey: propertyKeys.search(params),
    queryFn: () => searchProperties(params),
    staleTime: 1000 * 60 * 5, // 5 minutos para evitar recargar búsquedas recientes
    placeholderData: keepPreviousData,
  });
}

/**
 * @description Hook para obtener los detalles completos de una propiedad.
 * @param id - El ID de la propiedad que se desea consultar.
 */
export function useProperty(id?: string) {
  const validId = id ?? "";

  return useQuery({
    queryKey: propertyKeys.detail(validId),
    queryFn: () => getPropertyById(validId),
    enabled: !!id, // Solo ejecuta la petición si el ID existe
  });
}

/**
 * @description Hook para obtener las fechas bloqueadas/reservadas de una propiedad.
 * @param id - ID de la propiedad.
 * @param startDate - Rango inicial de la consulta.
 * @param endDate - Rango final de la consulta.
 */
export function usePropertyAvailability(
  id?: string,
  startDate?: string,
  endDate?: string,
) {
  const validId = id ?? "";
  const validStart = startDate ?? "";
  const validEnd = endDate ?? "";

  return useQuery({
    queryKey: propertyKeys.availability(validId, validStart, validEnd),
    queryFn: () => getPropertyAvailability(validId, validStart, validEnd),
    enabled: !!id && !!startDate && !!endDate, // Requiere los tres parámetros
  });
}

/**
 * @description Hook para obtener la lista de propiedades publicadas por el Anfitrión autenticado.
 */
export function useHostProperties() {
  const { isAuthenticated, user } = useAuth();
  const isHost = user?.role.includes("Host");

  return useQuery({
    queryKey: propertyKeys.byHost(),
    queryFn: getPropertiesByHost,
    // Asegura que la llamada solo ocurra si el usuario está logueado y tiene el rol correcto
    enabled: isAuthenticated && isHost,
  });
}
