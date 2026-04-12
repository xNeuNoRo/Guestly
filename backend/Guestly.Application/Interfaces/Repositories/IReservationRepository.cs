using Guestly.Domain.Entities.Reservations;

namespace Guestly.Application.Interfaces.Repositories;

public interface IReservationRepository
{
    Task<Reservation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> HasOverlappingReservationsAsync(
        Guid propertyId,
        DateTime checkIn,
        DateTime checkOut,
        CancellationToken cancellationToken = default
    );
    Task AddAsync(Reservation reservation, CancellationToken cancellationToken = default);
    void Update(Reservation reservation);
}
