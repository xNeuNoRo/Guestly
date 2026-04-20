"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IoStar,
  IoStarOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import { toast } from "sonner";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import { Skeleton } from "@/components/shared/Skeleton";
// ARSENAL: Usamos el wrapper atómico de Form
import { Form } from "@/components/shared/form/Form";

import { useQueryString } from "@/hooks/shared/useQueryString";
import { useCreateReview, useUpdateReview } from "@/hooks/reviews/useMutation";
import { useReview } from "@/hooks/reviews";
import {
  type CreateReviewRequest,
  createReviewSchema,
} from "@/schemas/reviews.schemas";

interface ReviewFormModalProps {
  propertyId: string;
}

/**
 * @description Modal orquestado por URL para crear o editar reseñas.
 * Utiliza el arsenal atómico <Form> e inyecta la descripción correctamente.
 */
export function ReviewFormModal({
  propertyId,
}: Readonly<ReviewFormModalProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createUrl } = useQueryString();

  const action = searchParams.get("action");
  const reviewId = searchParams.get("reviewId");
  const reservationId = searchParams.get("reservationId");
  const isOpen = action === "create-review" || action === "edit-review";
  const isEditing = action === "edit-review" && !!reviewId;

  const { mutate: createReview, isPending: isCreating } = useCreateReview();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();
  const { data: existingReview, isLoading: isLoadingReview } = useReview(
    reviewId ?? "",
  );

  const form = useForm<CreateReviewRequest>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      propertyId,
      reservationId: reservationId ?? "",
      rating: 5,
      comment: "",
    },
  });

  useEffect(() => {
    if (existingReview && isEditing) {
      form.reset({
        propertyId: existingReview.propertyId,
        reservationId: reservationId ?? form.getValues("reservationId"),
        rating: existingReview.rating,
        comment: existingReview.comment,
      });
    }
  }, [existingReview, isEditing, form, reservationId]);

  const closeModal = () => {
    form.reset();
    router.push(createUrl({ action: null, reviewId: null }), { scroll: false });
  };

  const onSubmit = (data: CreateReviewRequest) => {
    if (isEditing && reviewId) {
      updateReview(
        {
          id: reviewId,
          request: {
            rating: data.rating,
            comment: data.comment,
          },
        },
        {
          onSuccess: () => {
            toast.success("Reseña actualizada con éxito");
            closeModal();
          },
        },
      );
    } else {
      createReview(data, {
        onSuccess: () => {
          toast.success("¡Gracias por tu opinión!");
          closeModal();
        },
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      close={closeModal}
      title={isEditing ? "Editar mi reseña" : "Escribir una reseña"}
    >
      {isEditing && isLoadingReview ? (
        <div className="space-y-6 py-4">
          <Skeleton className="h-10 w-32 mx-auto" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-8 py-4">
          {/* Descripción inyectada respetando la jerarquía visual */}
          <p className="text-sm text-slate-500 leading-relaxed -mt-4">
            Cuéntales a otros viajeros cómo fue tu experiencia en esta
            propiedad.
          </p>

          {/* Selector de Estrellas - Mantenemos Controller por su lógica custom */}
          <div className="flex flex-col items-center gap-3">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Calificación
            </label>
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
                      className={`transition-all hover:scale-125 ${
                        star <= field.value
                          ? "text-amber-400"
                          : "text-slate-200"
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
              <p className="text-red-500 text-xs font-medium">
                {form.formState.errors.rating.message}
              </p>
            )}
          </div>

          {/* Área de Comentario con Textarea atómico */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <IoChatbubbleEllipsesOutline className="text-primary-500" />
              Tu experiencia
            </label>
            <Textarea
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
      )}
    </Modal>
  );
}
