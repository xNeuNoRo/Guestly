namespace Guestly.Application.DTOs.Users;

/// <summary>
/// Representa la request para actualizar el perfil de un usuario,
/// incluyendo el nombre y apellido del usuario que desea actualizar su perfil.
/// </summary>
public record UpdateUserProfileRequest
{
    /// <summary>
    /// El nombre del usuario que desea actualizar su perfil,
    /// utilizado para identificar al usuario y actualizar su información de perfil en el sistema.
    /// </summary>
    /// <example>Angel</example>
    public required string FirstName { get; init; }

    /// <summary>
    /// El apellido del usuario que desea actualizar su perfil,
    /// utilizado para identificar al usuario y actualizar su información de perfil en el sistema.
    /// </summary>
    /// <example>Gonzalez</example>
    public required string LastName { get; init; }
}
