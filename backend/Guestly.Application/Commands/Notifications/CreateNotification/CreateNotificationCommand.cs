using Guestly.Application.DTOs.Notifications;
using Guestly.Domain.Enums;
using MediatR;

namespace Guestly.Application.Commands.Notifications.CreateNotification;

/// <summary>
/// Representa el comando para crear una nueva notificación en el sistema,
/// con propiedades como el identificador del usuario destinatario,
/// el título de la notificación, el mensaje de la notificación y el tipo de notificación.
/// </summary>
public record CreateNotificationCommand(
    Guid UserId,
    string Title,
    string Message,
    NotificationTypes Type
) : IRequest<NotificationResponse>;
