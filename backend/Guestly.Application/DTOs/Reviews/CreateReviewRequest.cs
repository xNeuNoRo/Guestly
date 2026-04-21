namespace Guestly.Application.DTOs.Reviews;

/// <summary>
/// Representa la request para crear una nueva reseña de una propiedad,
/// incluyendo el identificador de la propiedad que se está reseñando,
/// el identificador de la reserva asociada a la reseña, la calificación que el usuario desea otorgar a la propiedad,
/// y el comentario que el usuario desea dejar sobre la propiedad.
/// </summary>
public record CreateReviewRequest()
{
    /// <summary>
    /// El identificador de la propiedad que se está reseñando, utilizado para asociar la reseña con la propiedad correspondiente.
    /// </summary>
    public required Guid PropertyId { get; init; }

    /// <summary>
    /// El identificador de la reserva asociada a la reseña, utilizado para verificar
    /// que el usuario ha realizado una reserva en la propiedad antes de permitirle dejar una reseña.
    /// </summary>
    public required Guid ReservationId { get; init; }

    /// <summary>
    /// La calificación que el usuario desea otorgar a la propiedad, representada como un número entero entre 1 y 5,
    /// utilizada para evaluar la calidad de la propiedad y proporcionar retroalimentación
    /// a otros usuarios sobre su experiencia con la propiedad.
    /// </summary>
    public required int Rating { get; init; }

    /// <summary>
    /// El comentario que el usuario desea dejar sobre la propiedad, utilizado para proporcionar detalles adicionales
    /// sobre su experiencia con la propiedad y ayudar a otros usuarios a tomar decisiones
    /// informadas sobre si reservar o no la propiedad en el futuro.
    /// </summary>
    public required string Comment { get; init; }
}
