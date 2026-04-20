"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar } from "@/components/shared/Avatar";
import { Skeleton } from "@/components/shared/Skeleton";
import type { PropertyResponse } from "@/schemas/properties.schemas";

interface PropertyHostInfoProps {
  property: PropertyResponse;
}

/**
 * @description Muestra el resumen del anfitrión y la antigüedad del anuncio.
 * Alineado con el HostSummaryResponse anidado en el DTO de propiedades.
 */
export function PropertyHostInfo({
  property,
}: Readonly<PropertyHostInfoProps>) {
  // Formateamos la fecha: "abril de 2026"
  const joinedDate = property.createdAt
    ? format(new Date(property.createdAt), "MMMM 'de' yyyy", { locale: es })
    : "";

  return (
    <div className="flex items-center justify-between py-6 border-b border-slate-200">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-semibold text-slate-900 leading-tight">
          Anfitrión: {property.host.hostName}
        </h2>
        <p className="text-sm text-slate-500">Publicado en {joinedDate}</p>
      </div>

      <Avatar
        initials={property.host.hostName}
        size="lg"
        className="ring-4 ring-slate-50"
      />
    </div>
  );
}

export function PropertyHostInfoSkeleton() {
  return (
    <div className="flex items-center justify-between py-6 border-b border-slate-200">
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" className="h-6 w-48" />
        <Skeleton variant="text" className="h-4 w-32" />
      </div>
      <Skeleton variant="circular" className="h-14 w-14" />
    </div>
  );
}
