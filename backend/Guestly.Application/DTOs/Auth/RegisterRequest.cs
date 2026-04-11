namespace Guestly.Application.DTOs.Auth;

/// <summary>
/// Representa la request para registrar un nuevo usuario en el sistema.
/// </summary>
public record RegisterRequest()
{
    /// <summary>
    /// El nombre del nuevo usuario.
    /// </summary>
    public required string FirstName { get; init; }

    /// <summary>
    /// El apellido del nuevo usuario.
    /// </summary>
    public required string LastName { get; init; }

    /// <summary>
    /// La dirección de correo electrónico del nuevo usuario.
    /// </summary>
    public required string Email { get; init; }

    /// <summary>
    /// La contraseña del nuevo usuario.
    /// </summary>
    public required string Password { get; init; }

    /// <summary>
    /// El rol del nuevo usuario.
    /// </summary>
    public required int Role { get; init; }
}
