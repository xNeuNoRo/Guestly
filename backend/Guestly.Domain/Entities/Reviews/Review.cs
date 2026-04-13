using Guestly.Domain.Entities.Base;
using Guestly.Domain.Exceptions;

namespace Guestly.Domain.Entities.Reviews;

public class Review : BaseEntity
{
    /// <summary>
    /// Identificador de la propiedad que se está reseñando, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public Guid PropertyId { get; private set; }

    /// <summary>
    /// Identificador de la reserva asociada a la reseña, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public Guid ReservationId { get; private set; }

    /// <summary>
    /// Identificador del huésped que hizo la reseña, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public Guid GuestId { get; private set; }

    /// <summary>
    /// Calificación de la propiedad, que es un campo obligatorio y debe ser un número entero entre 1 y 5.
    /// </summary>
    public int Rating { get; private set; }

    /// <summary>
    /// Comentario de la reseña, que es un campo obligatorio y no puede estar vacío.
    /// </summary>
    public string Comment { get; private set; } = null!;

    /// <summary>
    /// Constructor privado para Entity Framework, que es necesario para que EF pueda crear instancias de la clase Review.
    /// </summary>
    private Review() { }

    /// <summary>
    /// Constructor público para crear una nueva reseña, que recibe como parámetros el
    /// identificador de la propiedad reseñada, el identificador de la reserva asociada
    /// a la reseña, el identificador del huésped que hizo la reseña, la calificación de
    /// la propiedad, el comentario de la reseña y la fecha y hora actuales.
    /// </summary>
    /// <param name="propertyId">ID de la propiedad</param>
    /// <param name="reservationId">ID de la reserva</param>
    /// <param name="guestId">ID del huésped</param>
    /// <param name="rating">Calificación de la propiedad</param>
    /// <param name="comment">Comentario de la reseña</param>
    public Review(Guid propertyId, Guid reservationId, Guid guestId, int rating, string comment)
    {
        ValidateReview(rating, comment);

        PropertyId = propertyId;
        ReservationId = reservationId;
        GuestId = guestId;
        Rating = rating;
        Comment = comment;
    }

    /// <summary>
    /// Método para actualizar los detalles de la reseña, que actualiza la calificación y el comentario de
    /// la reseña con los nuevos valores proporcionados.
    /// </summary>
    /// <param name="rating">Nueva calificación de la propiedad</param>
    /// <param name="comment">Nuevo comentario de la reseña</param>
    public void UpdateDetails(int rating, string comment)
    {
        ValidateReview(rating, comment);

        Rating = rating;
        Comment = comment;
    }

    /// <summary>
    /// Método privado para validar los datos de la reseña,
    /// que verifica que la calificación sea un número entero entre 1 y 5 y que el comentario no esté vacío
    /// </summary>
    /// <param name="rating">Calificación de la propiedad</param>
    /// <param name="comment">Comentario de la reseña</param>
    /// <exception cref="DomainException">Excepción de validación</exception>
    private static void ValidateReview(int rating, string comment)
    {
        if (rating < 1 || rating > 5)
        {
            throw new DomainException("La calificación debe ser un número entero entre 1 y 5.");
        }

        if (string.IsNullOrWhiteSpace(comment))
        {
            throw new DomainException("El comentario no puede estar vacío.");
        }
    }
}
