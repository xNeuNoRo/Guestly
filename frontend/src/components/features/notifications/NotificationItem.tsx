"use client";

import { JSX, useMemo } from "react";
import { motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoInformationCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoStarOutline,
  IoEllipse,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

import {
  useMarkAsRead,
  useMarkAsUnread,
} from "@/hooks/notifications/useMutation";
import type {
  NotificationResponse,
  NotificationType,
} from "@/schemas/notifications.schemas";

interface NotificationItemProps {
  notification: NotificationResponse;
  onClick?: (notification: NotificationResponse) => void;
}

/**
 * @description Molécula para renderizar una notificación individual.
 * Basada estrictamente en el DTO de C#: Id, UserId, Title, Message, Type, IsRead, CreatedAt.
 */
export function NotificationItem({
  notification,
  onClick,
}: Readonly<NotificationItemProps>) {
  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markUnread } = useMarkAsUnread();

  // Mapeo de iconos basado en NotificationTypes (Enum de C#)
  const typeConfig = useMemo(() => {
    const configs: Record<
      NotificationType,
      { icon: JSX.Element; color: string; bg: string }
    > = {
      System: {
        icon: <IoInformationCircleOutline size={20} />,
        color: "text-slate-500",
        bg: "bg-slate-50",
      },
      ReservationRequested: {
        icon: <IoCalendarOutline size={20} />,
        color: "text-primary-500",
        bg: "bg-primary-50",
      },
      ReservationConfirmed: {
        icon: <IoCheckmarkCircleOutline size={20} />,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
      },
      ReservationCancelled: {
        icon: <IoCloseCircleOutline size={20} />,
        color: "text-red-500",
        bg: "bg-red-50",
      },
      ReservationCompleted: {
        icon: <IoStarOutline size={20} />,
        color: "text-amber-500",
        bg: "bg-amber-50",
      },
    };

    return configs[notification.type];
  }, [notification.type]);

  const timeAgo = useMemo(() => {
    return formatDistanceToNow(notification.createdAt, {
      addSuffix: true,
      locale: es,
    });
  }, [notification.createdAt]);

  const handleAction = () => {
    // Marcamos como leída si no lo está, pero no navegamos (DTO ciego)
    if (!notification.isRead) {
      markRead(notification.id);
    }
    onClick?.(notification);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ x: 4 }}
      onClick={handleAction}
      className={`group relative flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
        notification.isRead
          ? "bg-white border-transparent"
          : "bg-slate-50 border-slate-100 shadow-sm"
      }`}
    >
      {/* Indicador de estado No Leído */}
      {!notification.isRead && (
        <div className="absolute top-4 right-4">
          <IoEllipse className="text-primary-500 animate-pulse" size={10} />
        </div>
      )}

      {/* Icono de Tipo */}
      <div
        className={`p-3 rounded-xl shrink-0 h-fit ${typeConfig.bg} ${typeConfig.color}`}
      >
        {typeConfig.icon}
      </div>

      {/* Contenido textual */}
      <div className="flex-1 min-w-0 pr-4">
        <h4
          className={`text-sm font-bold truncate tracking-tight mb-0.5 ${
            notification.isRead ? "text-slate-600" : "text-slate-900"
          }`}
        >
          {notification.title}
        </h4>
        <p
          className={`text-xs leading-relaxed line-clamp-2 ${
            notification.isRead ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {notification.message}
        </p>
        <span className="text-[10px] font-bold text-slate-400 mt-2 block uppercase tracking-widest">
          {timeAgo}
        </span>
      </div>

      {/* --- ARSENAL: Toggle de lectura (Check para leer / Punto para desmarcar) --- */}
      <div className="absolute hover:cursor-pointer bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (notification.isRead) {
              markUnread(notification.id);
            } else {
              markRead(notification.id);
            }
          }}
          className="p-1.5 text-slate-300 hover:text-primary-500 hover:cursor-pointer hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100 transition-all flex items-center justify-center"
          title={
            notification.isRead ? "Marcar como no leído" : "Marcar como leído"
          }
        >
          {notification.isRead ? (
            <IoEllipse size={10} className="mx-1 text-slate-200" />
          ) : (
            <IoCheckmarkDoneOutline size={18} />
          )}
        </button>
      </div>
    </motion.div>
  );
}
