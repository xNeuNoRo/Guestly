"use client";

import Link from "next/link";
import { IoHome } from "react-icons/io5";

import { PropertySearchBar } from "@/components/features/properties/PropertySearchBar";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/shared/Button";

import { useAuth } from "@/hooks/stores/useAuth";
import { useScroll } from "@/hooks/shared/useScroll";
import { ROUTES } from "@/constants/routes";

/**
 * @description Componente de navegación principal.
 * Integra la búsqueda, notificaciones y menú de usuario con un diseño pegajoso (sticky).
 */
export function Navbar() {
  const { isAuthenticated } = useAuth();
  const { y } = useScroll();

  // Cambiamos el estilo si el usuario ha hecho scroll
  const isScrolled = y > 20;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={ROUTES.PUBLIC.HOME}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors shrink-0"
          >
            <div className="p-2 bg-primary-50 rounded-xl">
              <IoHome size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter hidden sm:block">
              GUESTLY
            </span>
          </Link>

          <div className="flex-1 max-w-2xl hidden md:block">
            <PropertySearchBar />
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.AUTH.LOGIN}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl font-bold"
                  >
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href={ROUTES.AUTH.REGISTER}>
                  <Button
                    size="sm"
                    className="rounded-xl font-bold shadow-lg shadow-primary-500/20"
                  >
                    Regístrate
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 md:hidden">
          <PropertySearchBar />
        </div>
      </div>
    </nav>
  );
}
