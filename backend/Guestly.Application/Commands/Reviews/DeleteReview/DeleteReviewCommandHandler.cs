using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using MediatR;

namespace Guestly.Application.Commands.Reviews.DeleteReview;

/// <summary>
/// Manejador del comando para eliminar una reseña. Verifica que la reseña exista y que
/// el huésped que intenta eliminarla sea el creador de la reseña antes de proceder con la eliminación.
/// </summary>
public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand, bool>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteReviewCommandHandler(IReviewRepository reviewRepository, IUnitOfWork unitOfWork)
    {
        _reviewRepository = reviewRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Maneja la lógica para eliminar una reseña. Verifica que la reseña exista y que el huésped tenga permiso para eliminarla.
    /// </summary>
    public async Task<bool> Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _reviewRepository.GetByIdAsync(request.ReviewId, cancellationToken);
        if (review is null)
        {
            throw AppException.NotFound("La reseña no existe.", ErrorCodes.ReviewNotFound);
        }

        if (review.GuestId != request.GuestId)
        {
            throw AppException.Forbidden(
                "No tienes permiso para eliminar esta reseña.",
                ErrorCodes.ReviewAccessDenied
            );
        }

        _reviewRepository.Delete(review);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // solamente si es que no detecta una transaccion activa
        await _unitOfWork.CommitAsync(cancellationToken);

        return true;
    }
}
