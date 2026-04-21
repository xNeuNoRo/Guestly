"use client";

import Link from "next/link";
import {
  IoPencilOutline,
  IoCalendarOutline,
  IoListOutline,
  IoSettingsOutline,
} from "react-icons/io5";

import { ROUTES } from "@/constants/routes";

interface HostActionsSidebarProps {
  propertyId: string;
}

export function HostActionsSidebar({
  propertyId,
}: Readonly<HostActionsSidebarProps>) {
  return (
    <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm sticky top-28 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <IoSettingsOutline className="text-primary-500" size={24} />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Gestionar Anuncio
          </h2>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Eres el anfitrión de esta propiedad. Desde aquí puedes administrarla
          rápidamente.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href={`${ROUTES.HOST.PROPERTIES}/${propertyId}/edit`}
          className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-primary-50 hover:border-primary-100 hover:text-primary-700 transition-colors text-slate-700 font-bold"
        >
          <IoPencilOutline size={20} />
          Editar información
        </Link>

        <Link
          href={`${ROUTES.HOST.PROPERTIES}/${propertyId}/calendar`}
          className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-primary-50 hover:border-primary-100 hover:text-primary-700 transition-colors text-slate-700 font-bold"
        >
          <IoCalendarOutline size={20} />
          Bloquear fechas
        </Link>

        {/* Te lleva al listado general de reservas del host (podrías añadirle un query param de filtro más adelante) */}
        <Link
          href={ROUTES.HOST.RESERVATIONS}
          className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-primary-50 hover:border-primary-100 hover:text-primary-700 transition-colors text-slate-700 font-bold"
        >
          <IoListOutline size={20} />
          Ver reservas
        </Link>
      </div>
    </div>
  );
}
