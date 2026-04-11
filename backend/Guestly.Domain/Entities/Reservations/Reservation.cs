using Guestly.Domain.Entities.Base;
using Guestly.Domain.Entities.Properties;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;

namespace Guestly.Domain.Entities.Reservations;

/// <summary>
/// Entidad que representa una reserva en la aplicación, con propiedades como el identificador de la propiedad reservada,
/// el identificador del huésped que hizo la reserva, las fechas de entrada y salida, el precio total de la reserva y el estado de la reserva (pendiente, confirmada, cancelada o completada). Además, incluye métodos de comportamiento para confirmar, cancelar y completar la reserva, así como para verificar si las fechas de la reserva se superponen con otras reservas.
/// </summary>
public class Reservation : BaseEntity
{
    /// <summary>
    /// Identificador de la propiedad reservada, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public Guid PropertyId { get; private set; }

    /// <summary>
    /// Referencia de navegación a la propiedad reservada, que es una relación de muchos a uno.
    /// </summary>
    public virtual Property? Property { get; }

    /// <summary>
    /// Identificador del huésped que hizo la reserva, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public Guid GuestId { get; private set; }

    /// <summary>
    /// Referencia de navegación al usuario huésped que hizo la reserva, que es una relación de muchos a uno.
    /// </summary>
    public virtual User.User? Guest { get; }

    /// <summary>
    /// Fechas de entrada y salida de la reserva, que son campos obligatorios y no pueden ser nulos.
    /// </summary>
    public DateTime CheckInDate { get; private set; }

    /// <summary>
    /// Fecha de salida de la reserva, que es un campo obligatorio y no puede ser nulo. Debe ser posterior a la fecha de entrada.
    /// </summary>
    public DateTime CheckOutDate { get; private set; }

    /// <summary>
    /// Precio por noche de la propiedad al momento de la reserva, que es un campo obligatorio y debe ser mayor que cero.
    /// </summary>
    public decimal PricePerNightAtBooking { get; private set; }

    /// <summary>
    /// Precio total de la reserva, que es un campo obligatorio y debe ser mayor que cero.
    /// Se calcula multiplicando el número de noches por el precio por noche de la propiedad reservada.
    /// </summary>
    public decimal TotalPrice { get; private set; }

    /// <summary>
    /// Estado de la reserva, definido por la enumeración ReservationStatus,
    /// que indica si la reserva está pendiente, confirmada, cancelada o completada.
    /// </summary>
    public ReservationStatus Status { get; private set; }

    /// <summary>
    /// Constructor público para crear una nueva reserva,
    /// que recibe como parámetros el identificador de la propiedad reservada, el
    /// identificador del huésped, las fechas de entrada y salida, el precio por noche de la propiedad
    /// y la fecha actual para validar que las fechas de la reserva sean válidas.
    /// </summary>
    /// <param name="propertyId">El identificador de la propiedad reservada.</param>
    /// <param name="guestId">El identificador del huésped que hizo la reserva.</param>
    /// <param name="checkInDate">La fecha de entrada a la propiedad.</param>
    /// <param name="checkOutDate">La fecha de salida de la propiedad.</param>
    /// <param name="propertyPricePerNight">El precio por noche de la propiedad.</param>
    /// <param name="currentTime">La fecha y hora actuales.</param>
    public Reservation(
        Guid propertyId,
        Guid guestId,
        DateTime checkInDate,
        DateTime checkOutDate,
        decimal propertyPricePerNight,
        DateTime currentTime
    )
    {
        ValidateReservation(checkInDate, checkOutDate, currentTime);

        PropertyId = propertyId;
        GuestId = guestId;
        CheckInDate = checkInDate.Date;
        CheckOutDate = checkOutDate.Date;
        PricePerNightAtBooking = propertyPricePerNight;
        TotalPrice = CalculateTotalPrice(
            (checkOutDate.Date - checkInDate.Date).Days,
            propertyPricePerNight
        );
        Status = ReservationStatus.Pending;
    }

    /// <summary>
    /// Método privado para validar las fechas de la reserva, asegurándose de que la
    /// fecha de salida sea posterior a la fecha de entrada y que la fecha de entrada no sea anterior a la fecha actual.
    /// </summary>
    /// <param name="checkInDate">La fecha de entrada a la propiedad.</param>
    /// <param name="checkOutDate">La fecha de salida de la propiedad.</param>
    /// <param name="currentTime">La fecha y hora actuales.</param>
    /// <exception cref="ArgumentException">Se lanza cuando las fechas de la reserva no son válidas.</exception>
    private static void ValidateReservation(
        DateTime checkInDate,
        DateTime checkOutDate,
        DateTime currentTime
    )
    {
        if (checkInDate.Date >= checkOutDate.Date)
        {
            throw new AppException(
                ErrorCodes.ValidationError,
                400,
                "La fecha de salida debe ser posterior a la fecha de entrada."
            );
        }

        if (checkInDate.Date < currentTime.Date)
        {
            throw new AppException(
                ErrorCodes.ValidationError,
                400,
                "La fecha de entrada no puede ser anterior a la fecha actual."
            );
        }
    }

    /// <summary>
    /// Método privado para calcular el precio total de la reserva, multiplicando el número
    /// de noches por el precio por noche de la propiedad reservada.
    /// </summary>
    /// <param name="totalDays">El número de días de la reserva.</param>
    /// <param name="pricePerNight">El precio por noche de la propiedad.</param>
    /// <returns>El precio total de la reserva.</returns>
    private static decimal CalculateTotalPrice(int totalDays, decimal pricePerNight)
    {
        return totalDays * pricePerNight;
    }

    // ------------------------------------------------------
    // Metodos de comportamiento (DDD - Domain-Driven Design)
    // ------------------------------------------------------

    /// <summary>
    /// Método para confirmar la reserva, que cambia el estado de la reserva a Confirmed si actualmente está en estado Pending.
    /// </summary>
    /// <exception cref="InvalidOperationException">Se lanza cuando se intenta confirmar una reserva que no está en estado Pending.</exception>
    public void Confirm()
    {
        if (Status != ReservationStatus.Pending)
        {
            throw new AppException(
                ErrorCodes.ValidationError,
                400,
                $"No se puede confirmar una reserva en estado: {Status}."
            );
        }
        Status = ReservationStatus.Confirmed;
    }

    /// <summary>
    /// Método para cancelar la reserva, que cambia el estado de la reserva a Cancelled
    /// si actualmente está en estado Pending o Confirmed. No se puede cancelar una reserva que ya está completada o cancelada.
    /// </summary>
    /// <exception cref="InvalidOperationException">Se lanza cuando se intenta cancelar una reserva que no está en estado Pending o Confirmed.</exception>
    public void Cancel()
    {
        if (Status == ReservationStatus.Completed || Status == ReservationStatus.Cancelled)
        {
            throw new AppException(
                ErrorCodes.ValidationError,
                400,
                $"No se puede cancelar una reserva que ya está {Status}."
            );
        }

        Status = ReservationStatus.Cancelled;
    }

    /// <summary>
    /// Método para marcar la reserva como completada, que cambia el estado de la reserva a Completed
    /// si actualmente está en estado Confirmed y la fecha actual es posterior a la fecha de salida de la reserva.
    /// No se puede completar una reserva que no esté confirmada o que aún no haya finalizado.
    /// </summary>
    /// <param name="currentTime"></param>
    /// <exception cref="InvalidOperationException"></exception>
    public void Complete(DateTime currentTime)
    {
        if (Status != ReservationStatus.Confirmed)
        {
            throw new AppException(
                ErrorCodes.ValidationError,
                400,
                "Solo las reservas confirmadas pueden marcarse como completadas."
            );
        }

        if (currentTime.Date <= CheckOutDate.Date)
        {
            throw new AppException(
                ErrorCodes.ValidationError,
                400,
                "La reserva aún no ha finalizado, no se puede marcar como completada."
            );
        }

        Status = ReservationStatus.Completed;
    }

    /// <summary>
    /// Método para verificar si las fechas de esta reserva se superponen con las fechas de otra reserva,
    /// lo que es útil para evitar conflictos de reservas en la misma propiedad.
    /// </summary>
    /// <param name="otherCheckIn">La fecha de entrada de la otra reserva.</param>
    /// <param name="otherCheckOut">La fecha de salida de la otra reserva.</param>
    /// <returns>true si las reservas se superponen; de lo contrario, false.</returns>
    public bool OverlapsWith(DateTime otherCheckIn, DateTime otherCheckOut)
    {
        // Ejemplo de superposición de reservas:
        // Reserva A: 10-15 de junio
        // Reserva B: 12-18 de junio => Se superponen (12-15 de junio)
        // Reserva C: 16-20 de junio => No se superponen
        return CheckInDate.Date < otherCheckOut.Date && otherCheckIn.Date < CheckOutDate.Date;
    }
}
