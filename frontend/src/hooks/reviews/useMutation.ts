import { createReview, deleteReview, updateReview } from "@/api/ReviewsAPI";
import { reviewKeys } from "@/lib/queryKeys";
import type { UpdateReviewRequest } from "@/schemas/reviews.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook para crear una nueva reseña en una propiedad.
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      toast.success("¡Gracias por compartir tu experiencia!");

      // Actualizamos directamente el detalle en caché
      queryClient.setQueryData(reviewKeys.detail(data.id), data);

      // Invalidamos las listas donde debe aparecer esta nueva reseña
      queryClient.invalidateQueries({
        queryKey: reviewKeys.byProperty(data.propertyId),
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.byUser(data.guestId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al publicar la reseña.");
    },
  });
}

/**
 * @description Hook para actualizar una reseña existente (calificación o comentario).
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateReviewRequest;
    }) => updateReview(id, request),
    onSuccess: (data) => {
      toast.success("Reseña actualizada correctamente.");

      // Actualizamos la caché específica de la reseña
      queryClient.setQueryData(reviewKeys.detail(data.id), data);

      // Invalidamos las listas asociadas
      queryClient.invalidateQueries({
        queryKey: reviewKeys.byProperty(data.propertyId),
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.byUser(data.guestId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo actualizar la reseña.");
    },
  });
}

/**
 * @description Hook para eliminar una reseña permanentemente.
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      propertyId,
      userId,
    }: {
      id: string;
      propertyId?: string;
      userId?: string;
    }) => deleteReview(id),
    onSuccess: (_, variables) => {
      toast.success("Reseña eliminada.");

      // Limpiamos la reseña de la caché
      queryClient.removeQueries({
        queryKey: reviewKeys.detail(variables.id),
      });

      // Invalidamos las listas si nos proporcionaron los IDs correspondientes
      if (variables.propertyId) {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.byProperty(variables.propertyId),
        });
      }
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.byUser(variables.userId),
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar la reseña.");
    },
  });
}
