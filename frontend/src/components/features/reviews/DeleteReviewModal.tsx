"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { IoWarningOutline, IoTrashOutline } from "react-icons/io5";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";

import { useQueryString } from "@/hooks/shared/useQueryString";
import { useDeleteReview } from "@/hooks/reviews/useMutation";
import { useAuth } from "@/hooks/stores/useAuth";

interface DeleteReviewModalProps {
  propertyId: string;
}

/**
 * @description Modal de confirmación destructiva.
 * Recibe el propertyId como prop para cumplir con el contrato de invalidación de caché del hook.
 */
export function DeleteReviewModal({
  propertyId,
}: Readonly<DeleteReviewModalProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createUrl } = useQueryString();
  const { user } = useAuth();

  const action = searchParams.get("action");
  const reviewId = searchParams.get("reviewId");
  const isOpen = action === "delete-review" && !!reviewId;

  const { mutate: deleteReview, isPending } = useDeleteReview();

  const closeModal = () => {
    router.push(createUrl({ action: null, reviewId: null }), { scroll: false });
  };

  const handleConfirmDelete = () => {
    if (!reviewId) return;

    // Arsenal: Pasamos el objeto completo que espera el hook para la invalidación
    deleteReview(
      {
        id: reviewId,
        propertyId,
        userId: user?.id,
      },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  return (
    <Modal
      open={isOpen}
      close={closeModal}
      title="Eliminar reseña"
      size="small"
    >
      <div className="flex flex-col items-center text-center space-y-6 py-2">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm">
          <IoWarningOutline size={32} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">
            ¿Estás seguro de esta acción?
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed px-2">
            Esta acción es permanente. Tu comentario será borrado y las
            estadísticas de la propiedad se actualizarán.
          </p>
        </div>

        <div className="flex w-full gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={closeModal}
            className="flex-1 rounded-xl"
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirmDelete}
            isLoading={isPending}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 border-transparent transition-all"
            leftIcon={!isPending && <IoTrashOutline size={18} />}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
