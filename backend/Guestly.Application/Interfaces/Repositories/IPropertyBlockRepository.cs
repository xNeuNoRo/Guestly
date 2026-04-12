using Guestly.Domain.Entities.Reservations;

namespace Guestly.Application.Interfaces.Repositories;

public interface IPropertyBlockRepository
{
    Task<PropertyBlock?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<PropertyBlock>> GetUpcomingBlocksByPropertyIdAsync(
        Guid propertyId,
        CancellationToken cancellationToken = default
    );
    Task<bool> HasOverlappingBlocksAsync(
        Guid propertyId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    );
    Task AddAsync(PropertyBlock block, CancellationToken cancellationToken = default);
    void Update(PropertyBlock block);
    void Delete(PropertyBlock block);
}
