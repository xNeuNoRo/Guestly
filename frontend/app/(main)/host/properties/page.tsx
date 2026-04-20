"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoAddOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoHomeOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

import {
  PropertyCard,
  PropertyCardSkeleton,
} from "@/components/features/properties/PropertyCard";
import { DeletePropertyModal } from "@/components/features/properties/DeletePropertyModal";
import { Button } from "@/components/shared/Button";
import { useHostProperties } from "@/hooks/properties/useQueries";
import { useQueryString } from "@/hooks/shared/useQueryString";
import { ROUTES } from "@/constants/routes";
import { AuthGuard } from "@/components/auth/AuthGuard";

/**
 * @description Panel de gestión de propiedades para el Anfitrión.
 * Utiliza la URL como fuente de verdad para el flujo de eliminación.
 */
export default function MyPropertiesPage() {
  const router = useRouter();
  const { createUrl } = useQueryString();
  const { data: properties, isLoading, isError } = useHostProperties();

  // Función para abrir el modal de eliminación vía URL
  const openDeleteModal = (id: string, name: string) => {
    router.push(
      createUrl({
        modal: "delete-property",
        deleteId: id,
        deleteName: name,
      }),
      { scroll: false },
    );
  };

  const safeProperties = properties ?? [];

  const renderPropertiesContent = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ));
    }

    if (isError) {
      return (
        <div className="col-span-full py-20 text-center bg-red-50 rounded-[2.5rem] border border-red-100 text-red-600 font-bold">
          No pudimos cargar tus propiedades.
        </div>
      );
    }

    if (safeProperties.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-6 text-slate-300">
            <IoHomeOutline size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Aún no tienes propiedades
          </h3>
          <p className="text-slate-500 mt-2">
            ¡Comienza publicando tu primer espacio!
          </p>
        </motion.div>
      );
    }

    return safeProperties.map((property) => (
      <motion.div
        key={property.id}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative group"
      >
        <PropertyCard property={property} />

        {/* Acciones del Host */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Link href={`${ROUTES.HOST.PROPERTIES}/${property.id}/edit`}>
            <button className="p-2.5 bg-white text-slate-700 rounded-xl shadow-xl hover:cursor-pointer hover:text-primary-600 transition-colors border border-slate-100">
              <IoCreateOutline size={20} />
            </button>
          </Link>
          <button
            onClick={() => openDeleteModal(property.id, property.title)}
            className="p-2.5 bg-white text-red-500 rounded-xl shadow-xl hover:cursor-pointer hover:bg-red-50 transition-colors border border-slate-100"
          >
            <IoTrashOutline size={20} />
          </button>
        </div>
      </motion.div>
    ));
  };

  return (
    <AuthGuard allowedRoles={["Host"]}>
      <main className="container mx-auto px-4 py-10 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Mis Propiedades
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Gestiona tus publicaciones y mantén tu información actualizada.
            </p>
          </div>

          <Link href={ROUTES.HOST.PROPERTIES + "/create"}>
            <Button
              leftIcon={<IoAddOutline size={22} />}
              className="rounded-2xl shadow-lg shadow-primary-200"
            >
              Publicar nuevo alojamiento
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {renderPropertiesContent()}
          </AnimatePresence>
        </div>

        {/* Modal Inteligente: No necesita props, lee de la URL */}
        <DeletePropertyModal />
      </main>
    </AuthGuard>
  );
}
