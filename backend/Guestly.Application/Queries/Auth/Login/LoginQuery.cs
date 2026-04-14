using Guestly.Application.DTOs.Auth;
using MediatR;

namespace Guestly.Application.Queries.Auth.Login;

/// <summary>
/// Query para iniciar sesión. Contiene el correo electrónico y la contraseña del usuario que intenta iniciar sesión.
/// </summary>
public record LoginQuery(string Email, string Password) : IRequest<AuthResponse>;
