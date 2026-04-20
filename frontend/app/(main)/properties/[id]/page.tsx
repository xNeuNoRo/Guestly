"use client";

import { use } from "react";
import { PropertyHeader } from "@/components/features/properties/PropertyHeader";
import { PropertyGallery } from "@/components/features/properties/PropertyGallery";
import { PropertyDescription } from "@/components/features/properties/PropertyDescription";
import { PropertyStats } from "@/components/features/properties/PropertyStats";
import {
  PropertyHostInfo,
  PropertyHostInfoSkeleton,
} from "@/components/features/properties/PropertyHostInfo";
import { PropertyReviewsSection } from "@/components/features/reviews/PropertyReviewsSection";
import { BookingForm } from "@/components/features/reservations/BookingForm";
import { Skeleton } from "@/components/shared/Skeleton";

import { useProperty } from "@/hooks/properties/useQueries";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * @description Página de detalle de propiedad.
 * Orquesta la visualización completa de un alojamiento y el proceso de reserva.
 */
export default function PropertyDetailPage({
  params,
}: Readonly<PropertyDetailPageProps>) {
  // Next.js 15: Desenvolvemos el ID de forma asíncrona
  const { id } = use(params);

  // Hook centralizado para obtener toda la info de la propiedad
  const { data: property, isLoading, isError } = useProperty(id);

  // --- ESTADO DE CARGA (SKELETONS) ---
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-100 md:h-125 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <PropertyHostInfoSkeleton />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
          <Skeleton className="hidden lg:block h-125 w-full rounded-2xl sticky top-24" />
        </div>
      </div>
    );
  }

  // --- MANEJO DE ERROR ---
  if (isError || !property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Propiedad no encontrada
        </h1>
        <p className="text-slate-500 mt-2">
          El alojamiento que buscas no está disponible o ha sido eliminado.
        </p>
      </div>
    );
  }

  return (
    <AuthGuard allowGuests>
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* CABECERA: Título, ubicación y acciones (Share/Save) */}
        <PropertyHeader property={property} />

        {/* GALERÍA: Grilla de fotos con modal integrado */}
        <PropertyGallery images={property.imageUrls} title={property.title} />

        {/* LAYOUT PRINCIPAL: Info a la izquierda, Booking a la derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
          {/* COLUMNA IZQUIERDA: Información detallada */}
          <div className="lg:col-span-2 space-y-2">
            <PropertyHostInfo property={property} />
            <PropertyStats property={property} />
            <PropertyDescription description={property.description} />

            {/* Sección de Reseñas: Independiente con su propio fetch interno */}
            <PropertyReviewsSection propertyId={id} />
          </div>

          {/* COLUMNA DERECHA: Widget de Reserva (Sticky) */}
          <aside className="relative">
            <BookingForm propertyId={id} />
          </aside>
        </div>
      </main>
    </AuthGuard>
  );
}
