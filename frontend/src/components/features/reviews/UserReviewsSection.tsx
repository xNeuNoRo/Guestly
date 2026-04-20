"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IoChatboxOutline, IoHomeOutline } from "react-icons/io5";

import { Skeleton } from "@/components/shared/Skeleton";
import { ReviewCard } from "./ReviewCard";

import { useUserReviews } from "@/hooks/reviews/useQueries";
import { useAuth } from "@/hooks/stores/useAuth";
import { useQueryString } from "@/hooks/shared/useQueryString";
import type { ReviewResponse } from "@/schemas/reviews.schemas";

/**
 * @description Listado centralizado de reseñas escritas por el usuario autenticado.
 * Orquesta la edición y eliminación mediante SearchParams.
 */
export function UserReviewsSection() {
  const router = useRouter();
  const { user } = useAuth();
  const { createUrl } = useQueryString();

  const { data: reviews, isLoading, isError, error } = useUserReviews(user?.id);

  const handleEditClick = (review: ReviewResponse) => {
    router.push(createUrl({ action: "edit-review", reviewId: review.id }), {
      scroll: false,
    });
  };

  const handleDeleteClick = (reviewId: string) => {
    router.push(createUrl({ action: "delete-review", reviewId }), {
      scroll: false,
    });
  };

  // --- ESTADO DE CARGA ---
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  // --- MANEJO DE ERRORES ---
  if (isError) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center text-red-600 font-medium">
        {error?.message || "No pudimos cargar tus reseñas en este momento."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
          <IoChatboxOutline size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Mis Reseñas
          </h2>
          <p className="text-sm text-slate-500">
            Gestiona las opiniones que has compartido con la comunidad.
          </p>
        </div>
      </header>

      {/* ESTADO VACÍO */}
      {!reviews || reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200"
        >
          <IoChatboxOutline size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Aún no has escrito reseñas
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Tus opiniones aparecerán aquí después de que completes tus estancias
            y califiques las propiedades.
          </p>
        </motion.div>
      ) : (
        /* LISTADO DE RESEÑAS CON ANIMACIÓN STAGGERED */
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 gap-4"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={{
                hidden: { opacity: 0, x: -10 },
                show: { opacity: 1, x: 0 },
              }}
            >
              {/* Reutilizamos la ReviewCard atómica pero añadimos contexto de propiedad */}
              <div className="group relative">
                <div className="absolute top-6 left-20 z-10 pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-lg shadow-sm">
                    <IoHomeOutline size={12} className="text-primary-500" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                      {review.propertyTitle}
                    </span>
                  </div>
                </div>
                <ReviewCard
                  review={review}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
