using Guestly.Application.DTOs.Notifications;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Notifications;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Notifications.CreateNotification;

public class CreateNotificationCommandHandler
    : IRequestHandler<CreateNotificationCommand, NotificationResponse>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;

    public CreateNotificationCommandHandler(
        INotificationRepository notificationRepository,
        IUserRepository userRepository
    )
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
    }

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

        var response = notification.Adapt<NotificationResponse>();

        // TODO: Enviar la notificación al usuario con websockets usando SignalR

        return response;
    }
}
