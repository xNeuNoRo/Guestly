using Guestly.Application.DTOs.Reviews;
using MediatR;

namespace Guestly.Application.Queries.Reviews.GetById;

/// <summary>
/// Query para obtener una reseña por su ID.
/// </summary>
public record GetReviewByIdQuery(Guid ReviewId) : IRequest<ReviewResponse>;
