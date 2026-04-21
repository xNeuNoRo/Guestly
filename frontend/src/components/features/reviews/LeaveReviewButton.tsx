"use client";

import { useRouter } from "next/navigation";
import { IoStarOutline, IoPencilOutline } from "react-icons/io5";

import { Button } from "@/components/shared/Button";
import { useQueryString } from "@/hooks/shared/useQueryString";
import { useReviewByReservation } from "@/hooks/reviews/useQueries";

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

  const { data: existingReview, isLoading } =
    useReviewByReservation(reservationId);

  const handleClick = () => {
    if (existingReview) {
      const url = createUrl({
        action: "edit-review",
        reviewId: existingReview.id,
      });
      router.push(url, { scroll: false });
    } else {
      const url = createUrl({
        action: "create-review",
        propertyId,
        reservationId,
      });
      router.push(url, { scroll: false });
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="secondary"
      size="sm"
      isLoading={isLoading}
      className={`rounded-xl font-bold shadow-sm hover:shadow-md transition-all ${className}`}
      leftIcon={
        existingReview ? (
          <IoPencilOutline size={18} />
        ) : (
          <IoStarOutline size={18} />
        )
      }
    >
      {existingReview ? "Editar reseña" : "Calificar estancia"}
    </Button>
  );
}
