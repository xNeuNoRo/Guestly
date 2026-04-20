"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoImagesOutline } from "react-icons/io5";

import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { useQueryString } from "@/hooks/shared/useQueryString";

export interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/**
 * @description Grilla de imágenes para la página de detalle de propiedad.
 * Sincroniza tanto la apertura como la foto activa con la URL para permitir
 * compartir enlaces directos a imágenes específicas.
 */
export function PropertyGallery({
  images,
  title,
}: Readonly<PropertyGalleryProps>) {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();
  const galleryRef = useRef<HTMLDivElement>(null);

  // --- Fuente de Verdad: URL ---
  const isGalleryOpen = searchParams.get("gallery") === "open";
  const activePhotoIndex = searchParams.get("photo")
    ? Number(searchParams.get("photo"))
    : null;

  // Si el usuario abre una foto específica o navega por el historial,
  // hacemos scroll automático hacia esa imagen dentro del modal.
  useEffect(() => {
    if (isGalleryOpen && activePhotoIndex !== null && galleryRef.current) {
      const targetPhoto = galleryRef.current.querySelector(
        `#photo-${activePhotoIndex}`,
      );
      if (targetPhoto) {
        targetPhoto.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [isGalleryOpen, activePhotoIndex]);

  // Helpers de navegación
  const openGallery = (index?: number) => {
    router.push(createUrl({ gallery: "open", photo: index ?? null }), {
      scroll: false,
    });
  };

  const closeGallery = () => {
    router.push(createUrl({ gallery: null, photo: null }), { scroll: false });
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-100 md:h-125 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
        <p className="text-slate-500 font-medium">
          No hay imágenes disponibles
        </p>
      </div>
    );
  }

  const displayImages = images.slice(0, 5);

  return (
    <>
      <div className="relative w-full h-75 sm:h-100 md:h-125 rounded-2xl overflow-hidden group">
        {displayImages.length < 3 ? (
          <div className="flex h-full gap-2">
            {displayImages.map((src, index) => (
              <div
                key={src}
                className="relative flex-1 h-full cursor-pointer"
                onClick={() => openGallery(index)}
              >
                <Image
                  src={src}
                  alt={`${title} - Foto ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-full">
            <div
              className="relative md:col-span-2 row-span-2 h-full w-full overflow-hidden cursor-pointer"
              onClick={() => openGallery(0)}
            >
              <Image
                src={displayImages[0]}
                alt={`${title} - Principal`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {displayImages.slice(1, 5).map((src, index) => (
              <div
                key={src}
                className="relative hidden md:block h-full w-full overflow-hidden cursor-pointer"
                onClick={() => openGallery(index + 1)}
              >
                <Image
                  src={src}
                  alt={`${title} - Secundaria ${index + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <Button
            variant="secondary"
            size="md"
            onClick={() => openGallery()}
            className="absolute bottom-4 right-4 shadow-md border border-slate-200 backdrop-blur-md bg-white/90"
            leftIcon={<IoImagesOutline />}
          >
            Mostrar todas las fotos ({images.length})
          </Button>
        )}
      </div>

      <Modal
        open={isGalleryOpen}
        close={closeGallery}
        title="Galería de fotos"
        size="large"
      >
        <div
          ref={galleryRef}
          className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2 pb-4 scroll-smooth"
        >
          {images.map((src, index) => (
            <div
              key={`${src}-modal`}
              id={`photo-${index}`}
              className="relative w-full aspect-video md:aspect-video rounded-lg overflow-hidden border border-slate-100 shadow-sm"
            >
              <Image
                src={src}
                alt={`${title} - Galería completa ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
