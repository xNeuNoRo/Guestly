"use client";

import { IoArrowBackOutline } from "react-icons/io5";
import Link from "next/link";
import { CreatePropertyWizard } from "@/components/features/properties/CreatePropertyWizard";
import { ROUTES } from "@/constants/routes";
import { AuthGuard } from "@/components/auth/AuthGuard";

/**
 * @description Página que orquesta el flujo de creación de una nueva propiedad.
 * Protegida para acceso exclusivo de Anfitriones.
 */
export default function CreatePropertyPage() {
  return (
    <AuthGuard allowedRoles={["Host"]}>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Botón de retorno al listado de gestión */}
        <div className="mb-8">
          <Link
            href={ROUTES.HOST.PROPERTIES}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors group"
          >
            <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-primary-50 transition-colors">
              <IoArrowBackOutline size={20} />
            </div>
            Volver a mis propiedades
          </Link>
        </div>

        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Publicar un nuevo alojamiento
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Completa los pasos para configurar tu propiedad y empezar a recibir
            huéspedes.
          </p>
        </header>

        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-4 md:p-10 shadow-sm">
          <CreatePropertyWizard />
        </section>
      </div>
    </AuthGuard>
  );
}
