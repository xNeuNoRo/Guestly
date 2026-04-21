namespace Guestly.Application.DTOs.Reviews;

/// <summary>
/// Representa la request para actualizar una reseña, incluyendo el comentario y la calificación
/// que el usuario desea establecer como su reseña válida. Esta request se utiliza para modificar
/// una reseña existente, permitiendo al usuario actualizar su opinión sobre un alojamiento
/// después de haberlo calificado previamente.
/// </summary>
public record UpdateReviewRequest
{
    /// <summary>
    /// El comentario actualizado que el usuario desea dejar sobre la propiedad
    /// </summary>
    public required string Comment { get; init; }

    /// <summary>
    /// La calificación actualizada que el usuario desea establecer para la propiedad
    /// </summary>
    public required int Rating { get; init; }
}
