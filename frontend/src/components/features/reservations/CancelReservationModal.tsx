"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoWarningOutline } from "react-icons/io5";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { useQueryString } from "@/hooks/shared/useQueryString";
import { useUpdateReservationStatus } from "@/hooks/reservations";

/**
 * @description Modal de confirmación para cancelar una reserva.
 * Fuente de verdad: URL (modal=cancel-reservation & cancelId=[id]).
 */
export function CancelReservationModal() {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  // --- Fuente de Verdad: URL ---
  const isOpen = searchParams.get("modal") === "cancel-reservation";
  const reservationId = searchParams.get("cancelId");

  const { mutate: updateStatus, isPending } = useUpdateReservationStatus();

  const close = () => {
    // Limpiamos la URL al cerrar
    router.push(createUrl({ modal: null, cancelId: null }), { scroll: false });
  };

  const handleCancel = () => {
    if (!reservationId) return;

    updateStatus(
      {
        id: reservationId,
        request: { newStatus: "Cancelled" },
      },
      {
        onSuccess: () => {
          toast.success("Reserva cancelada", {
            description: "Tu reserva ha sido cancelada exitosamente.",
          });
          close();
        },
        onError: (error) => {
          toast.error("Error al cancelar", {
            description:
              "No se pudo procesar la cancelación. Inténtalo de nuevo.",
          });
          console.error(error);
        },
      },
    );
  };

  return (
    <Modal open={isOpen} close={close} title="Cancelar reserva" size="medium">
      <div className="flex flex-col gap-6">
        {/* Banner de Advertencia */}
        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
          <IoWarningOutline
            className="text-red-600 shrink-0 mt-0.5"
            size={24}
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-red-900">
              Atención a la política de cancelación
            </p>
            <p className="text-sm text-red-700">
              Estás a punto de cancelar tu viaje. Dependiendo de la fecha de
              inicio, el anfitrión podría retener una parte del pago según sus
              políticas. ¿Estás seguro de que deseas continuar?
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
          <Button variant="ghost" onClick={close} disabled={isPending}>
            Mantener reserva
          </Button>
          <Button variant="danger" onClick={handleCancel} isLoading={isPending}>
            Sí, cancelar reserva
          </Button>
        </div>
      </div>
    </Modal>
  );
}
