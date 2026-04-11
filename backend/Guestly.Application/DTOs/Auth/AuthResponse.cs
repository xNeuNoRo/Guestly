namespace Guestly.Application.DTOs.Auth;

/// <summary>
/// Representa la respuesta de una operación de autenticación,
/// como el inicio de sesión o el registro de un nuevo usuario.
/// </summary>
public record AuthResponse()
{
    /// <summary>
    /// El identificador único del usuario autenticado.
    /// </summary>
    public required Guid Id { get; init; }

    /// <summary>
    /// El nombre del usuario autenticado.
    /// </summary>
    public required string FirstName { get; init; }

    /// <summary>
    /// El apellido del usuario autenticado.
    /// </summary>
    public required string LastName { get; init; }

    /// <summary>
    /// La dirección de correo electrónico del usuario autenticado.
    /// </summary>
    public required string Email { get; init; }

    /// <summary>
    /// El rol del usuario autenticado.
    /// </summary>
    public required int Role { get; init; }

    /// <summary>
    /// El token de acceso JWT (Access Token) utilizado para autorizar las peticiones del usuario autenticado.
    /// </summary>
    public required string Token { get; init; }
}
