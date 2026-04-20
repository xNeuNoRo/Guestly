"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/stores/useAuth";
import { useIsMounted } from "@/hooks/shared/useIsMounted";
import { GuardConfig } from "@/types/auth";
import { ROUTES } from "@/constants/routes";

interface AuthGuardProps extends GuardConfig {
  children: ReactNode;
  allowGuests?: boolean; // Permitir visualización a no logueados (como en la Landing)
}

export function AuthGuard({
  children,
  allowedRoles,
  requireEmailConfirmed = false,
  publicOnly = false,
  allowGuests = false,
}: Readonly<AuthGuardProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isMounted) return;

    // Rutas "Solo Públicas" (Login/Register)
    if (publicOnly && isAuthenticated) {
      // Si no lo ha confirmado, permitimos que se quede para que el Wizard muestre el Paso 2.
      if (user?.isEmailConfirmed) {
        const isHost = user?.role?.includes("Host");
        router.replace(isHost ? ROUTES.HOST.DASHBOARD : ROUTES.PUBLIC.HOME);
      }
      return;
    }

    // PRIORIDAD PARA EL RESTO DE LA APP: Bloqueo de usuarios no confirmados
    // Si la ruta no es pública y el usuario no está confirmado, lo mandamos a verificar.
    if (isAuthenticated && user && !user.isEmailConfirmed) {
      if (pathname !== ROUTES.USER.VERIFY_EMAIL) {
        router.replace(ROUTES.USER.VERIFY_EMAIL);
      }
      return;
    }

    // Rutas Privadas (Requieren login)
    if (!publicOnly && !isAuthenticated && !allowGuests) {
      router.replace(ROUTES.AUTH.LOGIN);
      return;
    }

    // Verificación de Roles (RBAC)
    if (isAuthenticated && allowedRoles && user) {
      const hasAllowedRole = user.role.some((role) =>
        allowedRoles.includes(role),
      );
      if (!hasAllowedRole) {
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
    allowGuests,
    router,
    pathname,
  ]);

  if (!isMounted) return null;

  const isUnconfirmed = isAuthenticated && user && !user.isEmailConfirmed;

  // Renderizado preventivo sincronizado
  const shouldBlock =
    // Bloqueamos en la app general si no está confirmado
    (!publicOnly && isUnconfirmed && pathname !== ROUTES.USER.VERIFY_EMAIL) ||
    // Bloqueamos rutas privadas si no hay sesión
    (!publicOnly && !isAuthenticated && !allowGuests) ||
    // Bloqueamos rutas públicas SOLO si ya está confirmado
    (publicOnly && isAuthenticated && user?.isEmailConfirmed) ||
    // Bloqueamos por roles
    (allowedRoles && user && !user.role.some((r) => allowedRoles.includes(r)));

  return shouldBlock ? null : <>{children}</>;
}
