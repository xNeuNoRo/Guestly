"use client";

import { useToggle } from "@/hooks/shared/useToggle";
import { Button } from "@/components/shared/Button";
import clsx from "clsx";

interface PropertyDescriptionProps {
  description: string;
}

/**
 * @description Renderiza la descripción de la propiedad con soporte para expansión.
 * Evita que descripciones muy largas desplacen demasiado el contenido del detalle.
 */
export function PropertyDescription({
  description,
}: Readonly<PropertyDescriptionProps>) {
  const { value: isExpanded, toggle } = useToggle(false);

  // Umbral de caracteres para mostrar el "Mostrar más"
  const isLongDescription = description.length > 400;

  return (
    <div className="py-8 border-b border-slate-200">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        Acerca de este lugar
      </h3>

      <div className="relative">
        <p
          className={clsx(
            "text-slate-600 leading-relaxed whitespace-pre-line transition-all duration-300",
            !isExpanded && isLongDescription && "line-clamp-6",
          )}
        >
          {description}
        </p>

        {isLongDescription && (
          <div
            className={clsx(
              "mt-4",
              !isExpanded &&
                "absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-white to-transparent flex items-end",
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className="p-0 h-auto font-bold underline decoration-slate-400 underline-offset-4 hover:bg-transparent"
            >
              {isExpanded ? "Mostrar menos" : "Leer más"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
