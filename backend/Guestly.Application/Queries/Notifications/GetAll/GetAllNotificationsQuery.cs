using Guestly.Application.DTOs.Notifications;
using MediatR;

namespace Guestly.Application.Queries.Notifications.GetAll;

/// <summary>
/// Query para obtener todas las notificaciones de un usuario específico, incluyendo tanto las leídas como las no leídas.
/// </summary>
public record GetAllNotificationsQuery(Guid UserId) : IRequest<IEnumerable<NotificationResponse>>;
