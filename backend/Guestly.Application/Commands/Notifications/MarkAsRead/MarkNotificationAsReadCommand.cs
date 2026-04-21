using MediatR;

namespace Guestly.Application.Commands.Notifications.MarkAsRead;

/// <summary>
/// Comando para marcar una notificación como leída. Este comando se utiliza
/// para actualizar el estado de una notificación específica a "leída" en la base de datos.
/// </summary>
public record MarkNotificationAsReadCommand(Guid NotificationId, Guid UserId) : IRequest<bool>;
