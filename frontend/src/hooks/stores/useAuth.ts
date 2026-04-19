import { useAppStore } from "@/stores/useAppStore";

/**
 * @description Hook personalizado para acceder a la información de autenticación y funciones relacionadas.
 * @returns Un objeto con el token, perfil de usuario, estado de autenticación y funciones para actualizar el estado o cerrar sesión.
 */
export function useAuth() {
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const setAuth = useAppStore((state) => state.setAuth);
  const setUser = useAppStore((state) => state.setUser);
  const logout = useAppStore((state) => state.logout);

  return { token, user, isAuthenticated, setAuth, setUser, logout };
}
