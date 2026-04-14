using Guestly.Domain.Enums;

namespace Guestly.Application.DTOs.Notifications;

/// <summary>
/// Representa la respuesta de una notificación, con propiedades como el identificador de la notificación,
/// el identificador del usuario al que va dirigida la notificación, el título y mensaje de
/// la notificación, el tipo de notificación, si la notificación ha sido leída o no, 
/// la fecha de creación y la fecha de lectura (si aplica).
/// </summary>
public record NotificationResponse
{
    public required Guid Id { get; init; }
    public required Guid UserId { get; init; }
    public required string Title { get; init; }
    public required string Message { get; init; }
    public required NotificationTypes Type { get; init; }
    public required bool IsRead { get; init; }
    public required DateTime CreatedAt { get; init; }
    public DateTime? ReadAt { get; init; }
}
