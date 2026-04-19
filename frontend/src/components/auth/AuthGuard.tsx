"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useIsMounted } from "@/hooks/shared/useIsMounted";
import { GuardConfig } from "@/types/auth";

interface AuthGuardProps extends GuardConfig {
  children: ReactNode;
}

/**
 * @description Componente de protección de rutas.
 * Maneja autenticación, roles y validación de estado de cuenta.
 */
export function AuthGuard({
  children,
  allowedRoles,
  requireEmailConfirmed = false,
  publicOnly = false,
}: Readonly<AuthGuardProps>) {
  const router = useRouter();
  const isMounted = useIsMounted();

  // Extraemos el estado de Zustand
  const { isAuthenticated, user } = useAppStore();

  useEffect(() => {
    if (!isMounted) return;

    // En caso de ruta solo pública (Login/Registro) y el usuario ya está logueado
    if (publicOnly && isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    // En caso de ruta privada y el usuario NO está logueado
    if (!publicOnly && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    // En caso de que requiera email confirmado
    if (
      isAuthenticated &&
      requireEmailConfirmed &&
      user &&
      !user.isEmailConfirmed
    ) {
      router.replace("/verify-email");
      return;
    }

    // En caso de que requiera rol específico
    if (isAuthenticated && allowedRoles && user) {
      const hasPermission = allowedRoles.includes(user.role);
      if (!hasPermission) {
        router.replace("/unauthorized");
      }
    }
  }, [
    isMounted,
    isAuthenticated,
    user,
    allowedRoles,
    requireEmailConfirmed,
    publicOnly,
    router,
  ]);

  // Mientras se monta o se verifica la sesión, mostramos un estado neutro
  // para evitar que el contenido privado se vea por un milisegundo.
  if (!isMounted) return null;

  // Lógica de renderizado preventivo
  if (!publicOnly && !isAuthenticated) return null;
  if (publicOnly && isAuthenticated) return null;
  if (requireEmailConfirmed && user && !user.isEmailConfirmed) return null;

  return <>{children}</>;
}
