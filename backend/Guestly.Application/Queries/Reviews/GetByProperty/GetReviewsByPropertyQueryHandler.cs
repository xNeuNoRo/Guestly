using Guestly.Application.DTOs.Reviews;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Reviews.GetByProperty;

/// <summary>
/// Manejador para la consulta GetReviewsByPropertyQuery, que se encarga de obtener
/// todas las reseñas asociadas a una propiedad específica, identificado por su PropertyId.
/// </summary>
public class GetReviewsByPropertyQueryHandler
    : IRequestHandler<GetReviewsByPropertyQuery, IEnumerable<ReviewResponse>>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IPropertyRepository _propertyRepository;

    public GetReviewsByPropertyQueryHandler(
        IReviewRepository reviewRepository,
        IPropertyRepository propertyRepository
    )
    {
        _reviewRepository = reviewRepository;
        _propertyRepository = propertyRepository;
    }

    /// <summary>
    /// Manejador para la consulta GetReviewsByPropertyQuery, que se encarga de obtener
    /// todas las reseñas asociadas a una propiedad específica, identificado por su PropertyId.
    /// </summary>
    public async Task<IEnumerable<ReviewResponse>> Handle(
        GetReviewsByPropertyQuery request,
        CancellationToken cancellationToken
    )
    {
        var property = await _propertyRepository.GetByIdAsync(
            request.PropertyId,
            cancellationToken
        );
        if (property is null)
        {
            throw AppException.NotFound("La propiedad no existe.", ErrorCodes.PropertyNotFound);
        }

        var reviews = await _reviewRepository.GetByPropertyIdAsync(
            request.PropertyId,
            cancellationToken
        );

        var responseList = new List<ReviewResponse>();

        foreach (var review in reviews)
        {
            var baseResponse = review.Adapt<ReviewResponse>();

            var fullResponse = baseResponse with
            {
                PropertyTitle = property.Title,
                GuestFullName =
                    review.Guest != null
                        ? $"{review.Guest.FirstName} {review.Guest.LastName}"
                        : "Huésped verificado",
            };

            responseList.Add(fullResponse);
        }

        return responseList;
    }
}
