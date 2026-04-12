using Guestly.Domain.Entities.Notifications;

namespace Guestly.Application.Interfaces.Repositories;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Notification notification, CancellationToken cancellationToken = default);

    // Simplemente para marcar como leida o no leida
    void Update(Notification notification);
}
