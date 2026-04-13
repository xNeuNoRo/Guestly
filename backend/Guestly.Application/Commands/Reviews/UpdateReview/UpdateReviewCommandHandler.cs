using Guestly.Application.DTOs.Reviews;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Reviews.UpdateReview;

/// <summary>
/// Manejador para el comando UpdateReviewCommand, encargado de procesar la lógica de negocio
/// para actualizar una reseña de propiedad existente, incluyendo validaciones como verificar la existencia
/// de la reseña, asegurarse de que el huésped que intenta actualizar la reseña es el mismo que la creó, etc.
/// </summary>
public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand, ReviewResponse>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;

    public UpdateReviewCommandHandler(
        IReviewRepository reviewRepository,
        IPropertyRepository propertyRepository,
        IUserRepository userRepository
    )
    {
        _reviewRepository = reviewRepository;
        _propertyRepository = propertyRepository;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Maneja la lógica para actualizar una reseña de propiedad existente, realizando las validaciones necesarias
    /// y asegurando que solo el huésped que creó la reseña pueda actualizarla, además de verificar la existencia
    /// de la reseña antes de intentar actualizarla, y finalmente actualizando la reseña y devolviendo una respuesta
    /// con los detalles de la reseña actualizada, incluyendo el título de la propiedad y el nombre completo del huésped.
    /// </summary>
    public async Task<ReviewResponse> Handle(
        UpdateReviewCommand request,
        CancellationToken cancellationToken
    )
    {
        var review = await _reviewRepository.GetByIdAsync(request.ReviewId, cancellationToken);
        if (review is null)
        {
            throw AppException.NotFound(
                "La reseña especificada no existe.",
                ErrorCodes.ReviewNotFound
            );
        }

        if (review.GuestId != request.GuestId)
        {
            throw AppException.Forbidden(
                "No tienes permiso para editar esta reseña.",
                ErrorCodes.ReviewAccessDenied
            );
        }

        review.UpdateDetails(request.Rating, request.Comment);

        _reviewRepository.Update(review);

        var property = await _propertyRepository.GetByIdAsync(review.PropertyId, cancellationToken);
        var guest = await _userRepository.GetByIdAsync(review.GuestId, cancellationToken);

        var response = review.Adapt<ReviewResponse>();

        return response with
        {
            PropertyTitle = property!.Title,
            GuestFullName = $"{guest!.FirstName} {guest.LastName}",
        };
    }
}
