using System.Security.Claims;
using Guestly.API.Controllers.Base;
using Guestly.Application.Commands.Auth.ConfirmEmail;
using Guestly.Application.Commands.Users.AddRole;
using Guestly.Application.Commands.Users.ChangeEmail;
using Guestly.Application.Commands.Users.ChangePassword;
using Guestly.Application.Commands.Users.ChangeUnconfirmedEmail;
using Guestly.Application.Commands.Users.UpdateProfile;
using Guestly.Application.DTOs.Users;
using Guestly.Application.Queries.Users.GetHostDashboardStats;
using Guestly.Application.Queries.Users.GetPublicProfile;
using Guestly.Application.Queries.Users.GetUserProfile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Guestly.API.Controllers;

/// <summary>
/// Controlador encargado de gestionar la información y configuraciones del perfil del usuario,
/// así como de proveer los datos públicos y paneles de control específicos por rol.
/// </summary>
[Authorize] // Los endpoints requieren autenticación por defecto, salvo los marcados explícitamente
public class UsersController : BaseApiController
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Extrae el ID del usuario directamente desde los claims del token JWT.
    /// </summary>
    private Guid GetUserId()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : Guid.Empty;
    }

    /// <summary>
    /// Obtiene el perfil completo y privado del usuario autenticado.
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var query = new GetUserProfileQuery(GetUserId());
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Actualiza la información básica del perfil del usuario.
    /// </summary>
    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileRequest request)
    {
        var command = new UpdateUserProfileCommand(
            GetUserId(),
            request.FirstName,
            request.LastName
        );

        var result = await _mediator.Send(command);
        return Success(result);
    }

    /// <summary>
    /// Cambia la contraseña del usuario autenticado.
    /// </summary>
    [HttpPut("me/password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var command = new ChangePasswordCommand(
            GetUserId(),
            request.CurrentPassword,
            request.NewPassword
        );

        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Inicia el proceso de cambio de correo electrónico (envía el token de confirmación al nuevo correo).
    /// </summary>
    [HttpPut("me/email")]
    public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailRequest request)
    {
        var command = new ChangeEmailCommand(GetUserId(), request.NewEmail, request.Password);
        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Inicia el proceso de cambio de correo electrónico para usuarios que aún no han
    /// confirmado su email (envía el token de confirmación al nuevo correo).
    /// </summary>
    [HttpPut("me/unconfirmed-email")]
    public async Task<IActionResult> ChangeUnconfirmedEmail(
        [FromBody] ChangeUnconfirmedEmailRequest request
    )
    {
        var command = new ChangeUnconfirmedEmailCommand(GetUserId(), request.NewEmail);
        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Confirma el cambio de correo electrónico usando el token enviado al nuevo correo.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("confirm-email-change")]
    public async Task<IActionResult> ConfirmEmailChange(
        [FromQuery] string email,
        [FromQuery] string token
    )
    {
        var command = new ConfirmEmailCommand(email, token);
        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Permite a un usuario existente adquirir un nuevo rol (ej. convertirse en Host).
    /// </summary>
    [HttpPost("me/role")]
    public async Task<IActionResult> AddRole([FromBody] AddRoleRequest request)
    {
        var command = new AddRoleCommand(GetUserId(), request.RoleToAdd);
        var result = await _mediator.Send(command);

        // Retornamos el result (que contiene el nuevo JWT con los roles actualizados)
        return Success(result);
    }

    /// <summary>
    /// Obtiene el perfil público de cualquier usuario (generalmente usado para ver detalles de un Anfitrión).
    /// </summary>
    [AllowAnonymous]
    [HttpGet("{id:guid}/public")]
    public async Task<IActionResult> GetPublicProfile(Guid id)
    {
        var query = new GetPublicProfileQuery(id);
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Obtiene las estadísticas del panel de control de un Anfitrión.
    /// </summary>
    [Authorize(Roles = "Host")] // Solo usuarios con rol Host pueden acceder a sus métricas
    [HttpGet("host/dashboard")]
    public async Task<IActionResult> GetHostDashboardStats()
    {
        var query = new GetHostDashboardStatsQuery(GetUserId());
        var result = await _mediator.Send(query);
        return Success(result);
    }
}
