using System.Security.Claims;
using Guestly.API.Controllers.Base;
using Guestly.Application.Commands.Notifications.MarkAllAsRead;
using Guestly.Application.Commands.Notifications.MarkAsRead;
using Guestly.Application.Commands.Notifications.MarkAsUnread;
using Guestly.Application.Queries.Notifications.GetAll;
using Guestly.Application.Queries.Notifications.GetUnread;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Guestly.API.Controllers;

/// <summary>
/// Controlador encargado de gestionar las notificaciones in-app del usuario (la "campanita").
/// </summary>
[Authorize] // Las notificaciones son inherentemente privadas, requieren autenticación siempre
public class NotificationsController : BaseApiController
{
    private readonly IMediator _mediator;

    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : Guid.Empty;
    }

    /// <summary>
    /// Obtiene el historial completo de notificaciones del usuario autenticado.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var query = new GetAllNotificationsQuery(GetUserId());
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Obtiene únicamente las notificaciones que el usuario no ha leído.
    /// </summary>
    [HttpGet("unread")]
    public async Task<IActionResult> GetUnread()
    {
        var query = new GetUnreadNotificationQuery(GetUserId());
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Marca una notificación específica como leída.
    /// </summary>
    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var command = new MarkNotificationAsReadCommand(id, GetUserId());
        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Revierte una notificación al estado de "No Leída".
    /// </summary>
    [HttpPatch("{id:guid}/unread")]
    public async Task<IActionResult> MarkAsUnread(Guid id)
    {
        var command = new MarkNotificationAsUnreadCommand(id, GetUserId());
        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Marca todas las notificaciones pendientes del usuario como leídas en una sola acción.
    /// </summary>
    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var command = new MarkAllNotificationsAsReadCommand(GetUserId());
        await _mediator.Send(command);
        return Success();
    }
}
