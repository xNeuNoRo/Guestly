using Guestly.Application.DTOs.Reviews;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Reviews.GetById;

/// <summary>
/// Query para obtener una reseña por su ID.
/// </summary>
public class GetReviewByIdQueryHandler : IRequestHandler<GetReviewByIdQuery, ReviewResponse>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IPropertyRepository _propertyRepository;

    public GetReviewByIdQueryHandler(
        IReviewRepository reviewRepository,
        IPropertyRepository propertyRepository
    )
    {
        _reviewRepository = reviewRepository;
        _propertyRepository = propertyRepository;
    }

    /// <summary>
    /// Maneja la consulta para obtener una reseña por su ID.
    /// </summary>
    public async Task<ReviewResponse> Handle(
        GetReviewByIdQuery request,
        CancellationToken cancellationToken
    )
    {
        var review = await _reviewRepository.GetByIdAsync(request.ReviewId, cancellationToken);
        if (review is null)
        {
            throw AppException.NotFound("La reseña no existe.", ErrorCodes.ReviewNotFound);
        }

        var property = await _propertyRepository.GetByIdAsync(review.PropertyId, cancellationToken);

        var response = review.Adapt<ReviewResponse>();

        return response with
        {
            PropertyTitle = property?.Title ?? "Propiedad no disponible",
            GuestFullName =
                review.Guest != null
                    ? $"{review.Guest.FirstName} {review.Guest.LastName}"
                    : "Huésped verificado",
        };
    }
}
