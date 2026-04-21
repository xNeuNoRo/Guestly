using Guestly.Application.DTOs.Reviews;
using MediatR;

namespace Guestly.Application.Queries.Reviews.GetByUser;

/// <summary>
/// Query para obtener las reseñas realizadas por un usuario específico. Retorna una lista de reviews
/// </summary>
public record GetReviewsByUserQuery(Guid UserId) : IRequest<IEnumerable<ReviewResponse>>;
