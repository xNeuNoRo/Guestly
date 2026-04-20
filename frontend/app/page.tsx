"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";

import { PropertyCard } from "@/components/features/properties/PropertyCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { useSearchProperties } from "@/hooks/properties";

/**
 * @description Landing Page de Guestly.
 * Conectada al motor de búsqueda de la Navbar mediante los parámetros de la URL.
 * Muestra el grid general o los resultados filtrados dinámicamente.
 */
export default function HomePage() {
  const searchParams = useSearchParams();
  const locationQuery = searchParams.get("location");

  // Arsenal: Hook real que reacciona automáticamente a los cambios en la URL
  const { data: properties, isLoading, isError } = useSearchProperties();

  const propertiesContent = (() => {
    if (isLoading) {
      // Skeletons mientras carga la API
      return Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
        </div>
      ));
    }

    if (properties && properties.length > 0) {
      // Mapeo de propiedades reales
      return properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ));
    }

    // Empty State robusto cuando la búsqueda no arroja resultados
    return (
      <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <IoSearchOutline size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          No se encontraron propiedades
        </h3>
        <p className="text-slate-500 max-w-md">
          Intenta ajustar los filtros de búsqueda en la barra superior,
          cambia el destino o reduce la cantidad de huéspedes.
        </p>
      </div>
    );
  })();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION (Visual e Inspirador) */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop"
          alt="Interior de lujo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-2xl">
            Tu próximo hogar, <br />
            <span className="text-primary-400">donde quieras.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 font-medium max-w-xl mx-auto drop-shadow-md">
            Descubre alojamientos únicos verificados por nuestra comunidad.
          </p>
        </div>
      </section>

      {/* 2. GRID DE PROPIEDADES (Exploración / Resultados) */}
      <main className="py-16 container mx-auto px-4 md:px-6 flex-1">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {locationQuery
              ? `Resultados en "${locationQuery}"`
              : "Explora lo mejor de Guestly"}
          </h2>
          <p className="text-slate-500 mt-2">
            {locationQuery
              ? "Alojamientos que coinciden con tu búsqueda actual."
              : "Propiedades destacadas con las mejores calificaciones."}
          </p>
        </div>

        {isError ? (
          <div className="py-16 text-center bg-red-50 rounded-4xl border border-red-100 text-red-600 font-bold shadow-sm">
            No pudimos cargar las propiedades. Verifica tu conexión con el
            servidor.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {propertiesContent}
          </div>
        )}
      </main>
    </div>
  );
}
