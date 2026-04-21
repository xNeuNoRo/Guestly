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

import { ReviewFormModal } from "@/components/features/reviews/ReviewFormModal";
import { DeleteReviewModal } from "@/components/features/reviews/DeleteReviewModal";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * @description Página de detalle de propiedad.
 * Orquesta la visualización completa de un alojamiento y el proceso de reserva en un Sidebar.
 */
export default function PropertyDetailPage({
  params,
}: Readonly<PropertyDetailPageProps>) {
  // Next.js 15: Desenvolvemos el ID de forma asíncrona
  const { id } = use(params);

  // Hook centralizado para obtener toda la info de la propiedad
  const { data: property, isLoading, isError } = useProperty(id);

  // --- ESTADO DE CARGA (SKELETONS CON LAYOUT LATERAL) ---
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-100 md:h-125 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 mt-10">
          <div className="space-y-8">
            <PropertyHostInfoSkeleton />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
          {/* Skeleton del BookingForm que imita el Sidebar */}
          <Skeleton className="hidden lg:block h-[450px] w-full rounded-4xl sticky top-32" />
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
        {/* CABECERA: Título, ubicación y acciones */}
        <PropertyHeader property={property} />

        {/* GALERÍA: Grilla de fotos con modal integrado */}
        <PropertyGallery images={property.imageUrls} title={property.title} />

        {/* LAYOUT PRINCIPAL: 1fr para la info, 400px fijos para el BookingForm */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 mt-10 items-start">
          {/* COLUMNA IZQUIERDA: Información detallada */}
          <div className="space-y-10">
            <div className="space-y-2">
              <PropertyHostInfo property={property} />
              <hr className="border-slate-100" />

              <PropertyStats property={property} />
              <hr className="border-slate-100" />

              <PropertyDescription description={property.description} />
              <hr className="border-slate-100" />
            </div>

            <PropertyReviewsSection propertyId={id} />
          </div>

          {/* COLUMNA DERECHA: Widget de Reserva (Sidebar) */}
          <aside className="h-full relative">
            <BookingForm propertyId={id} />
          </aside>
        </div>

        <ReviewFormModal propertyId={id} />
        <DeleteReviewModal propertyId={id} />
      </main>
    </AuthGuard>
  );
}
