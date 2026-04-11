namespace Guestly.Application.DTOs.Users;

/// <summary>
/// Representa la respuesta de una operación para obtener el perfil de un usuario,
/// incluyendo información básica como el nombre, correo electrónico y rol del usuario.
/// </summary>
public record UserProfileResponse
{
    /// <summary>
    /// El identificador único del usuario cuyo perfil se está obteniendo.
    /// </summary>
    public required Guid Id { get; init; }

    /// <summary>
    /// El nombre del usuario cuyo perfil se está obteniendo.
    /// </summary>
    public required string FirstName { get; init; }

    /// <summary>
    /// El apellido del usuario cuyo perfil se está obteniendo.
    /// </summary>
    public required string LastName { get; init; }

    /// <summary>
    /// La dirección de correo electrónico del usuario cuyo perfil se está obteniendo.
    /// </summary>
    public required string Email { get; init; }

    /// <summary>
    /// El rol del usuario cuyo perfil se está obteniendo, representado como un número entero.
    /// </summary>
    public required int Role { get; init; }
}
