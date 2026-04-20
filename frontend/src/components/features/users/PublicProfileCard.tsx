"use client";

import { motion } from "framer-motion";
import {
  IoShieldCheckmarkSharp,
  IoCalendarOutline,
  IoPersonOutline,
} from "react-icons/io5";

import { Avatar } from "@/components/shared/Avatar";
import { Skeleton } from "@/components/shared/Skeleton";
import { Badge } from "@/components/shared/Badge";

import { usePublicProfile } from "@/hooks/users/useQueries";

interface PublicProfileCardProps {
  userId: string;
  className?: string;
}

/**
 * @description Tarjeta pública del usuario.
 * Estrictamente vinculada al PublicProfileResponse (nombre, apellido, fecha de creación).
 */
export function PublicProfileCard({
  userId,
  className,
}: Readonly<PublicProfileCardProps>) {
  const { data: profile, isLoading, isError, error } = usePublicProfile(userId);

  // Formateo de fecha de creación para mostrar "Miembro desde [Mes Año]"
  const memberSince = profile?.createdAt
    ? new Intl.DateTimeFormat("es-ES", {
        month: "long",
        year: "numeric",
      }).format(profile.createdAt)
    : "";

  // --- ESTADO DE CARGA ---
  if (isLoading) {
    return (
      <div
        className={`w-full bg-white rounded-3xl border border-slate-200 p-8 flex flex-col md:flex-row gap-6 items-center ${className}`}
      >
        <Skeleton className="w-28 h-28 rounded-full shrink-0" />
        <div className="space-y-3 w-full text-center md:text-left">
          <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
          <Skeleton className="h-4 w-40 mx-auto md:mx-0" />
          <div className="flex justify-center md:justify-start gap-2 pt-2">
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="w-full p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-slate-500">
        <p>
          {error?.message ||
            "No se pudo cargar el perfil público de este usuario."}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Avatar sin foto (El componente generará las iniciales con el alt) */}
        <div className="relative shrink-0">
          <Avatar
            alt={`${profile.firstName} ${profile.lastName}`}
            size="xl"
            className="w-28 h-28 border-4 border-white shadow-sm group-hover:scale-105 transition-transform bg-primary-50 text-primary-700 font-bold text-3xl"
          />
          {/* Sello de confianza genérico */}
          <div
            className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm"
            title="Usuario Verificado"
          >
            <IoShieldCheckmarkSharp size={16} />
          </div>
        </div>

        {/* Información Principal (Estrictamente Schema) */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-2 tracking-tight">
            Hola, soy {profile.firstName} {profile.lastName}
          </h2>

          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-medium mb-4">
            <IoCalendarOutline size={18} />
            <span>Miembro desde {memberSince}</span>
          </div>

          {/* Badges de Presentación */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <Badge
              variant="success"
              className="pl-2 pr-3 py-1 gap-1.5 font-semibold bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <IoShieldCheckmarkSharp size={14} />
              Identidad Confirmada
            </Badge>
            <Badge
              variant="neutral"
              className="pl-2 pr-3 py-1 gap-1.5 font-semibold"
            >
              <IoPersonOutline size={14} />
              Miembro de Guestly
            </Badge>
          </div>
        </div>

        {/* Panel lateral de estadísticas (Preparado estructuralmente) */}
        <div className="hidden lg:flex flex-col justify-center border-l border-slate-100 pl-8 min-w-40 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Estatus de Cuenta
            </p>
            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Activa
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
