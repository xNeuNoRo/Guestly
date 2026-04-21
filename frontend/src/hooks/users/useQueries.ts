import {
  getHostDashboardStats,
  getMyProfile,
  getPublicProfile,
} from "@/api/UsersAPI";
import { useAuth } from "@/hooks/stores/useAuth";
import { userKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

/**
 * @description Hook para obtener el perfil completo del usuario autenticado.
 * Solo se ejecuta si el usuario tiene una sesión activa validada por Zustand.
 */
export function useMyProfile() {
  const { token } = useAuth();

  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyProfile,
    enabled: !!token, // Evita disparar la petición si no hay token
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura
  });
}

/**
 * @description Hook para obtener el perfil público de cualquier usuario.
 * @param id El ID del usuario que se desea obtener.
 */
export function usePublicProfile(id?: string) {
  const validId = id ?? "";

  return useQuery({
    queryKey: userKeys.publicProfile(validId),
    queryFn: () => getPublicProfile(validId),
    enabled: !!id, // Solo ejecutar si tenemos un ID válido
  });
}

/**
 * @description Hook para obtener las estadísticas del panel de control de un Anfitrión.
 * Solo se ejecuta si el usuario está autenticado y tiene el rol "Host".
 */
export function useHostDashboardStats() {
  const { user } = useAuth();
  const isHost = user?.role.includes("Host") ?? false;

  return useQuery({
    queryKey: userKeys.hostDashboard(),
    queryFn: getHostDashboardStats,
    enabled: isHost, // Previene errores 403 bloqueando la petición desde el cliente
  });
}