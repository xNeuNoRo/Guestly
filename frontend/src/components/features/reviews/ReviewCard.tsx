"use client";

import { useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoStar,
  IoStarOutline,
  IoEllipsisVertical,
  IoCreateOutline,
  IoTrashOutline,
  IoHomeOutline,
} from "react-icons/io5";
import Link from "next/link";

import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/hooks/stores/useAuth";
import { useClickOutside } from "@/hooks/shared/useClickOutside";
import { useToggle } from "@/hooks/shared/useToggle";
import type { ReviewResponse } from "@/schemas/reviews.schemas";

interface ReviewCardProps {
  review: ReviewResponse;
  onEdit?: (review: ReviewResponse) => void;
  onDelete?: (reviewId: string) => void;
  /** * Permite ocultar el badge de la propiedad si ya estamos en la página de la propiedad.
   * Por defecto es true para que se vea en el perfil del usuario.
   */
  showPropertyContext?: boolean;
  showReviewActions?: boolean;
}

/**
 * @description Componente atómico de alta fidelidad para mostrar una reseña.
 * Aprovecha useToggle para el menú y expone controles solo al autor original.
 */
export function ReviewCard({
  review,
  onEdit,
  onDelete,
  showPropertyContext = true,
  showReviewActions = true,
}: Readonly<ReviewCardProps>) {
  const { user } = useAuth();
  const { setFalse, value, toggle } = useToggle(false);

  // Arsenal: useClickOutside cierra el menú automáticamente si el usuario hace clic fuera
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, setFalse);

  // Verificamos si el usuario logueado es el autor de esta reseña
  const isAuthor = user?.id === review.guestId;

  // Formateo de fecha eficiente (ej: "15 de octubre de 2025")
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(review.createdAt));
  }, [review.createdAt]);

  const userProfileLink = `/profile/${review.guestId}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="relative p-6 bg-white rounded-4xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group"
    >
      {/* --- CONTEXTO DE PROPIEDAD (Badge Interno) --- */}
      {showPropertyContext && review.propertyTitle && (
        <div className="mb-4">
          <Link
            href={`/properties/${review.propertyId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl border border-slate-100 transition-colors w-fit group/link"
          >
            <IoHomeOutline
              size={14}
              className="text-primary-700 group-hover/link:text-primary-800"
            />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {review.propertyTitle}
            </span>
          </Link>
        </div>
      )}

      {/* --- CABECERA: Identidad y Acciones --- */}
      <header className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <Link href={userProfileLink}>
            <Avatar
              alt={review.guestFullName}
              size="md"
              className="hover:scale-105 ring-2 ring-primary-50 text-primary-700 font-bold bg-primary-100 shadow-sm"
            />
          </Link>
          <div>
            <Link href={userProfileLink}>
              <h4 className="text-base font-bold text-slate-900 tracking-tight leading-none mb-1.5 hover:underline underline-offset-4 decoration-primary-500">
                {review.guestFullName}
              </h4>
            </Link>
            <time
              dateTime={new Date(review.createdAt).toISOString()}
              className="text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              {formattedDate}
            </time>
          </div>
        </div>

        {/* --- MENÚ CONTEXTUAL (Modo Autor) --- */}
        {isAuthor && showReviewActions && (
          <div className="relative z-10" ref={menuRef}>
            <button
              onClick={toggle}
              className={`p-2 rounded-full transition-all focus:outline-none hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 ${
                value
                  ? "bg-slate-100 text-slate-900 shadow-inner"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
              aria-label="Opciones de mi reseña"
              aria-expanded={value}
            >
              <IoEllipsisVertical size={20} />
            </button>

            <AnimatePresence>
              {value && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden origin-top-right"
                >
                  <div className="p-1.5 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setFalse();
                        onEdit?.(review);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:cursor-pointer hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors text-left"
                    >
                      <IoCreateOutline size={18} className="text-slate-400" />
                      Editar reseña
                    </button>

                    <button
                      onClick={() => {
                        setFalse();
                        onDelete?.(review.id);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:cursor-pointer hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <IoTrashOutline size={18} className="text-red-400" />
                      Eliminar reseña
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </header>

      {/* --- CUERPO: Calificación y Comentario --- */}
      <div className="space-y-4">
        <div
          className="flex gap-1"
          aria-label={`Calificación: ${review.rating} de 5 estrellas`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="drop-shadow-sm">
              {star <= review.rating ? (
                <IoStar size={18} className="text-amber-400" />
              ) : (
                <IoStarOutline size={18} className="text-slate-200" />
              )}
            </span>
          ))}
        </div>

        <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
          {review.comment}
        </p>
      </div>
    </motion.article>
  );
}
