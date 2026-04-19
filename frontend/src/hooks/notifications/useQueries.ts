import {
  getAllNotifications,
  getUnreadNotifications,
} from "@/api/NotificationsAPI";
import { useAuth } from "@/hooks/stores/useAuth";
import { notificationKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

/**
 * @description Hook para obtener el historial completo de notificaciones del usuario.
 */
export function useNotifications() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: getAllNotifications,
    // Las notificaciones son privadas, solo consultamos si hay sesión activa
    enabled: isAuthenticated, 
  });
}

/**
 * @description Hook para obtener únicamente las notificaciones no leídas.
 * Ideal para el contador (badge) en la campana de notificaciones de la UI.
 */
export function useUnreadNotifications() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: getUnreadNotifications,
    enabled: isAuthenticated,
    // Refrescamos cada minuto (HTTP Polling) para mantener el contador 
    // actualizado sin necesidad de WebSockets (aunque esa sería la mejor opción a futuro)
    refetchInterval: 1000 * 60, 
  });
}