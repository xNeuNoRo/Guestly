"use client";

import { use } from "react";
import Link from "next/link";
import {
  IoChevronBack,
  IoCalendarClearOutline,
  IoInformationCircleOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

import { PropertyBlockManager } from "@/components/features/reservations/PropertyBlockManager";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useProperty } from "@/hooks/properties/useQueries";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/shared/Button";

interface PropertyCalendarPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyCalendarPage({
  params,
}: Readonly<PropertyCalendarPageProps>) {
  const { id: propertyId } = use(params);
  const { data: property, isLoading, isError } = useProperty(propertyId);

  if (isLoading) return <PropertyCalendarSkeleton />;

  if (isError || !property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Propiedad no encontrada
        </h2>
        <Link href="/host/properties" className="mt-4 inline-block">
          <Button variant="primary">Volver a mis propiedades</Button>
        </Link>
      </div>
    );
  }

  return (
    <AuthGuard allowedRoles={["Host"]}>
      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        {/* Navegación y Título */}
        <div className="space-y-4">
          <Link
            href="/host/properties"
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <IoChevronBack size={18} />
            Volver a mis propiedades
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Calendario de Disponibilidad
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Gestionando:{" "}
                <span className="text-slate-800">{property.title}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-2xl text-sm font-bold">
              <IoShieldCheckmarkOutline size={18} />
              Sincronizado con reservas confirmadas
            </div>
          </div>
        </div>

        {/* Panel Informativo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* El Manager contiene el calendario interactivo y la lógica de bloqueo */}
            <PropertyBlockManager propertyId={propertyId} />
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <IoInformationCircleOutline className="text-primary-600" />
                Guía de uso
              </h3>
              <ul className="space-y-4 text-sm text-slate-600 font-medium">
                <li className="flex gap-3">
                  <span className="w-4 h-4 bg-primary-600 rounded-full shrink-0 mt-0.5" />
                  <span>
                    Haz clic en un rango de fechas para crear un nuevo bloqueo
                    manual.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-4 h-4 bg-amber-400 rounded-full shrink-0 mt-0.5" />
                  <span>
                    Las fechas con reservas confirmadas aparecerán marcadas
                    automáticamente.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-4 h-4 bg-slate-200 rounded-full shrink-0 mt-0.5" />
                  <span>
                    Los bloques pasados se archivan automáticamente para
                    mantener la vista limpia.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-4xl text-white space-y-3">
              <IoCalendarClearOutline size={32} className="text-primary-400" />
              <h4 className="font-bold">¿Necesitas ayuda?</h4>
              <p className="text-sm text-slate-400">
                Bloquear fechas evita que los huéspedes puedan realizar reservas
                en esos días. Ideal para reformas o uso personal.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </AuthGuard>
  );
}

function PropertyCalendarSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8 animate-pulse">
      <div className="space-y-4">
        <Skeleton className="h-5 w-40 rounded-lg" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="md:col-span-2 h-[600px] rounded-[2.5rem]" />
        <Skeleton className="h-[400px] rounded-4xl" />
      </div>
    </div>
  );
}
