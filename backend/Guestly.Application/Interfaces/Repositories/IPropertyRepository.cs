using Guestly.Domain.Entities.Properties;

namespace Guestly.Application.Interfaces.Repositories;

public interface IPropertyRepository
{
    Task<Property?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Property property, CancellationToken cancellationToken = default);
    void Update(Property property);
    void Delete(Property property);
}
