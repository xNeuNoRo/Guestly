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
    private readonly IUnitOfWork _unitOfWork;

    public MarkAllNotificationsAsReadCommandHandler(
        INotificationRepository notificationRepository,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork
    )
    {
        _notificationRepository = notificationRepository;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
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

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // siempre, de esa siempre se persisten los cambios.
        await _unitOfWork.CommitAsync(cancellationToken);

        return true;
    }
}
