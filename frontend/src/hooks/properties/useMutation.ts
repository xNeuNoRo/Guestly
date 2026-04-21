import {
  createProperty,
  deleteProperty,
  updateProperty,
} from "@/api/PropertiesAPI";
import { propertyKeys } from "@/lib/queryKeys";
import type {
  PropertyResponse,
  UpdatePropertyRequest,
} from "@/schemas/properties.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook para crear una nueva propiedad (Alojamiento).
 * Invalida la lista del Host para que aparezca inmediatamente en su panel de control.
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      toast.success("¡Propiedad publicada exitosamente!");
      // Invalidamos las queries del anfitrión y el buscador general para refrescar la data
      queryClient.invalidateQueries({ queryKey: propertyKeys.byHost() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.searchBase() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo crear la propiedad.");
    },
  });
}

/**
 * @description Hook para actualizar los datos o imágenes de una propiedad existente.
 * Realiza una actualización pesimista sobre los detalles de la propiedad editada.
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    // Empaquetamos los argumentos en un objeto ya que useMutation solo acepta un parámetro
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdatePropertyRequest;
    }) => updateProperty(id, request),
    onSuccess: (data) => {
      toast.success("Propiedad actualizada", {
        description: "Los cambios se han guardado correctamente.",
      });

      // Actualizamos directamente la caché de los detalles de esta propiedad específica
      queryClient.setQueryData(propertyKeys.detail(data.id), data);

      // Invalidamos las listas para mantener la consistencia
      queryClient.invalidateQueries({ queryKey: propertyKeys.byHost() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.searchBase() });
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar", {
        description: error.message || "No se pudieron guardar los cambios.",
      });
    },
  });
}

/**
 * @description Hook para eliminar permanentemente una propiedad de la plataforma.
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: (_, deletedId) => {
      // Removemos la propiedad de la lista del Host sin tener que hacer otro fetch
      queryClient.setQueryData(
        propertyKeys.byHost(),
        (oldData: PropertyResponse[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((property) => property.id !== deletedId);
        },
      );

      // Limpiamos la caché global de esa propiedad y el buscador general
      queryClient.removeQueries({ queryKey: propertyKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.searchBase() });
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar", {
        description:
          error.message ||
          "No se pudo eliminar la propiedad. Inténtalo de nuevo.",
      });
    },
  });
}
