import {
  createPropertyBlock,
  createReservation,
  deletePropertyBlock,
  updatePropertyBlock,
  updateReservationStatus,
} from "@/api/ReservationsAPI";
import { propertyKeys, reservationKeys } from "@/lib/queryKeys";
import type {
  CreatePropertyBlockRequest,
  UpdatePropertyBlockRequest,
  UpdateReservationStatusRequest,
} from "@/schemas/reservations.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook para crear una nueva reserva.
 */
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: (data) => {
      toast.success("¡Reserva creada con éxito!");

      // Invalidamos las búsquedas de reservas para que aparezca en la lista del huésped
      queryClient.invalidateQueries({ queryKey: reservationKeys.search() });

      // Invalidamos la disponibilidad de la propiedad para bloquear esas fechas a otros
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(data.propertyId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al procesar la reserva.");
    },
  });
}

/**
 * @description Hook para cambiar el estado de una reserva (Confirmar, Cancelar).
 */
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateReservationStatusRequest;
    }) => updateReservationStatus(id, request),
    onSuccess: (data) => {
      toast.success(`La reserva ha sido marcada como ${data.status}.`);

      // Actualizamos directamente el detalle de la reserva en caché
      queryClient.setQueryData(reservationKeys.detail(data.id), data);

      // Invalidamos las listas
      queryClient.invalidateQueries({ queryKey: reservationKeys.search() });

      // Si se cancela, debemos liberar las fechas invalidando la propiedad
      if (data.status === "Cancelled") {
        queryClient.invalidateQueries({
          queryKey: propertyKeys.detail(data.propertyId),
        });
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "No se pudo actualizar el estado de la reserva.",
      );
    },
  });
}

/**
 * @description Hook para que un Anfitrión bloquee fechas manualmente en su propiedad.
 */
export function useCreatePropertyBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      request,
    }: {
      propertyId: string;
      request: CreatePropertyBlockRequest;
    }) => createPropertyBlock(propertyId, request),
    onSuccess: (data) => {
      toast.success("Fechas bloqueadas correctamente.");

      // Actualizamos la lista de bloqueos de esa propiedad
      queryClient.invalidateQueries({
        queryKey: reservationKeys.blocks(data.propertyId),
      });
      // Invalidamos la disponibilidad pública de la propiedad
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(data.propertyId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al bloquear las fechas.");
    },
  });
}

/**
 * @description Hook para actualizar un bloqueo de fechas manual.
 */
export function useUpdatePropertyBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdatePropertyBlockRequest;
    }) => updatePropertyBlock(id, request),
    onSuccess: (data) => {
      toast.success("Bloqueo actualizado.");

      queryClient.invalidateQueries({
        queryKey: reservationKeys.blocks(data.propertyId),
      });
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(data.propertyId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo actualizar el bloqueo.");
    },
  });
}

/**
 * @description Hook para eliminar un bloqueo de fechas manual.
 */
export function useDeletePropertyBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) =>
      deletePropertyBlock(id),
    onSuccess: (_, variables) => {
      toast.success("Bloqueo eliminado", {
        description: "Las fechas bloqueadas vuelven a estar disponibles.",
      });

      // Usamos el propertyId inyectado para limpiar exactamente las queries necesarias
      queryClient.invalidateQueries({
        queryKey: reservationKeys.blocks(variables.propertyId),
      });
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(variables.propertyId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el bloqueo.");
    },
  });
}
