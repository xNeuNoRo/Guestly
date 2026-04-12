using MediatR;

namespace Guestly.Application.Commands.Auth.ConfirmEmail;

/// <summary>
/// Comando para confirmar el correo electrónico de un usuario. Contiene el correo electrónico del usuario
/// y el token de confirmación que se envió al correo electrónico del usuario.
/// </summary>
public record ConfirmEmailCommand(string Email, string Token) : IRequest<bool>;
