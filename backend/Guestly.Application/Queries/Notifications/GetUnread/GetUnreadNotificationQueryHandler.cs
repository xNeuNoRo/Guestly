using Guestly.Application.DTOs.Notifications;
using Guestly.Application.Interfaces.Repositories;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Notifications.GetUnread;

/// <summary>
/// Handler para el query GetUnreadNotificationQuery, encargado de obtener las notificaciones no leídas de un usuario específico.
/// </summary>
public class GetUnreadNotificationQueryHandler
    : IRequestHandler<GetUnreadNotificationQuery, IEnumerable<NotificationResponse>>
{
    private readonly INotificationRepository _notificationRepository;

    public GetUnreadNotificationQueryHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    /// <summary>
    /// Maneja la lógica para obtener las notificaciones no leídas de un usuario específico,
    /// utilizando el repositorio de notificaciones para acceder a los datos y luego adaptándolos a la respuesta esperada.
    /// </summary>
    public async Task<IEnumerable<NotificationResponse>> Handle(
        GetUnreadNotificationQuery request,
        CancellationToken cancellationToken
    )
    {
        var notifications = await _notificationRepository.GetUnreadByUserIdAsync(
            request.UserId,
            cancellationToken
        );

        return notifications.Adapt<IEnumerable<NotificationResponse>>();
    }
}
