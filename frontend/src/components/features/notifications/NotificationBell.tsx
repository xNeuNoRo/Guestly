"use client";

import { Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { IoNotificationsOutline } from "react-icons/io5";

import { NotificationPopover } from "./NotificationPopover";
import { useUnreadNotifications } from "@/hooks/notifications/useQueries";

/**
 * @description Átomo de acceso para notificaciones.
 * Muestra un badge dinámico y dispara el popover con las alertas no leídas.
 */
export function NotificationBell() {
  // Obtenemos solo las no leídas para alimentar el badge dinámico
  const { data: unreadNotifications } = useUnreadNotifications();
  const unreadCount = unreadNotifications?.length ?? 0;

  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <PopoverButton
            className="relative p-2.5 text-slate-500 hover:cursor-pointer hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label={`${unreadCount} notificaciones no leídas`}
          >
            <IoNotificationsOutline size={24} />

            {/* Badge dinámico */}
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-primary-500 text-[10px] font-bold text-white leading-none">
                  {unreadCount > 9 ? "+9" : unreadCount}
                </span>
              </span>
            )}
          </PopoverButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel className="absolute right-0 z-50 mt-3 w-80 sm:w-96 transform">
              <NotificationPopover onClose={close} />
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
