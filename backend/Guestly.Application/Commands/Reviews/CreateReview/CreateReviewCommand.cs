using Guestly.Application.DTOs.Reviews;
using MediatR;

namespace Guestly.Application.Commands.Reviews.CreateReview;

/// <summary>
/// Comando para crear una nueva reseña de propiedad.
/// </summary>
public record CreateReviewCommand(
    Guid GuestId,
    Guid PropertyId,
    Guid ReservationId,
    int Rating,
    string Comment
) : IRequest<ReviewResponse>;
