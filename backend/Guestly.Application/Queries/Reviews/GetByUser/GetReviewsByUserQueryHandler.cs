using Guestly.Application.DTOs.Reviews;
using Guestly.Application.Interfaces.Repositories;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Reviews.GetByUser;

/// <summary>
/// Manejador para obtener las reseñas realizadas por un usuario específico. Retorna una lista de reviews
/// </summary>
public class GetReviewsByUserQueryHandler
    : IRequestHandler<GetReviewsByUserQuery, IEnumerable<ReviewResponse>>
{
    private readonly IReviewRepository _reviewRepository;

    public GetReviewsByUserQueryHandler(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    /// <summary>
    /// Maneja la consulta para obtener las reseñas realizadas por un usuario específico. Retorna una lista de reviews
    /// </summary>
    public async Task<IEnumerable<ReviewResponse>> Handle(
        GetReviewsByUserQuery request,
        CancellationToken cancellationToken
    )
    {
        var reviews = await _reviewRepository.GetByUserIdAsync(request.UserId, cancellationToken);

        var responseList = new List<ReviewResponse>();
        foreach (var review in reviews)
        {
            var baseResponse = review.Adapt<ReviewResponse>();

            var fullResponse = baseResponse with
            {
                PropertyTitle = review.Property?.Title ?? "Propiedad no disponible",
                GuestFullName =
                    review.Guest != null
                        ? $"{review.Guest.FirstName} {review.Guest.LastName}"
                        : "Huésped desconocido",
            };

            responseList.Add(fullResponse);
        }
        return responseList;
    }
}
