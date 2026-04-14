using Guestly.Application.DTOs.Reviews;
using MediatR;

namespace Guestly.Application.Queries.Reviews.GetByProperty;

/// <summary>
/// Query para obtener todas las reseñas asociadas a una propiedad específica, identificado por su PropertyId.
/// </summary>
public record GetReviewsByPropertyQuery(Guid PropertyId) : IRequest<IEnumerable<ReviewResponse>>;
