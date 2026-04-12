using MediatR;

namespace Guestly.Application.Commands.Auth.ForgotPassword;

/// <summary>
/// Comando para solicitar un restablecimiento de contraseña.
/// Contiene el correo electrónico del usuario que ha olvidado su contraseña.
/// </summary>
public record ForgotPasswordCommand(string Email) : IRequest<bool>;
