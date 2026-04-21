using Guestly.Application.DTOs.Reviews;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Queries.Reviews.GetByReservation;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Reviews.GetByUser;

/// <summary>
/// Manejador de la consulta para obtener la reseña asociada a una reserva específica, identificado por su ReservationId.
/// </summary>
public class GetReviewByReservationQueryHandler
    : IRequestHandler<GetReviewByReservationQuery, ReviewResponse>
{
    private readonly IReviewRepository _reviewRepository;

    public GetReviewByReservationQueryHandler(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    /// <summary>
    /// Maneja la consulta para obtener la reseña asociada a una reserva específica. 
    /// </summary>
    public async Task<ReviewResponse> Handle(
        GetReviewByReservationQuery request,
        CancellationToken cancellationToken
    )
    {
        var review = await _reviewRepository.GetByReservationIdAsync(
            request.ReservationId,
            cancellationToken
        );
        if (review is null)
        {
            throw AppException.NotFound(
                "No se encontró una reseña para la reserva especificada.",
                ErrorCodes.ReviewNotFound
            );
        }

        var response = review.Adapt<ReviewResponse>();

        return response with
        {
            PropertyTitle = review.Property?.Title ?? "Propiedad no disponible",
            GuestFullName =
                review.Guest != null
                    ? $"{review.Guest.FirstName} {review.Guest.LastName}"
                    : "Huésped desconocido",
        };
    }
}
