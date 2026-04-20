"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IoStar, IoChatboxOutline, IoAddCircleOutline } from "react-icons/io5";

import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/shared/Button";
import { ReviewCard } from "./ReviewCard";

import { usePropertyReviews } from "@/hooks/reviews";
import { useQueryString } from "@/hooks/shared/useQueryString";
import type { ReviewResponse } from "@/schemas/reviews.schemas";

interface PropertyReviewsSectionProps {
  propertyId: string;
}

/**
 * @description Sección completa de reseñas de una propiedad.
 * Arquitectura purgada de estados locales: utiliza SearchParams (URL)
 * para orquestar la apertura y cierre de modales mediante useQueryString.
 */
export function PropertyReviewsSection({
  propertyId,
}: Readonly<PropertyReviewsSectionProps>) {
  // Arsenal: Delegamos el estado de los modales a la URL
  const router = useRouter();
  const { createUrl } = useQueryString();

  // Fetching de datos usando el hook de React Query
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = usePropertyReviews(propertyId);

  const { averageRating, totalReviews } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      averageRating: Number((sum / reviews.length).toFixed(1)),
      totalReviews: reviews.length,
    };
  }, [reviews]);

  const handleCreateClick = () => {
    router.push(createUrl({ action: "create-review" }), { scroll: false });
  };

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

  if (isLoading) {
    return (
      <section className="py-8 border-t border-slate-200 mt-8">
        <Skeleton className="h-10 w-48 mb-8 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "review-skeleton-1",
            "review-skeleton-2",
            "review-skeleton-3",
            "review-skeleton-4",
          ].map((skeletonId) => (
            <Skeleton key={skeletonId} className="h-48 w-full rounded-4xl" />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-8 border-t border-slate-200 mt-8">
        <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
          <p className="text-red-600 font-medium">
            {error?.message ||
              "Ocurrió un error al cargar las reseñas de esta propiedad."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 border-t border-slate-200 mt-12 relative">
      {/* CABECERA DE LA SECCIÓN: Promedio y Botón de Añadir */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <IoStar className="text-amber-400" size={32} />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {totalReviews > 0 ? (
              <>
                {averageRating}{" "}
                <span className="text-slate-400 font-medium text-xl md:text-2xl">
                  · {totalReviews} reseñas
                </span>
              </>
            ) : (
              "Aún no hay reseñas"
            )}
          </h2>
        </div>

        <Button
          onClick={handleCreateClick}
          variant="secondary"
          className="rounded-xl font-semibold"
          leftIcon={<IoAddCircleOutline size={20} />}
        >
          Escribir opinión
        </Button>
      </div>

      {/* ESTADO VACÍO */}
      {totalReviews === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <IoChatboxOutline size={28} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Sé el primero en opinar
          </h3>
          <p className="text-slate-500 max-w-sm">
            Si ya te hospedaste en este lugar, comparte tu experiencia para
            ayudar a otros viajeros.
          </p>
        </motion.div>
      ) : (
        /* GRID DE RESEÑAS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews?.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}
    </section>
  );
}
