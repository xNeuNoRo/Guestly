// frontend/app/(main)/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { IoSearchOutline, IoArrowForwardOutline } from "react-icons/io5";

import { PropertyCard } from "@/components/features/properties/PropertyCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { useSearchProperties } from "@/hooks/properties/useQueries";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/shared/Button";

export default function HomePage() {
  // En el inicio, solo traemos las propiedades sin filtros (Destacadas)
  const { data: properties, isLoading, isError } = useSearchProperties();

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
      // Limitamos a 8 para que el inicio sea solo una muestra
      return properties
        .slice(0, 8)
        .map((property) => (
          <PropertyCard key={property.id} property={property} />
        ));
    }

    return (
      <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <IoSearchOutline size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          No hay propiedades destacadas
        </h3>
        <p className="text-slate-500 max-w-md">
          Pronto agregaremos nuevos alojamientos a nuestra plataforma.
        </p>
      </div>
    );
  })();

  return (
    <AuthGuard allowGuests>
      <div className="flex flex-col min-h-screen">
        {/* HERO SECTION */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop"
            alt="Interior de lujo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 text-center px-4 flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-2xl">
              Tu próximo hogar, <br />
              <span className="text-primary-400">donde quieras.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 font-medium max-w-xl mx-auto drop-shadow-md mb-10">
              Descubre alojamientos únicos verificados por nuestra comunidad.
            </p>

            {/* ARSENAL: Puente principal a Explore */}
            <Link href="/explore">
              <Button
                size="lg"
                className="rounded-full px-8 text-lg font-bold shadow-xl shadow-primary-500/30"
              >
                Explorar destinos
              </Button>
            </Link>
          </div>
        </section>

        {/* GRID DE PROPIEDADES DESTACADAS */}
        <main className="py-16 container mx-auto px-4 md:px-6 flex-1">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Explora lo mejor de Guestly
              </h2>
              <p className="text-slate-500 mt-2">
                Propiedades destacadas con las mejores calificaciones.
              </p>
            </div>
            {/* ARSENAL: Puente secundario para los que quieren ir directo a filtrar */}
            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors"
            >
              Ver todos <IoArrowForwardOutline />
            </Link>
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

          {properties && properties.length > 0 && (
            <div className="mt-16 flex justify-center">
              <Link href="/explore">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-xl px-10"
                >
                  Ver más alojamientos
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
