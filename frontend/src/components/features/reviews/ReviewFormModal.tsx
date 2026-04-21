"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  IoStar,
  IoStarOutline,
  IoChatbubbleEllipsesOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import { Skeleton } from "@/components/shared/Skeleton";
import { Form } from "@/components/shared/form/Form";
import { SelectField } from "@/components/shared/form/SelectField";

import { useQueryString } from "@/hooks/shared/useQueryString";
import { useCreateReview, useUpdateReview } from "@/hooks/reviews/useMutation";
import { useReview } from "@/hooks/reviews";
import { useSearchReservations } from "@/hooks/reservations/useQueries";
import { useAppStore } from "@/stores/useAppStore";
import {
  type CreateReviewRequest,
  createReviewSchema,
  updateReviewSchema,
} from "@/schemas/reviews.schemas";

interface ReviewFormModalProps {
  propertyId?: string;
}

export function ReviewFormModal({
  propertyId,
}: Readonly<ReviewFormModalProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createUrl } = useQueryString();
  const user = useAppStore((state) => state.user);

  const action = searchParams.get("action");
  const reviewId = searchParams.get("reviewId");
  const urlReservationId = searchParams.get("reservationId");

  const isOpen = action === "create-review" || action === "edit-review";
  const isEditing = action === "edit-review" && !!reviewId;

  // Mutaciones y Queries de Reseñas
  const { mutate: createReview, isPending: isCreating } = useCreateReview();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();
  const { data: existingReview, isLoading: isLoadingReview } = useReview(
    reviewId ?? "",
  );

  // Buscar viajes elegibles (Completados) de este usuario para esta propiedad
  const searchFilters = useMemo(
    () => ({
      propertyId,
      guestId: user?.id,
      status: "Completed" as const,
    }),
    [propertyId, user?.id],
  );

  const { data: eligibleTrips, isLoading: isLoadingTrips } =
    useSearchReservations(searchFilters);

  const formSchema = useMemo(
    () =>
      isEditing
        ? updateReviewSchema.extend({
            propertyId: z.string(),
            reservationId: z.string(),
          })
        : createReviewSchema,
    [isEditing],
  );

  const form = useForm<CreateReviewRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyId: propertyId ?? "",
      reservationId: urlReservationId ?? "",
      rating: 5,
      comment: "",
    },
  });

  // Hidratación para Edición
  useEffect(() => {
    if (existingReview && isEditing) {
      form.reset({
        propertyId: existingReview.propertyId,
        reservationId: "",
        rating: existingReview.rating,
        comment: existingReview.comment,
      });
    }
  }, [existingReview, isEditing, form]);

  // Si cargan los viajes y no teníamos un reservationId previo, auto-seleccionamos el más reciente
  useEffect(() => {
    if (
      !isEditing &&
      !urlReservationId &&
      eligibleTrips &&
      eligibleTrips.length > 0
    ) {
      form.setValue("reservationId", eligibleTrips[0].id);
      form.setValue("propertyId", eligibleTrips[0].propertyId);
    }
  }, [eligibleTrips, isEditing, urlReservationId, form]);

  const closeModal = () => {
    form.reset();
    router.push(
      createUrl({ action: null, reviewId: null, reservationId: null }),
      { scroll: false },
    );
  };

  const onSubmit = (data: CreateReviewRequest) => {
    if (isEditing && reviewId) {
      updateReview(
        {
          id: reviewId,
          request: { rating: data.rating, comment: data.comment },
        },
        {
          onSuccess: () => {
            closeModal();
          },
        },
      );
    } else {
      createReview(data, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  // --- Lógica de Renderizado Condicional ---
  const isCheckingTrips = !isEditing && isLoadingTrips;
  const hasNoEligibleTrips =
    !isEditing && !urlReservationId && eligibleTrips?.length === 0;

  const renderModalContent = () => {
    if ((isEditing && isLoadingReview) || isCheckingTrips) {
      return (
        <div className="space-y-6 py-4">
          <Skeleton className="h-10 w-32 mx-auto" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }

    if (hasNoEligibleTrips) {
      return (
        <div className="py-8 flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
            <IoWarningOutline size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              No puedes dejar una reseña
            </h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              Solo los huéspedes con una estancia completada en este alojamiento
              pueden compartir su experiencia.
            </p>
          </div>
          <Button onClick={closeModal} variant="outline" className="mt-4">
            Entendido
          </Button>
        </div>
      );
    }

    return (
      <Form form={form} onSubmit={onSubmit} className="space-y-8 py-4">
        {/* Mostramos errores generales ocultos que bloquean el submit (ej. falta de reservationId) */}
        {form.formState.errors.reservationId && !isEditing && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
            <IoWarningOutline size={18} />
            <p>
              Error: No se ha seleccionado una estancia válida para reseñar.
            </p>
          </div>
        )}

        {/* Selector de Viaje (Solo visible si está creando y tiene más de 1 viaje en esta propiedad) */}
        {!isEditing &&
          !urlReservationId &&
          eligibleTrips &&
          eligibleTrips.length > 1 && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <SelectField
                name="reservationId"
                label="¿Qué estancia deseas reseñar?"
                options={eligibleTrips.map((trip) => ({
                  value: trip.id,
                  label: `${format(new Date(trip.checkInDate), "MMM yyyy", { locale: es })} - ${trip.propertyTitle}`,
                }))}
              />
            </div>
          )}

        <p className="text-sm text-slate-500 leading-relaxed -mt-2 text-center">
          Cuéntales a otros viajeros cómo fue tu experiencia.
        </p>

        {/* Calificación */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Calificación
          </p>
          <Controller
            name="rating"
            control={form.control}
            render={({ field }) => (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => field.onChange(star)}
                    className={`transition-all hover:cursor-pointer hover:scale-125 ${
                      star <= field.value ? "text-amber-400" : "text-slate-200"
                    }`}
                  >
                    {star <= field.value ? (
                      <IoStar size={44} />
                    ) : (
                      <IoStarOutline size={44} />
                    )}
                  </button>
                ))}
              </div>
            )}
          />
          {form.formState.errors.rating && (
            <p className="text-xs text-red-500 font-medium">
              {form.formState.errors.rating.message}
            </p>
          )}
        </div>

        {/* Comentario */}
        <div className="space-y-2">
          <label
            htmlFor="review-comment"
            className="text-sm font-bold text-slate-900 flex items-center gap-2"
          >
            <IoChatbubbleEllipsesOutline className="text-primary-500" />
            Tu experiencia
          </label>
          <Textarea
            id="review-comment"
            {...form.register("comment")}
            placeholder="¿Qué fue lo que más te gustó? ¿Algún detalle para el anfitrión?"
            className="min-h-35 rounded-2xl resize-none"
            error={form.formState.errors.comment?.message}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={closeModal}
            className="flex-1 rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isCreating || isUpdating}
            className="flex-1 rounded-xl shadow-lg shadow-primary-500/20"
          >
            {isEditing ? "Guardar cambios" : "Publicar reseña"}
          </Button>
        </div>
      </Form>
    );
  };

  return (
    <Modal
      open={isOpen}
      close={closeModal}
      title={isEditing ? "Editar mi reseña" : "Escribir una reseña"}
    >
      {renderModalContent()}
    </Modal>
  );
}
