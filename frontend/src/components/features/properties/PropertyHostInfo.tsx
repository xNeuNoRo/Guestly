"use client";

import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar } from "@/components/shared/Avatar";
import { Skeleton } from "@/components/shared/Skeleton";
import type { PropertyResponse } from "@/schemas/properties.schemas";
import { ROUTES } from "@/constants/routes";

interface PropertyHostInfoProps {
  property: PropertyResponse;
}

/**
 * @description Muestra el resumen del anfitrión y la antigüedad del anuncio.
 * Añade enlaces directos para visitar el perfil público del host.
 */
export function PropertyHostInfo({
  property,
}: Readonly<PropertyHostInfoProps>) {
  // Formateamos la fecha: "abril de 2026"
  const joinedDate = property.createdAt
    ? format(new Date(property.createdAt), "MMMM 'de' yyyy", { locale: es })
    : "";

  // Construimos la URL al perfil público usando el hostId
  const profileUrl = ROUTES.PUBLIC.USER_PROFILE(property.host.hostId);

  return (
    <div className="flex items-center justify-between py-6 border-b border-slate-200">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-slate-900 leading-tight">
          Anfitrión:{" "}
          <Link
            href={profileUrl}
            className="hover:underline decoration-2 decoration-primary-500 underline-offset-4 transition-all"
          >
            {property.host.hostName}
          </Link>
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Publicado en {joinedDate}
        </p>
      </div>

      <Link
        href={profileUrl}
        className="shrink-0"
        aria-label={`Ver perfil de ${property.host.hostName}`}
      >
        <Avatar
          initials={property.host.hostName}
          size="lg"
          className="ring-4 ring-slate-50 hover:ring-primary-100 hover:scale-105 hover:shadow-md cursor-pointer"
        />
      </Link>
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
