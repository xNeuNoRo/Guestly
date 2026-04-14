using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using MediatR;

namespace Guestly.Application.Commands.Notifications.MarkAsUnread;

/// <summary>
/// Manejador para el comando de marcar una notificación como no leída.
/// </summary>
public class MarkNotificationAsUnreadCommandHandler
    : IRequestHandler<MarkNotificationAsUnreadCommand, bool>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MarkNotificationAsUnreadCommandHandler(
        INotificationRepository notificationRepository,
        IUnitOfWork unitOfWork
    )
    {
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Maneja el comando para marcar una notificación como no leída.
    /// </summary>
    public async Task<bool> Handle(
        MarkNotificationAsUnreadCommand request,
        CancellationToken cancellationToken
    )
    {
        var notification = await _notificationRepository.GetByIdAsync(
            request.NotificationId,
            cancellationToken
        );
        if (notification is null)
        {
            throw AppException.NotFound(
                "La notificación no existe.",
                ErrorCodes.NotificationNotFound
            );
        }

        if (notification.UserId != request.UserId)
        {
            throw AppException.Forbidden(
                "No tienes permiso para modificar esta notificación.",
                ErrorCodes.Forbidden
            );
        }

        notification.MarkAsUnread();
        _notificationRepository.Update(notification);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // solamente si es que no detecta una transaccion activa
        await _unitOfWork.CommitAsync(cancellationToken);

        return true;
    }
}
