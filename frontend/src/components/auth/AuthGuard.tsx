"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useIsMounted } from "@/hooks/shared/useIsMounted";
import { GuardConfig } from "@/types/auth";
import { ROUTES } from "@/constants/routes";

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
  const { isAuthenticated, user } = useAppStore();

  useEffect(() => {
    if (!isMounted) return;

    if (publicOnly && isAuthenticated) {
      router.replace(ROUTES.HOST.DASHBOARD);
      return;
    }

    if (!publicOnly && !isAuthenticated) {
      router.replace(ROUTES.AUTH.LOGIN);
      return;
    }

    if (
      isAuthenticated &&
      requireEmailConfirmed &&
      user &&
      !user.isEmailConfirmed
    ) {
      router.replace(ROUTES.USER.VERIFY_EMAIL);
      return;
    }

    if (isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        router.replace(ROUTES.UNAUTHORIZED);
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

  // Renderizado preventivo
  const shouldBlock =
    (!publicOnly && !isAuthenticated) ||
    (publicOnly && isAuthenticated) ||
    (requireEmailConfirmed && user && !user.isEmailConfirmed);

  return shouldBlock ? null : <>{children}</>;
}
