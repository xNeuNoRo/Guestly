"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/stores/useAuth";
import { useIsMounted } from "@/hooks/shared/useIsMounted";
import { useMyProfile } from "@/hooks/users/useQueries";
import { GuardConfig } from "@/types/auth";
import { ROUTES } from "@/constants/routes";

interface AuthGuardProps extends Omit<GuardConfig, "requireEmailConfirmed"> {
  children: ReactNode;
  allowGuests?: boolean;
  allowUnconfirmed?: boolean; // Por defecto es false
}

export function AuthGuard({
  children,
  allowedRoles,
  allowUnconfirmed = false,
  publicOnly = false,
  allowGuests = false,
}: Readonly<AuthGuardProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { isAuthenticated, user, token } = useAuth();
  const { status } = useMyProfile();

  const isVerifying = !!token && !isAuthenticated && status !== "error";

  useEffect(() => {
    // Si no ha montado o el sistema está verificando el token, bloqueamos cualquier redirección.
    if (!isMounted || isVerifying) return;

    // Rutas "Solo Públicas" (Login/Register)
    if (publicOnly && isAuthenticated) {
      if (user?.isEmailConfirmed) {
        const isHost = user?.role?.includes("Host");
        const target = isHost ? ROUTES.HOST.DASHBOARD : ROUTES.PUBLIC.HOME;
        router.replace(target);
      }
      return;
    }

    // Si está autenticado, no está confirmado y NO le dimos permiso explícito (allowUnconfirmed=true)
    if (
      isAuthenticated &&
      user &&
      !user.isEmailConfirmed &&
      !allowUnconfirmed
    ) {
      if (pathname !== ROUTES.USER.VERIFY_EMAIL) {
        router.replace(ROUTES.USER.VERIFY_EMAIL);
      }
      return;
    }

    // Rutas Privadas (Requieren login)
    // Solo redirigimos a login si NO estamos verificando y realmente no hay sesión.
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
    isVerifying,
    isAuthenticated,
    user,
    allowedRoles,
    allowUnconfirmed,
    publicOnly,
    allowGuests,
    router,
    pathname,
  ]);

  // Mientras el componente monta o el sistema verifica el token, no renderizamos NADA.
  // Esto evita el flash de contenido protegido o el flash de la página de login.
  if (!isMounted || isVerifying) return null;

  const isUnconfirmed = isAuthenticated && user && !user.isEmailConfirmed;

  // Renderizado preventivo sincronizado con las redirecciones de arriba
  const shouldBlock =
    // Bloqueamos globalmente si no está confirmado y no tiene permiso especial de allowUnconfirmed
    (!publicOnly &&
      isUnconfirmed &&
      !allowUnconfirmed &&
      pathname !== ROUTES.USER.VERIFY_EMAIL) ||
    (!publicOnly && !isAuthenticated && !allowGuests) ||
    // Bloqueamos rutas públicas SOLO si ya está confirmado
    (publicOnly && isAuthenticated && user?.isEmailConfirmed) ||
    // Bloqueamos por roles
    (allowedRoles && user && !user.role.some((r) => allowedRoles.includes(r)));

  return shouldBlock ? null : <>{children}</>;
}
