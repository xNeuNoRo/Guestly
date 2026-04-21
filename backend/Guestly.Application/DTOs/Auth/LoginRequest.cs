namespace Guestly.Application.DTOs.Auth;

/// <summary>
/// Representa la request para iniciar sesión en el sistema.
/// </summary>
public record LoginRequest()
{
    /// <summary>
    /// La dirección de correo electrónico del usuario que intenta iniciar sesión.
    /// </summary>
    public required string Email { get; init; }

    /// <summary>
    /// La contraseña del usuario que intenta iniciar sesión.
    /// </summary>
    public required string Password { get; init; }
}
