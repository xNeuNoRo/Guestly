using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Guestly.Domain.Interfaces;
using MediatR;

namespace Guestly.Application.Commands.Notifications.MarkAsRead;

/// <summary>
/// Manejador del comando MarkNotificationAsReadCommand, encargado de procesar la lógica para marcar una notificación como leída.
/// </summary>
public class MarkNotificationAsReadCommandHandler
    : IRequestHandler<MarkNotificationAsReadCommand, bool>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;

    public MarkNotificationAsReadCommandHandler(
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
    /// Maneja la lógica para marcar una notificación como leída. Verifica que la notificación
    /// exista y que el usuario tenga permiso para modificarla antes de actualizar su estado a "leída" en la base de datos.
    /// </summary>
    public async Task<bool> Handle(
        MarkNotificationAsReadCommand request,
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

        notification.MarkAsRead(_dateTimeProvider.UtcNow);
        _notificationRepository.Update(notification);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // siempre, de esa siempre se persisten los cambios.
        await _unitOfWork.CommitAsync(cancellationToken);

        return true;
    }
}
