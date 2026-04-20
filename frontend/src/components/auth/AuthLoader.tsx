"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/stores/useAuth";
import { useMyProfile } from "@/hooks/users/useQueries";

/**
 * @description Sincroniza la sesión persistente (token) con el estado global (user).
 */
export function AuthLoader() {
  const { token, setAuth, isAuthenticated } = useAuth();

  // Obtenemos el perfil. React Query se encarga de reintentos y caché.
  const { data: response, isSuccess } = useMyProfile();

  // Usamos un ref para evitar llamadas duplicadas a setAuth en el mismo ciclo
  const hasHydrated = useRef(false);

  useEffect(() => {
    console.log("AuthLoader - Token:", token);
    console.log("AuthLoader - isSuccess:", isSuccess);
    console.log("AuthLoader - isAuthenticated:", isAuthenticated);
    console.log("AuthLoader - Response:", response);
    console.log("AuthLoader - Has Hydrated:", hasHydrated.current);
    // Solo sincronizamos si:
    // 1. Tenemos un token.
    // 2. La petición fue exitosa.
    // 3. No estamos marcados como autenticados en memoria.
    // 4. El usuario existe en la respuesta.
    if (
      token &&
      isSuccess &&
      !isAuthenticated &&
      response &&
      !hasHydrated.current
    ) {
      // Pasamos el usuario directamente, ya que `response` ya es el perfil
      setAuth(token, response);
      hasHydrated.current = true;
    }
  }, [token, isSuccess, isAuthenticated, response, setAuth]);

  return null;
}
