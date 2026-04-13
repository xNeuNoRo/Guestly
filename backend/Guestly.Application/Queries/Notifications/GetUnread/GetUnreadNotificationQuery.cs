using Guestly.Application.DTOs.Notifications;
using MediatR;

namespace Guestly.Application.Queries.Notifications.GetUnread;

/// <summary>
/// Query para obtener las notificaciones no leídas de un usuario específico.
/// </summary>
public record GetUnreadNotificationQuery(Guid UserId) : IRequest<IEnumerable<NotificationResponse>>;
