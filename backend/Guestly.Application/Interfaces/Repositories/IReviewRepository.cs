using Guestly.Domain.Entities.Reviews;

namespace Guestly.Application.Interfaces.Repositories;

public interface IReviewRepository
{
    Task<Review?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Review?> GetByReservationIdAsync(
        Guid reservationId,
        CancellationToken cancellationToken = default
    );

    Task<IEnumerable<Review>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );

    // Obtiene todas las reseñas asociadas a una propiedad específica
    Task<IEnumerable<Review>> GetByPropertyIdAsync(
        Guid propertyId,
        CancellationToken cancellationToken = default
    );

    // Valida si ya existe una reseña para una reserva específica antes de crear una nueva
    Task<bool> ExistsByReservationIdAsync(
        Guid reservationId,
        CancellationToken cancellationToken = default
    );

    Task AddAsync(Review review, CancellationToken cancellationToken = default);
    void Update(Review review);
    void Delete(Review review);
}
