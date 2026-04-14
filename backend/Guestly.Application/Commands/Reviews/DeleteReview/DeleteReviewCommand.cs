using MediatR;

namespace Guestly.Application.Commands.Reviews.DeleteReview;

/// <summary>
/// Comando para eliminar una reseña. Solo el huésped que creó la reseña puede eliminarla,
/// y se requiere el ID de la reseña y el ID del huésped para realizar esta acción.
/// </summary>
public record DeleteReviewCommand(Guid ReviewId, Guid GuestId) : IRequest<bool>;
