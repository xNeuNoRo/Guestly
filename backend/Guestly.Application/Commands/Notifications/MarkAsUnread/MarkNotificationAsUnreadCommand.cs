using MediatR;

namespace Guestly.Application.Commands.Notifications.MarkAsUnread;

/// <summary>
/// Comando para marcar una notificación como no leída.
/// </summary>
public record MarkNotificationAsUnreadCommand(Guid NotificationId, Guid UserId) : IRequest<bool>;
