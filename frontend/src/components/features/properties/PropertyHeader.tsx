"use client";

import { IoStar, IoShareOutline, IoLocationOutline } from "react-icons/io5";
import { toast } from "sonner";

import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import type { PropertyResponse } from "@/schemas/properties.schemas";

export interface PropertyHeaderProps {
  property: PropertyResponse;
}

/**
 * @description Componente molecular para la cabecera del detalle de propiedad.
 * A diferencia de la Card, este componente establece el H1 de la página y
 * ofrece acciones específicas como compartir.
 */
export function PropertyHeader({ property }: Readonly<PropertyHeaderProps>) {
  const handleShare = () => {
    navigator.clipboard.writeText(globalThis.location.href);
    toast.success("Enlace copiado", {
      description: "Se ha copiado la URL de la propiedad al portapapeles.",
    });
  };

  const hasReviews = property.totalReviews > 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Título y Acciones */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {property.title}
        </h1>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            leftIcon={<IoShareOutline size={18} />}
            className="text-slate-600 hover:text-slate-900 underline decoration-slate-300 underline-offset-4"
          >
            Compartir
          </Button>
        </div>
      </div>

      {/* Meta Información (Rating, Reviews, Ubicación) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
        {/* Puntuación Detallada */}
        <div className="flex items-center gap-1">
          <IoStar className="text-amber-400" size={16} />
          <span className="text-slate-900">
            {hasReviews ? property.averageRating?.toFixed(2) : "Nuevo"}
          </span>
          {hasReviews && (
            <>
              <span className="text-slate-400">·</span>
              <button className="text-slate-600 underline decoration-slate-400 underline-offset-4 hover:text-slate-900 transition-colors">
                {property.totalReviews}{" "}
                {property.totalReviews === 1 ? "reseña" : "reseñas"}
              </button>
            </>
          )}
        </div>

        <span className="hidden sm:block text-slate-300">·</span>

        {/* Badge de Anfitrión Destacado (Misma lógica que la Card) */}
        {property.averageRating && property.averageRating >= 4.8 && (
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">
              Top Host
            </Badge>
            <span className="hidden sm:block text-slate-300">·</span>
          </div>
        )}

        {/* Ubicación */}
        <div className="flex items-center gap-1 text-slate-600">
          <IoLocationOutline size={16} className="shrink-0" />
          <span className="underline decoration-slate-400 underline-offset-4">
            {property.location}
          </span>
        </div>
      </div>
    </div>
  );
}
