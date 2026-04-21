// frontend/src/components/features/notifications/NotificationPopover.tsx
"use client";

import Link from "next/link";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

import { NotificationItem } from "./NotificationItem";
import { Skeleton } from "@/components/shared/Skeleton";
import { ROUTES } from "@/constants/routes";

import { useUnreadNotifications } from "@/hooks/notifications/useQueries";
import { useMarkAllAsRead } from "@/hooks/notifications/useMutation";
import { useNotificationRouting } from "@/hooks/shared/useNotificationsRouting";
import type { NotificationResponse } from "@/schemas/notifications.schemas";

interface NotificationPopoverProps {
  onClose: () => void;
}

export function NotificationPopover({
  onClose,
}: Readonly<NotificationPopoverProps>) {
  const { data: unreadNotifications, isLoading } = useUnreadNotifications();
  const { mutate: markAllAsRead, isPending: isMarking } = useMarkAllAsRead();
  const { routeToOrigin } = useNotificationRouting();

  const unreadCount = unreadNotifications?.length ?? 0;

  const handleNotificationClick = (notification: NotificationResponse) => {
    onClose(); // Cerramos el popover
    routeToOrigin(notification); // Navegamos inteligentemente
  };

  const notificationsContent = (() => {
    if (isLoading) {
      return (
        <div className="p-2 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      );
    }

    if (unreadCount === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-xs font-medium text-slate-400">
            No tienes mensajes pendientes
          </p>
        </div>
      );
    }

    return unreadNotifications?.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onClick={handleNotificationClick}
      />
    ));
  })();

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 border border-slate-100">
      {/* Header: Acciones rápidas */}
      <div className="flex items-center justify-between p-4 border-b border-slate-50 bg-slate-50/50">
        <h3 className="font-bold text-slate-900 text-sm">Notificaciones</h3>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            disabled={isMarking}
            className="text-[10px] font-bold text-primary-600 hover:cursor-pointer hover:text-primary-700 flex items-center gap-1 uppercase tracking-wider disabled:opacity-50 transition-colors"
          >
            <IoCheckmarkDoneOutline size={14} />
            Marcar todas
          </button>
        )}
      </div>

      {/* Cuerpo: Listado limitado o Skeletons */}
      <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {notificationsContent}
      </div>

      {/* Footer: Enlace al Centro de Notificaciones */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-50 text-center">
        <Link
          href={ROUTES.USER.NOTIFICATIONS}
          onClick={onClose}
          className="text-[11px] font-bold text-slate-500 hover:text-primary-600 transition-colors py-1 block uppercase tracking-widest"
        >
          Ver todo el historial
        </Link>
      </div>
    </div>
  );
}
