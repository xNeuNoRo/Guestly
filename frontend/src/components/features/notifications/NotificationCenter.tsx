"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoNotificationsOutline, IoCheckmarkDoneOutline } from "react-icons/io5";

import { NotificationItem } from "./NotificationItem";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/shared/Button";

import { useNotifications } from "@/hooks/notifications/useQueries";
import { useMarkAllAsRead } from "@/hooks/notifications/useMutation";

/**
 * @description Centro de Notificaciones (Organismo).
 * Gestiona el historial completo con capacidad de filtrado
 * y acciones masivas, utilizando el arsenal de estados de carga.
 */
export function NotificationCenter() {
  // Estado para filtrado local (Todos vs No leídos)
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Fetching de todas las notificaciones
  const { data: notifications, isLoading, isError } = useNotifications();
  const { mutate: markAllAsRead, isPending: isMarking } = useMarkAllAsRead();

  // Filtrado reactivo en el cliente para máxima velocidad
  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    if (filter === "unread") return notifications.filter((n) => !n.isRead);
    return notifications;
  }, [notifications, filter]);

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  const renderNotificationsContent = () => {
    if (isLoading) {
      return (
        <>
          {/* Skeletons de carga masiva */}
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </>
      );
    }

    if (filteredNotifications.length === 0) {
      return (
        /* Estado vacío (Empty State) */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-6">
            <IoNotificationsOutline size={40} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Bandeja limpia
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            {filter === "unread"
              ? "No tienes mensajes pendientes por leer. ¡Excelente gestión!"
              : "Aún no has recibido ninguna notificación importante."}
          </p>
        </motion.div>
      );
    }

    return (
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  if (isError) {
    return (
      <div className="p-12 text-center bg-red-50 rounded-4xl border border-red-100">
        <p className="text-red-600 font-medium">
          Error al sincronizar tus notificaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* CABECERA DEL CENTRO DE CONTROL */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Centro de Notificaciones
          </h1>
          <p className="text-slate-500 mt-1">
            Tienes{" "}
            <span className="font-bold text-primary-600">{unreadCount}</span>{" "}
            mensajes sin leer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de Filtro Atómico */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === "unread"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              No leídas
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => markAllAsRead()}
            isLoading={isMarking}
            disabled={unreadCount === 0}
            className="rounded-xl font-bold"
            leftIcon={<IoCheckmarkDoneOutline size={18} />}
          >
            Marcar todo
          </Button>
        </div>
      </header>

      {/* LISTADO DE NOTIFICACIONES */}
      <div className="space-y-4">{renderNotificationsContent()}</div>
    </div>
  );
}
