import {
  markAllAsRead,
  markAsRead,
  markAsUnread,
} from "@/api/NotificationsAPI";
import { notificationKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook para marcar una notificación específica como leída.
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // Invalidamos para que la notificación se vea gris/leída y baje el contador
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al marcar como leída.");
    },
  });
}

/**
 * @description Hook para revertir una notificación al estado de "No Leída".
 */
export function useMarkAsUnread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsUnread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al marcar como no leída.");
    },
  });
}

/**
 * @description Hook para marcar todas las notificaciones del usuario como leídas en una sola acción.
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      toast.success("Todas las notificaciones han sido marcadas como leídas.");
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudieron actualizar las notificaciones.");
    },
  });
}