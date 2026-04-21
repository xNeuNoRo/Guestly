namespace Guestly.Application.DTOs.Users;

public record PublicProfileResponse()
{
    /// <summary>
    /// El identificador del usuario.
    /// </summary>
    public required Guid Id { get; init; }

    /// <summary>
    /// El nombre del usuario.
    /// </summary>
    public required string FirstName { get; init; }

    /// <summary>
    /// El apellido del usuario.
    /// </summary>
    public required string LastName { get; init; }

    /// <summary>
    /// La fecha de creación del usuario.
    /// </summary>
    public required DateTime CreatedAt { get; init; }
}
