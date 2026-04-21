// frontend/app/(main)/notifications/page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoNotificationsOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";

import { useNotifications } from "@/hooks/notifications/useQueries";
import { useMarkAllAsRead } from "@/hooks/notifications/useMutation";
import { NotificationItem } from "@/components/features/notifications/NotificationItem";
import { Button } from "@/components/shared/Button";
import { Skeleton } from "@/components/shared/Skeleton";
import { AuthGuard } from "@/components/auth/AuthGuard";

import { useNotificationRouting } from "@/hooks/shared/useNotificationsRouting";
import type { NotificationResponse } from "@/schemas/notifications.schemas";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { routeToOrigin } = useNotificationRouting();

  const { data: notifications, isLoading, isError } = useNotifications();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    if (filter === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(() => {
    return notifications?.filter((n) => !n.isRead).length ?? 0;
  }, [notifications]);

  const handleNotificationClick = (notification: NotificationResponse) => {
    routeToOrigin(notification);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="mt-12 p-8 bg-red-50 border border-red-100 rounded-3xl text-center text-red-600 font-medium">
          No pudimos cargar tus notificaciones. Por favor, intenta recargar la
          página.
        </div>
      );
    }

    if (filteredNotifications.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 py-24 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center"
        >
          <div className="h-20 w-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
            <IoNotificationsOutline size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Todo al día</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            {filter === "unread"
              ? "No tienes notificaciones pendientes por leer."
              : "Aún no tienes notificaciones en tu historial. Aquí aparecerán las actualizaciones importantes de tu cuenta."}
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div layout className="mt-6 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <NotificationItem
                notification={notification}
                onClick={handleNotificationClick}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <AuthGuard>
      <main className="container mx-auto px-4 py-12 max-w-3xl min-h-screen">
        {/* Cabecera Principal */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                <IoNotificationsOutline size={28} />
              </div>
              Notificaciones
            </h1>
            <p className="text-slate-500 mt-3 font-medium text-lg">
              Mantente al día con tus reservas y la actividad de tu cuenta.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead()}
              isLoading={isMarkingAll}
              leftIcon={<IoCheckmarkDoneOutline size={18} />}
              className="shrink-0 rounded-xl"
            >
              Marcar {unreadCount} como leídas
            </Button>
          )}
        </header>

        {/* Filtros Estilo Pill */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              filter === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              filter === "unread"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            No leídas
            {unreadCount > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  filter === "unread"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Listado con Animaciones */}
        {renderContent()}
      </main>
    </AuthGuard>
  );
}
