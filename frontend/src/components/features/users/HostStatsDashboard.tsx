"use client";

import { motion } from "framer-motion";
import {
  IoCashOutline,
  IoHomeOutline,
  IoCalendarOutline,
  IoTimeOutline,
} from "react-icons/io5";

import { Skeleton } from "@/components/shared/Skeleton";
import { formatCurrency } from "@/helpers/formatCurrency";
import { useHostDashboardStats } from "@/hooks/users/useQueries";

/**
 * @description Panel de control operativo para el rol Host.
 * Renderiza métricas financieras y de gestión con animaciones fluidas y tipado estricto.
 */
export function HostStatsDashboard() {
  const { data: stats, isLoading, isError, error } = useHostDashboardStats();

  // Configuración de animaciones para la entrada de las tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["metric-1", "metric-2", "metric-3", "metric-4"].map((id) => (
          <Skeleton key={id} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-sm font-medium">
        {error?.message ||
          "No se pudieron cargar las estadísticas del anfitrión."}
      </div>
    );
  }

  const metrics = [
    {
      label: "Ingresos Totales",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: <IoCashOutline size={22} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Propiedades",
      value: stats?.totalProperties ?? 0,
      icon: <IoHomeOutline size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Reservas Totales",
      value: stats?.totalReservations ?? 0,
      icon: <IoCalendarOutline size={22} />,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "Pendientes",
      value: stats?.pendingReservations ?? 0,
      icon: <IoTimeOutline size={22} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      alert: (stats?.pendingReservations ?? 0) > 0,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {metrics.map((metric) => (
        <motion.div
          key={metric.label}
          variants={itemVariants}
          className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-2xl ${metric.bg} ${metric.color} transition-colors`}
            >
              {metric.icon}
            </div>
            {metric.alert && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              {metric.label}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">
              {metric.value}
            </h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
