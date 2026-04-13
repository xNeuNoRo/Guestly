using Guestly.Application.DTOs.Notifications;
using Guestly.Application.Interfaces.Repositories;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Notifications.GetAll;

/// <summary>
/// Handler para el query GetAllNotificationsQuery, encargado de obtener
/// todas las notificaciones (leídas y no leídas) de un usuario específico.
/// </summary>
public class GetAllNotificationsQueryHandler
    : IRequestHandler<GetAllNotificationsQuery, IEnumerable<NotificationResponse>>
{
    private readonly INotificationRepository _notificationRepository;

    public GetAllNotificationsQueryHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    /// <summary>
    /// Maneja la lógica para obtener todas las notificaciones de un usuario específico,
    /// utilizando el repositorio de notificaciones para acceder a los datos y luego adaptándolos
    /// a la respuesta esperada.
    /// </summary>
    public async Task<IEnumerable<NotificationResponse>> Handle(
        GetAllNotificationsQuery request,
        CancellationToken cancellationToken
    )
    {
        var notifications = await _notificationRepository.GetAllByUserIdAsync(
            request.UserId,
            cancellationToken
        );

        return notifications.Adapt<IEnumerable<NotificationResponse>>();
    }
}
