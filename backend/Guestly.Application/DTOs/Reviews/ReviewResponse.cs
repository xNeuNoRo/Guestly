namespace Guestly.Application.DTOs.Reviews;

/// <summary>
/// Representa la respuesta de una operación relacionada con las reseñas, como la creación o actualización de una reseña.
/// </summary>
public record ReviewResponse()
{
    /// <summary>
    /// El identificador único de la reseña
    /// </summary>
    public required Guid Id { get; init; }

    /// <summary>
    /// La calificación otorgada por el usuario a la propiedad, representada como un número entero entre 1 y 5.
    /// </summary>
    public required int Rating { get; init; }

    /// <summary>
    /// El comentario dejado por el usuario sobre la propiedad
    /// </summary>
    public required string Comment { get; init; }

    /// <summary>
    /// La fecha y hora en que se creó la reseña
    /// </summary>
    public required DateTime CreatedAt { get; init; }

    /// <summary>
    /// La fecha y hora en que se actualizó la reseña
    /// </summary>
    public required DateTime UpdatedAt { get; init; }

    /// <summary>
    /// El identificador único del huésped que dejó la reseña
    /// </summary>
    public required Guid GuestId { get; init; }

    /// <summary>
    /// El nombre completo del huésped que dejó la reseña
    /// </summary>
    public required string GuestFullName { get; init; }
}
