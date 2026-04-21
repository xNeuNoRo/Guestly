"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoTrashOutline, IoWarningOutline } from "react-icons/io5";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { useQueryString } from "@/hooks/shared/useQueryString";
import { useDeleteProperty } from "@/hooks/properties";

/**
 * @description Modal de confirmación para eliminar una propiedad.
 * Fuente de verdad: URL (modal=delete-property, deleteId=[id], deleteName=[nombre]).
 */
export function DeletePropertyModal() {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  // --- Fuente de Verdad: URL ---
  const isOpen = searchParams.get("modal") === "delete-property";
  const propertyId = searchParams.get("deleteId");
  const propertyName = searchParams.get("deleteName");

  const { mutate: deleteProperty, isPending } = useDeleteProperty();

  const close = () => {
    // Limpiamos la URL al cerrar para resetear el estado del modal
    router.push(createUrl({ modal: null, deleteId: null, deleteName: null }), {
      scroll: false,
    });
  };

  const handleDelete = () => {
    if (!propertyId) return;

    deleteProperty(propertyId, {
      onSuccess: () => {
        toast.success("Propiedad eliminada", {
          description: `"${propertyName}" ha sido borrada permanentemente.`,
        });
        close();
      },
    });
  };

  return (
    <Modal
      open={isOpen}
      close={close}
      title="¿Eliminar propiedad?"
      size="medium"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
          <IoWarningOutline className="text-red-600 shrink-0" size={24} />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-red-900">
              Esta acción es irreversible
            </p>
            <p className="text-sm text-red-700">
              Estás a punto de eliminar{" "}
              <span className="font-bold">&quot;{propertyName}&quot;</span>. Se
              cancelarán las reservas futuras y se perderán todos los datos
              asociados.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="ghost" onClick={close} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isPending}
            leftIcon={<IoTrashOutline />}
          >
            Eliminar permanentemente
          </Button>
        </div>
      </div>
    </Modal>
  );
}
