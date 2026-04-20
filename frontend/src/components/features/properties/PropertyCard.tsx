"use client";

import { MouseEvent } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { IoStar, IoChevronBack, IoChevronForward } from "react-icons/io5";

// Importamos nuestros átomos
import { Badge } from "@/components/shared/Badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { Avatar } from "@/components/shared/Avatar";

// Importamos el DTO real del backend
import type { PropertyResponse } from "@/schemas/properties.schemas";
import Image from "next/image";
import { formatCurrency } from "@/helpers/formatCurrency";

export interface PropertyCardProps {
  property: PropertyResponse;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const HYDRATION_SAFE_TIME = Date.now();

/**
 * @description Componente molecular principal para mostrar un alojamiento.
 * Utiliza el DTO real del backend y optimiza el rendimiento con useToggle y useEmblaCarousel.
 */
export function PropertyCard({ property }: Readonly<PropertyCardProps>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const isNew = property.createdAt
    ? new Date(property.createdAt).getTime() >
      HYDRATION_SAFE_TIME - THIRTY_DAYS_MS
    : false;

  const priceFormatted = formatCurrency(property.pricePerNight);

  const scrollPrev = (e: MouseEvent) => {
    e.preventDefault();
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = (e: MouseEvent) => {
    e.preventDefault();
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col gap-3 relative"
    >
      {/* Contenedor de Imagen y Carrusel */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-200">
        {/* Badges Flotantes */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2 items-start pointer-events-none">
          {property.averageRating && property.averageRating >= 4.8 ? (
            <Badge
              variant="brand"
              size="sm"
              className="shadow-sm backdrop-blur-md bg-white/90"
            >
              Top Host
            </Badge>
          ) : null}
          {isNew ? (
            <Badge
              variant="success"
              size="sm"
              dot
              className="shadow-sm backdrop-blur-md bg-white/90"
            >
              Nuevo
            </Badge>
          ) : null}
        </div>

        {/* Embla Carousel */}
        <div className="h-full w-full" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {property.imageUrls && property.imageUrls.length > 0 ? (
              property.imageUrls.map((src, index) => (
                <div
                  className="relative h-full min-w-0 flex-[0_0_100%]"
                  key={index}
                >
                  <Image
                    src={src}
                    alt={`Foto ${index + 1} de ${property.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index === 0} // Sustituye al 'loading="eager"' en next/image
                  />
                </div>
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                <span>Sin imágenes</span>
              </div>
            )}
          </div>
        </div>

        {/* Controles del Carrusel (Aparecen al hover en Desktop) */}
        {property.imageUrls && property.imageUrls.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-slate-800 opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-white hover:scale-105 group-hover:opacity-100 hover:cursor-pointer focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary-500 z-10"
              aria-label="Imagen anterior"
            >
              <IoChevronBack size={18} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-slate-800 opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-white hover:scale-105 group-hover:opacity-100 hover:cursor-pointer focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary-500 z-10"
              aria-label="Siguiente imagen"
            >
              <IoChevronForward size={18} />
            </button>
          </>
        )}
      </div>

      {/* Contenido (Textos) */}
      <div className="flex justify-between gap-2 px-1">
        <div className="flex flex-col overflow-hidden">
          <h3 className="font-semibold text-slate-900 truncate">
            {property.location}
          </h3>
          <p className="text-sm text-slate-500 truncate">{property.title}</p>

          <div className="mt-1 flex items-center gap-1 text-sm">
            <span className="font-semibold text-slate-900">
              {priceFormatted}
            </span>
            <span className="text-slate-500">noche</span>
          </div>
        </div>

        {/* Puntuación y Host */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
            <IoStar className="text-amber-400" />
            <span>
              {property.averageRating
                ? property.averageRating.toFixed(2)
                : "Nuevo"}
            </span>
          </div>
          <Avatar
            initials={property.host?.hostName}
            size="sm"
            className="mt-1 ring-2 ring-white"
          />
        </div>
      </div>
    </Link>
  );
}

/**
 * @description Esqueleto para el estado de carga de la PropertyCard.
 * Mantiene exactamente las mismas proporciones para evitar saltos en el DOM (CLS).
 */
export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Imagen */}
      <Skeleton variant="rectangular" className="aspect-square w-full" />

      {/* Contenido */}
      <div className="flex justify-between gap-2 px-1">
        <div className="flex w-full flex-col gap-2">
          <Skeleton variant="text" className="h-5 w-2/3" />
          <Skeleton variant="text" className="h-4 w-1/2" />
          <Skeleton variant="text" className="mt-1 h-5 w-1/3" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton variant="text" className="h-5 w-8" />
          <Skeleton variant="circular" className="h-8 w-8 mt-1" />
        </div>
      </div>
    </div>
  );
}
