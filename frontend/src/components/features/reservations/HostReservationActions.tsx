"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

import { Button } from "@/components/shared/Button";
import { useUpdateReservationStatus } from "@/hooks/reservations/useMutation";
import { useQueryString } from "@/hooks/shared/useQueryString";
import type {
  ReservationStatus,
  ReservationStatusMutate,
} from "@/schemas/reservations.schemas";

interface HostReservationActionsProps {
  reservationId: string;
  status: ReservationStatus;
}

/**
 * @description Botonera de acciones para que el Anfitrión procese una reserva entrante.
 * Purgado el estado local para sincronizar la carga y la acción con la URL.
 */
export function HostReservationActions({
  reservationId,
  status,
}: Readonly<HostReservationActionsProps>) {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  // --- Fuente de Verdad: URL ---
  const pendingAction = searchParams.get("pendingAction");
  const actionId = searchParams.get("actionId");

  const { mutate: updateStatus, isPending } = useUpdateReservationStatus();

  if (status !== "Pending") {
    return null;
  }

  // Validamos que la carga corresponda a esta reserva específica y no a otra de la lista
  const isThisReservationProcessing = isPending && actionId === reservationId;

  const handleAction = (
    newStatus: ReservationStatusMutate,
    actionType: "accept" | "decline",
  ) => {
    // Registramos la intención en la URL antes de disparar la mutación
    router.push(
      createUrl({ pendingAction: actionType, actionId: reservationId }),
      { scroll: false },
    );

    updateStatus(
      {
        id: reservationId,
        request: { newStatus },
      },
      {
        onSuccess: () => {
          const isAccepted = newStatus === "Confirmed";
          toast.success(isAccepted ? "Reserva aceptada" : "Reserva rechazada", {
            description: isAccepted
              ? "Calendario actualizado y huésped notificado."
              : "Solicitud declinada y fechas liberadas.",
          });
          // Limpiamos la URL tras el éxito
          router.push(createUrl({ pendingAction: null, actionId: null }), {
            scroll: false,
          });
        },
        onError: (error) => {
          const isAccepted = newStatus === "Confirmed";
          let description: string = "";

          if (error) {
            description = error.message;
          } else if (isAccepted) {
            description = "No se pudo aceptar la reserva. Inténtalo de nuevo.";
          } else {
            description = "No se pudo rechazar la reserva. Inténtalo de nuevo.";
          }

          toast.error(isAccepted ? "Error al aceptar" : "Error al rechazar", {
            description,
          });

          // Limpiamos la URL tras el error
          router.push(createUrl({ pendingAction: null, actionId: null }), {
            scroll: false,
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full sm:w-auto p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">Acción requerida</p>
        <p className="text-sm text-slate-500">
          Responde a esta solicitud para gestionar tu calendario.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 shrink-0 items-center">
        <Button
          variant="outline"
          onClick={() => handleAction("Cancelled", "decline")}
          isLoading={isThisReservationProcessing && pendingAction === "decline"}
          disabled={isThisReservationProcessing && pendingAction === "accept"}
          leftIcon={<IoCloseOutline size={20} />}
          className="w-full sm:w-auto hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          Rechazar
        </Button>

        <Button
          onClick={() => handleAction("Confirmed", "accept")}
          isLoading={isThisReservationProcessing && pendingAction === "accept"}
          disabled={isThisReservationProcessing && pendingAction === "decline"}
          leftIcon={<IoCheckmarkOutline size={20} />}
          className="w-full sm:w-auto"
        >
          Aceptar reserva
        </Button>
      </div>
    </div>
  );
}
