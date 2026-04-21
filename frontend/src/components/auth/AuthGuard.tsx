"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/stores/useAuth";
import { useIsMounted } from "@/hooks/shared/useIsMounted";
import { useMyProfile } from "@/hooks/users/useQueries"; // <--- CRUCIAL: Importar el hook de perfil
import { GuardConfig } from "@/types/auth";
import { ROUTES } from "@/constants/routes";

interface AuthGuardProps extends GuardConfig {
  children: ReactNode;
  allowGuests?: boolean;
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
  const { isAuthenticated, user, token } = useAuth();

  // Sincronizamos con la petición de perfil que ya se está ejecutando en el AuthLoader.
  // Usamos status para detectar el gap entre el fin de la carga y el inicio de la autenticación en el store.
  const { isLoading, isFetching, status } = useMyProfile();

  /**
   * ESTADO DE VERIFICACIÓN (Limbo)
   * Si tenemos un token persistido pero Zustand aún dice que no estamos autenticados,
   * y la query de perfil está en curso o ya terminó exitosamente pero el store no se ha enterado,
   * significa que estamos re-validando la sesión.
   * Debemos esperar antes de tomar cualquier decisión de redirección.
   */
  const isVerifying = !!token && !isAuthenticated && status !== "error";

  console.log("[AuthGuard: Render]", {
    pathname,
    isMounted,
    isAuthenticated,
    hasToken: !!token,
    queryStatus: status,
    isLoading,
    isFetching,
    isVerifying,
    publicOnly,
    allowGuests,
  });

  useEffect(() => {
    console.log("[AuthGuard: Effect Start]", {
      isMounted,
      isVerifying,
      isAuthenticated,
      pathname,
    });

    // Si no ha montado o el sistema está verificando el token, bloqueamos cualquier redirección.
    if (!isMounted || isVerifying) return;

    // --- LÓGICA DE REDIRECCIÓN (Solo se ejecuta si NO estamos verificando) ---

    // Rutas "Solo Públicas" (Login/Register)
    if (publicOnly && isAuthenticated) {
      console.log("[AuthGuard: Rule Check] publicOnly && isAuthenticated");
      // Si no lo ha confirmado, permitimos que se quede para que el Wizard muestre el Paso 2.
      if (user?.isEmailConfirmed) {
        const isHost = user?.role?.includes("Host");
        const target = isHost ? ROUTES.HOST.DASHBOARD : ROUTES.PUBLIC.HOME;
        router.replace(target);
      }
      return;
    }

    // Bloqueo de usuarios no confirmados (Global)
    if (isAuthenticated && user && !user.isEmailConfirmed) {
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
    requireEmailConfirmed,
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
