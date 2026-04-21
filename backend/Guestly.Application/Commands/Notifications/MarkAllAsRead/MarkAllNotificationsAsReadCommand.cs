using MediatR;

namespace Guestly.Application.Commands.Notifications.MarkAllAsRead;

/// <summary>
/// Comando para marcar todas las notificaciones como leídas para un usuario específico.
/// </summary>
public record MarkAllNotificationsAsReadCommand(Guid UserId) : IRequest<bool>;
