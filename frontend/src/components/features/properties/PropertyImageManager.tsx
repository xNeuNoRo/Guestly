"use client";

import { useEffect, useMemo, ChangeEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  IoImageOutline,
  IoTrashOutline,
  IoAddOutline,
  IoCloseCircle,
} from "react-icons/io5";
import clsx from "clsx";

import { Button } from "@/components/shared/Button";
import { useQueryString } from "@/hooks/shared/useQueryString";

interface PropertyImageManagerProps {
  existingImages?: string[];
}

/**
 * @description Gestor avanzado de imágenes.
 * Utiliza índices posicionales en la URL para persistir el borrado de forma ultra ligera.
 */
export function PropertyImageManager({
  existingImages = [],
}: Readonly<PropertyImageManagerProps>) {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();
  const { control, setValue } = useFormContext();

  // --- Fuente de Verdad: URL (Solo guardamos los ÍNDICES) ---
  const deletedIndices = useMemo(() => {
    const param = searchParams.get("deleted");
    return param ? param.split(",").map(Number) : [];
  }, [searchParams]);

  // Convertimos los índices de la URL a las URLs reales para el formulario (imagesToDelete)
  useEffect(() => {
    const urlsToDelete = deletedIndices
      .map((index) => existingImages[index])
      .filter(Boolean); // Seguridad por si el índice no existe

    setValue("imagesToDelete", urlsToDelete, { shouldValidate: true });
  }, [deletedIndices, existingImages, setValue]);

  // Previsualización de archivos locales (Nuevas fotos)
  const newFiles = useWatch({ control, name: "images" }) as
    | FileList
    | undefined;
  const newPreviewUrls = useMemo(() => {
    if (!newFiles || newFiles.length === 0) return [];
    return Array.from(newFiles).map((file) => URL.createObjectURL(file));
  }, [newFiles]);

  useEffect(() => {
    return () => newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [newPreviewUrls]);

  // --- MÉTODOS DE GESTIÓN CORREGIDOS ---

  /**
   * Manejador de cambio manual para acumular archivos.
   * Evita que el input limpie las fotos seleccionadas previamente.
   */
  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const dataTransfer = new DataTransfer();

    // Mantener los archivos que ya estaban en el formulario
    if (newFiles) {
      Array.from(newFiles).forEach((file) => dataTransfer.items.add(file));
    }

    // Agregar los nuevos archivos seleccionados
    Array.from(selectedFiles).forEach((file) => dataTransfer.items.add(file));

    // Actualizar el valor en React Hook Form
    setValue("images", dataTransfer.files, { shouldValidate: true });

    // Limpiar el valor del input para permitir seleccionar el mismo archivo si se desea
    e.target.value = "";
  };

  const removeNewFile = (indexToRemove: number) => {
    if (!newFiles) return;
    const dataTransfer = new DataTransfer();
    Array.from(newFiles).forEach((file, i) => {
      if (i !== indexToRemove) dataTransfer.items.add(file);
    });
    setValue("images", dataTransfer.files, { shouldValidate: true });
  };

  const toggleExistingImageDeletion = (index: number) => {
    const isMarked = deletedIndices.includes(index);
    const updatedIndices = isMarked
      ? deletedIndices.filter((i) => i !== index)
      : [...deletedIndices, index];

    router.push(
      createUrl({
        deleted:
          updatedIndices.length > 0 ? updatedIndices.sort().join(",") : null,
      }),
      { scroll: false },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Área de Carga */}
      <div className="relative group">
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors group-hover:border-primary-400 group-hover:bg-slate-50">
          <div className="p-4 bg-primary-50 rounded-full text-primary-600 mb-4 group-hover:scale-110 transition-transform">
            <IoImageOutline size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-900">
              Añade fotos nuevas
            </p>
            <p className="text-sm text-slate-500">
              Arrastra o haz clic para subir múltiples fotos
            </p>
          </div>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFilesChange}
        />
      </div>

      {/* Grilla de Gestión */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Renderizado de Imágenes EXISTENTES mediante ÍNDICES */}
        {existingImages.map((url, index) => {
          const isMarkedForDeletion = deletedIndices.includes(index);
          return (
            <div
              key={`existing-${url}`}
              className={clsx(
                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all group",
                isMarkedForDeletion
                  ? "border-red-500 opacity-60"
                  : "border-slate-100",
              )}
            >
              <Image src={url} alt="Propiedad" fill className="object-cover" />
              <div
                className={clsx(
                  "absolute inset-0 flex items-center justify-center transition-opacity",
                  isMarkedForDeletion
                    ? "bg-red-500/20 opacity-100"
                    : "bg-black/40 opacity-0 group-hover:opacity-100",
                )}
              >
                <Button
                  type="button"
                  variant={isMarkedForDeletion ? "secondary" : "danger"}
                  size="sm"
                  onClick={() => toggleExistingImageDeletion(index)}
                  className="rounded-full h-10 w-10 p-0 shadow-lg"
                >
                  {isMarkedForDeletion ? (
                    <IoAddOutline size={20} />
                  ) : (
                    <IoTrashOutline size={20} />
                  )}
                </Button>
              </div>
              {isMarkedForDeletion && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Para eliminar
                </div>
              )}
            </div>
          );
        })}

        {/* Renderizado de Imágenes NUEVAS (Previsualización local) */}
        {newPreviewUrls.map((url, index) => (
          <div
            key={`new-${url}`}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-400 group"
          >
            <Image
              src={url}
              alt="Nueva"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeNewFile(index)}
                className="rounded-full h-10 w-10 p-0 shadow-lg"
              >
                <IoCloseCircle size={20} />
              </Button>
            </div>
            <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Nuevo
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
