// frontend/src/components/layout/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHome, IoSearchOutline } from "react-icons/io5";

import { PropertySearchBar } from "@/components/features/properties/PropertySearchBar";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/shared/Button";

import { useAuth } from "@/hooks/stores/useAuth";
import { useScroll } from "@/hooks/shared/useScroll";
import { ROUTES } from "@/constants/routes";
import { JSX } from "react";

/**
 * @description Componente de navegación principal.
 * Adapta su barra de búsqueda central dependiendo de la ruta actual.
 */
export function Navbar() {
  const { isAuthenticated } = useAuth();
  const { y } = useScroll();
  const pathname = usePathname();

  // ARSENAL: Control de renderizado por rutas
  const isHomePage = pathname === ROUTES.PUBLIC.HOME;
  const isExplorePage = pathname === "/explore";

  // Cambiamos el estilo si el usuario ha hecho scroll
  const isScrolled = y > 20;

  let desktopSearchContent: JSX.Element | null = null;
  if (isExplorePage) {
    // En Explore: Mostramos el buscador completo (tu PropertySearchBar es compacta por diseño, así que encaja perfecto)
    desktopSearchContent = <PropertySearchBar isCompact />;
  } else if (!isHomePage) {
    // En otras páginas (Perfil, Reservas): Mostramos un botón píldora que redirige a Explore
    desktopSearchContent = (
      <Link href="/explore">
        <button className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 hover:cursor-pointer hover:bg-slate-100 border border-slate-200 rounded-full transition-colors text-slate-500 font-medium text-sm shadow-sm group">
          <span className="bg-primary-600 p-1.5 rounded-full text-white group-hover:scale-105 transition-transform">
            <IoSearchOutline size={14} className="stroke-[3px]" />
          </span>
          <span>¿A dónde vas?</span>
        </button>
      </Link>
    );
  }

  let mobileSearchContent: JSX.Element | null = null;
  if (isExplorePage) {
    mobileSearchContent = <PropertySearchBar isCompact />;
  } else if (!isHomePage) {
    mobileSearchContent = (
      <Link href="/explore" className="w-full block">
        <button className="flex w-full items-center justify-center gap-3 px-5 py-3 hover:cursor-pointer bg-slate-50 border border-slate-200 rounded-full text-slate-500 font-medium text-sm shadow-sm">
          <IoSearchOutline size={18} className="text-primary-600" />
          Buscar destinos o propiedades...
        </button>
      </Link>
    );
  }

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

          {/* ARSENAL: ZONA CENTRAL DINÁMICA */}
          <div className="flex-1 max-w-2xl hidden md:flex justify-center">
            {desktopSearchContent}
          </div>

          {/* ACCIONES DE USUARIO */}
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

        {/* ZONA MÓVIL DINÁMICA */}
        <div className="mt-4 md:hidden">{mobileSearchContent}</div>
      </div>
    </nav>
  );
}
