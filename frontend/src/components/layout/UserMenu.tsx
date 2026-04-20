"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import {
  IoCalendarOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoBusinessOutline,
  IoStatsChartOutline,
} from "react-icons/io5";

import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/hooks/stores/useAuth";
import { ROUTES } from "@/constants/routes";

/**
 * @description Menú desplegable del usuario autenticado.
 * Muestra información básica, enlaces de navegación según su rol (Guest/Host) y la acción de cerrar sesión.
 */
export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  const isHost = user.role?.includes("Host");
  const fullName = `${user.firstName} ${user.lastName}`;

  const handleLogout = () => {
    logout();
    router.push(ROUTES.PUBLIC.HOME);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex items-center gap-2 rounded-full hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 hover:opacity-90 transition-opacity">
        <Avatar
          initials={user.firstName[0] + user.lastName[0]}
          size="md"
          className="shadow-sm border border-slate-200"
        />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95 translate-y-1"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100 translate-y-0"
        leaveTo="opacity-0 scale-95 translate-y-1"
      >
        <MenuItems className="absolute right-0 z-50 mt-3 w-64 origin-top-right rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 border border-slate-100 focus:outline-none overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <p className="text-sm font-bold text-slate-900 truncate">
              {fullName}
            </p>
            <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
              {user.email}
            </p>
          </div>

          <div className="p-2 space-y-1">
            {/* Mi Perfil Público */}
            <MenuItem>
              {({ focus }) => (
                <Link
                  href={ROUTES.PUBLIC.USER_PROFILE(user.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    focus ? "bg-slate-50 text-primary-600" : "text-slate-700"
                  }`}
                >
                  <IoPersonOutline
                    size={18}
                    className={focus ? "text-primary-500" : "text-slate-400"}
                  />
                  Mi Perfil
                </Link>
              )}
            </MenuItem>

            <MenuItem>
              {({ focus }) => (
                <Link
                  href={ROUTES.USER.RESERVATIONS}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    focus ? "bg-slate-50 text-primary-600" : "text-slate-700"
                  }`}
                >
                  <IoCalendarOutline
                    size={18}
                    className={focus ? "text-primary-500" : "text-slate-400"}
                  />
                  Mis Viajes
                </Link>
              )}
            </MenuItem>

            {isHost && (
              <>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      href={ROUTES.HOST.PROPERTIES}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                        focus
                          ? "bg-primary-50 text-primary-700"
                          : "text-slate-700"
                      }`}
                    >
                      <IoBusinessOutline
                        size={18}
                        className={
                          focus ? "text-primary-600" : "text-slate-400"
                        }
                      />
                      Mis Propiedades
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      href={ROUTES.HOST.DASHBOARD}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                        focus
                          ? "bg-primary-50 text-primary-700"
                          : "text-slate-700"
                      }`}
                    >
                      <IoStatsChartOutline
                        size={18}
                        className={
                          focus ? "text-primary-600" : "text-slate-400"
                        }
                      />
                      Panel de Anfitrión
                    </Link>
                  )}
                </MenuItem>
              </>
            )}
          </div>

          <div className="p-2 border-t border-slate-100 space-y-1 bg-slate-50/30">
            <MenuItem>
              {({ focus }) => (
                <Link
                  href={ROUTES.USER.SETTINGS}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    focus ? "bg-slate-50 text-slate-900" : "text-slate-700"
                  }`}
                >
                  <IoSettingsOutline size={18} className="text-slate-400" />
                  Configuración
                </Link>
              )}
            </MenuItem>

            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleLogout}
                  className={`hover:cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold rounded-xl transition-colors text-left ${
                    focus ? "bg-red-50 text-red-600" : "text-red-500"
                  }`}
                >
                  <IoLogOutOutline
                    size={18}
                    className={focus ? "text-red-500" : "text-red-400"}
                  />
                  Cerrar sesión
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
