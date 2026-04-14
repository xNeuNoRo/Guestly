using Guestly.Application.DTOs.Notifications;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Notifications;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Notifications.CreateNotification;

/// <summary>
/// Manejador del comando para crear una nueva notificación en el sistema.
/// Este manejador se encarga de validar la existencia del usuario destinatario,
/// crear la notificación y guardarla en el repositorio correspondiente.
/// </summary>
public class CreateNotificationCommandHandler
    : IRequestHandler<CreateNotificationCommand, NotificationResponse>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateNotificationCommandHandler(
        INotificationRepository notificationRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork
    )
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Maneja la lógica para crear una nueva notificación, incluyendo la validación del usuario destinatario,
    /// la creación de la notificación y su almacenamiento en el repositorio.
    /// </summary>
    public async Task<NotificationResponse> Handle(
        CreateNotificationCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound(
                "El usuario destino para la notificación no existe.",
                ErrorCodes.UserNotFound
            );
        }

        var notification = new Notification(
            userId: request.UserId,
            title: request.Title,
            message: request.Message,
            type: request.Type
        );

        await _notificationRepository.AddAsync(notification, cancellationToken);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // siempre, de esa siempre se persisten los cambios.
        await _unitOfWork.CommitAsync(cancellationToken);

        var response = notification.Adapt<NotificationResponse>();

        // TODO: Enviar la notificación al usuario con websockets usando SignalR

        return response;
    }
}
