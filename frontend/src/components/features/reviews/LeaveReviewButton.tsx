"use client";

import { useRouter } from "next/navigation";
import { IoStarOutline } from "react-icons/io5";

import { Button } from "@/components/shared/Button";
import { useQueryString } from "@/hooks/shared/useQueryString";

interface LeaveReviewButtonProps {
  propertyId: string;
  reservationId: string;
  className?: string;
}

/**
 * @description Botón disparador para dejar una reseña.
 * Inyecta en la URL los IDs necesarios para que el ReviewFormModal sepa qué calificar.
 */
export function LeaveReviewButton({
  propertyId,
  reservationId,
  className,
}: Readonly<LeaveReviewButtonProps>) {
  const router = useRouter();
  const { createUrl } = useQueryString();

  const handleClick = () => {
    const url = createUrl({
      action: "create-review",
      propertyId,
      reservationId,
    });

    router.push(url, { scroll: false });
  };

  return (
    <Button
      onClick={handleClick}
      variant="secondary"
      size="sm"
      className={`rounded-xl font-bold shadow-sm hover:shadow-md transition-all ${className}`}
      leftIcon={<IoStarOutline size={18} />}
    >
      Calificar estancia
    </Button>
  );
}
