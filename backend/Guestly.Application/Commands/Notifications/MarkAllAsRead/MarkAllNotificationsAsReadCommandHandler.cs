using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Interfaces;
using MediatR;

namespace Guestly.Application.Commands.Notifications.MarkAllAsRead;

/// <summary>
/// Manejador del comando para marcar todas las notificaciones como leídas para un usuario específico.
/// </summary>
public class MarkAllNotificationsAsReadCommandHandler
    : IRequestHandler<MarkAllNotificationsAsReadCommand, bool>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IDateTimeProvider _dateTimeProvider;

    public MarkAllNotificationsAsReadCommandHandler(
        INotificationRepository notificationRepository,
        IDateTimeProvider dateTimeProvider
    )
    {
        _notificationRepository = notificationRepository;
        _dateTimeProvider = dateTimeProvider;
    }

    /// <summary>
    /// Maneja el comando para marcar todas las notificaciones como leídas para un usuario específico.
    /// </summary>
    public async Task<bool> Handle(
        MarkAllNotificationsAsReadCommand request,
        CancellationToken cancellationToken
    )
    {
        var unreadNotifications = await _notificationRepository.GetUnreadByUserIdAsync(
            request.UserId,
            cancellationToken
        );

        // Si no hay notificaciones sin leer, devolvemos true directamente
        if (!unreadNotifications.Any())
        {
            return true;
        }

        var now = _dateTimeProvider.UtcNow;

        foreach (var notification in unreadNotifications)
        {
            notification.MarkAsRead(now);
            _notificationRepository.Update(notification);
        }

        return true;
    }
}
