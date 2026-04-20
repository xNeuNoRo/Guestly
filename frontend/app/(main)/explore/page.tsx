"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoSearchOutline, IoFilterOutline } from "react-icons/io5";

import { PropertyCard } from "@/components/features/properties/PropertyCard";
import { PropertyFilters } from "@/components/features/properties/PropertyFilters";
import { Skeleton } from "@/components/shared/Skeleton";
import { useSearchProperties } from "@/hooks/properties/useQueries";
import { Modal } from "@/components/shared/Modal";
import { PropertySearchRequest } from "@/schemas/properties.schemas";
import { parseISO } from "date-fns/parseISO";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const locationQuery = searchParams.get("location");

  const searchFilters: PropertySearchRequest = useMemo(() => {
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const capacityParam = searchParams.get("capacity");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    return {
      location: locationQuery || undefined,
      capacity: capacityParam ? Number(capacityParam) : undefined,
      minPrice: minPriceParam ? Number(minPriceParam) : undefined,
      maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
      startDate: startDateParam ? parseISO(startDateParam) : undefined,
      endDate: endDateParam ? parseISO(endDateParam) : undefined,
    };
  }, [searchParams, locationQuery]);

  // Estado para el modal de filtros en móvil
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Hook conectado a la URL
  const { data: properties, isLoading, isError } = useSearchProperties(searchFilters);

  const propertiesContent = (() => {
    if (isLoading) {
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
      return properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ));
    }

    return (
      <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <IoSearchOutline size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          No encontramos lo que buscas
        </h3>
        <p className="text-slate-500 max-w-md">
          Intenta ampliar tu rango de precios o buscar en una zona diferente.
        </p>
      </div>
    );
  })();

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header de la página */}
      <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {locationQuery ? `Alojamientos en "${locationQuery}"` : "Explorar"}
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            {properties
              ? `${properties.length} propiedades encontradas`
              : "Buscando..."}
          </p>
        </div>

        {/* Botón Filtros Móvil */}
        <button
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm font-bold text-sm text-slate-700 active:scale-95 transition-transform"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <IoFilterOutline size={18} />
          Filtros
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Sidebar de Filtros (Desktop) */}
        <aside className="hidden lg:block w-80 shrink-0 sticky top-28">
          <PropertyFilters />
        </aside>

        {/* Grid de Resultados */}
        <section className="flex-1 w-full">
          {isError ? (
            <div className="py-16 text-center bg-red-50 rounded-[2.5rem] border border-red-100 text-red-600 font-bold shadow-sm">
              No pudimos cargar las propiedades. Verifica tu conexión.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
              {propertiesContent}
            </div>
          )}
        </section>
      </div>

      {/* Modal de Filtros (Móvil) */}
      <Modal
        open={isMobileFiltersOpen}
        close={() => setIsMobileFiltersOpen(false)}
        title="Filtros"
      >
        <div className="p-1 h-full">
          <PropertyFilters
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />
        </div>
      </Modal>
    </main>
  );
}
