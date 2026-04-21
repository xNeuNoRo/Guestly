using MediatR;

namespace Guestly.Application.Commands.Auth.ResetPassword;

/// <summary>
/// Comando para restablecer la contraseña de un usuario.
/// Contiene el correo electrónico del usuario, el token de restablecimiento de contraseña
/// y la nueva contraseña que el usuario desea establecer.
/// </summary>
public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<bool>;
