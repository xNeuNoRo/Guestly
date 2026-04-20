using Guestly.API.Controllers.Base;
using Guestly.Application.Commands.Auth.ConfirmEmail;
using Guestly.Application.Commands.Auth.ForgotPassword;
using Guestly.Application.Commands.Auth.Register;
using Guestly.Application.Commands.Auth.ResendConfirmationEmail;
using Guestly.Application.Commands.Auth.ResetPassword;
using Guestly.Application.DTOs.Auth;
using Guestly.Application.DTOs.Users;
using Guestly.Application.Queries.Auth.Login;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Guestly.API.Controllers;

/// <summary>
/// Controlador encargado de gestionar los procesos de autenticación y seguridad de los usuarios,
/// incluyendo el registro, inicio de sesión, confirmación de cuenta y recuperación de contraseñas.
/// </summary>
[AllowAnonymous] // Permite el acceso a este controlador sin necesidad de autenticación previa, ya que maneja procesos de autenticación.
public class AuthController : BaseApiController
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Registra un nuevo usuario en la plataforma.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var command = new RegisterUserCommand(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Password,
            request.Role
        );

        var result = await _mediator.Send(command);

        // Devuelve un 201 Created con la información del nuevo usuario registrado
        return Success(result);
    }

    /// <summary>
    /// Inicia sesión y devuelve un token JWT si las credenciales son válidas.
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var query = new LoginQuery(request.Email, request.Password);
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Confirma la cuenta de un usuario mediante el token enviado por correo.
    /// </summary>
    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(
        [FromQuery] string email,
        [FromQuery] string token
    )
    {
        var command = new ConfirmEmailCommand(email, token);
        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Reenvía el correo de confirmación en caso de que el original haya expirado o no llegara.
    /// </summary>
    [HttpPost("resend-confirmation")]
    public async Task<IActionResult> ResendConfirmation(
        [FromBody] ResendConfirmationEmailRequest request
    )
    {
        var command = new ResendConfirmationEmailCommand(request.Email, request.Flow);
        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Solicita un enlace de recuperación de contraseña para un correo específico.
    /// </summary>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var command = new ForgotPasswordCommand(request.Email);
        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Establece una nueva contraseña utilizando el token de recuperación.
    /// </summary>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var command = new ResetPasswordCommand(request.Email, request.Token, request.NewPassword);
        await _mediator.Send(command);
        return Success();
    }
}
