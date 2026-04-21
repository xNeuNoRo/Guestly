// frontend/app/(main)/host/properties/[id]/edit/page.tsx
"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline, IoTrashOutline } from "react-icons/io5";

import { EditPropertyForm } from "@/components/features/properties/EditPropertyForm";
import { DeletePropertyModal } from "@/components/features/properties/DeletePropertyModal";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/shared/Button";
import { AuthGuard } from "@/components/auth/AuthGuard";

import { useProperty } from "@/hooks/properties/useQueries";
import { ROUTES } from "@/constants/routes";
import { useQueryString } from "@/hooks/shared/useQueryString";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPropertyPage({
  params,
}: Readonly<EditPropertyPageProps>) {
  // Next.js 15: Desenvolvemos params
  const { id } = use(params);
  const router = useRouter();
  const { createUrl } = useQueryString();

  // Usamos el mismo query que en el detalle, pero validando que sea el host
  const { data: property, isLoading, isError } = useProperty(id);

  // ARSENAL: Adiós useState. Hola URL State.
  const handleDeleteClick = () => {
    if (!property) return;
    router.push(
      createUrl({
        modal: "delete-property",
        deleteId: property.id,
        deleteName: property.title,
      }),
      { scroll: false },
    );
  };

  // --- ESTADOS DE CARGA Y ERROR ---
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6 animate-pulse">
        <Skeleton className="h-6 w-32 rounded-md" /> {/* Back link */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 rounded-xl" /> {/* Title */}
          <Skeleton className="h-10 w-32 rounded-xl" /> {/* Delete button */}
        </div>
        <Skeleton className="h-14 w-full rounded-2xl" /> {/* Tabs */}
        <Skeleton className="h-125 w-full rounded-2xl" /> {/* Form body */}
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Propiedad no encontrada
        </h1>
        <p className="text-slate-500 mt-2 mb-6">
          El alojamiento que intentas editar no existe o no tienes permisos.
        </p>
        <Link href={ROUTES.HOST.PROPERTIES}>
          <Button variant="primary">Volver a mis propiedades</Button>
        </Link>
      </div>
    );
  }

  return (
    <AuthGuard allowedRoles={["Host"]}>
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Enlace de regreso */}
        <Link
          href={ROUTES.HOST.PROPERTIES}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <IoArrowBackOutline size={18} />
          Volver al listado
        </Link>

        {/* Cabecera de la Página: Título y Acción Destructiva */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Editar Propiedad
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {property.title}
            </p>
          </div>

          <Button
            variant="danger"
            onClick={handleDeleteClick}
            leftIcon={<IoTrashOutline />}
            className="shrink-0"
          >
            Eliminar
          </Button>
        </div>

        {/* El Formulario con Pestañas */}
        <EditPropertyForm property={property} />

        {/* Modal de Confirmación de Borrado (Ya lee de la URL por dentro) */}
        <DeletePropertyModal />
      </main>
    </AuthGuard>
  );
}
