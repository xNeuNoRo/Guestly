using Guestly.Application.DTOs.Reviews;
using MediatR;

namespace Guestly.Application.Commands.Reviews.UpdateReview;

/// <summary>
/// Comando para actualizar una reseña de propiedad existente, que incluye el identificador de la reseña a actualizar,
/// el identificador del huésped que intenta actualizar la reseña, la nueva calificación y el nuevo comentario de la reseña.
/// </summary>
public record UpdateReviewCommand(Guid ReviewId, Guid GuestId, int Rating, string Comment)
    : IRequest<ReviewResponse>;
