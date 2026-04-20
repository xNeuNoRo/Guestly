"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/stores/useAuth";
import { useIsMounted } from "@/hooks/shared/useIsMounted";
import { GuardConfig } from "@/types/auth";
import { ROUTES } from "@/constants/routes";

interface AuthGuardProps extends GuardConfig {
  children: ReactNode;
}

/**
 * @description Componente de protección de rutas.
 * Maneja autenticación, roles y enrutamiento inteligente basado en el tipo de usuario.
 */
export function AuthGuard({
  children,
  allowedRoles,
  requireEmailConfirmed = false,
  publicOnly = false,
}: Readonly<AuthGuardProps>) {
  const router = useRouter();
  const isMounted = useIsMounted();
  // Arsenal: Usamos useAuth para consistencia con el resto de la app
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isMounted) return;

    // Rutas "Solo Públicas" (Login/Register)
    if (publicOnly && isAuthenticated && user?.isEmailConfirmed) {
      // Enrutamiento inteligente: Host -> Dashboard | Guest -> Home/Reservas
      const isHost = user?.role?.includes("Host");
      router.replace(isHost ? ROUTES.HOST.DASHBOARD : ROUTES.PUBLIC.HOME);
      return;
    } else if (isAuthenticated && user && !user.isEmailConfirmed) {
      router.replace(ROUTES.USER.VERIFY_EMAIL);
      return;
    }

    // Rutas Privadas
    if (!publicOnly && !isAuthenticated) {
      router.replace(ROUTES.AUTH.LOGIN);
      return;
    }

    // Verificación de Correo (Si es requerida)
    if (
      isAuthenticated &&
      requireEmailConfirmed &&
      user &&
      !user.isEmailConfirmed
    ) {
      router.replace(ROUTES.USER.SETTINGS);
      return;
    }

    // Verificación de Roles (RBAC)
    if (isAuthenticated && allowedRoles && user) {
      const hasAllowedRole = user.role.some((role) =>
        allowedRoles.includes(role),
      );
      if (!hasAllowedRole) {
        // Redirigimos al home si no tiene permiso, en lugar de una pantalla muerta
        router.replace(ROUTES.PUBLIC.HOME);
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

  if (!isMounted) return null;

  // Renderizado preventivo estricto
  const shouldBlock =
    (!publicOnly && !isAuthenticated) ||
    (publicOnly && isAuthenticated && user?.isEmailConfirmed) ||
    (requireEmailConfirmed && user && !user.isEmailConfirmed) ||
    (allowedRoles && user && !user.role.some((r) => allowedRoles.includes(r)));

  return shouldBlock ? null : <>{children}</>;
}
