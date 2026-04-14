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
    /// Tarifa de limpieza de la propiedad luego de la reserva, que es un campo opcional.
    /// </summary>
    public decimal CleaningFeeAtBooking { get; private set; }

    /// <summary>
    /// Tarifa de servicio de la propiedad luego de la reserva, que es un campo obligatorio (5% del subtotal).
    /// </summary>
    public decimal ServiceFeeAtBooking { get; private set; }

    /// <summary>
    /// Impuestos de la propiedad luego de la reserva, que es un campo obligatorio (18% de el precio calculado).
    /// </summary>
    public decimal TaxesAtBooking { get; private set; }

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
    /// Constructor privado para Entity Framework, que es necesario para que EF pueda crear instancias de la clase Reservation.
    /// </summary>
    private Reservation() { }

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
        decimal cleaningFee,
        decimal serviceFee,
        decimal taxes,
        DateTime currentTime
    )
    {
        ValidateReservation(propertyPricePerNight, checkInDate, checkOutDate, currentTime);

        PropertyId = propertyId;
        GuestId = guestId;
        CheckInDate = checkInDate.Date;
        CheckOutDate = checkOutDate.Date;
        PricePerNightAtBooking = propertyPricePerNight;
        CleaningFeeAtBooking = cleaningFee;
        ServiceFeeAtBooking = serviceFee;
        TaxesAtBooking = taxes;

        int nights = (checkOutDate.Date - checkInDate.Date).Days;
        TotalPrice = CalculateTotalPrice(
            nights,
            propertyPricePerNight,
            cleaningFee,
            serviceFee,
            taxes
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
    /// <exception cref="DomainException">Se lanza cuando las fechas de la reserva no son válidas.</exception>
    private static void ValidateReservation(
        decimal propertyPricePerNight,
        DateTime checkInDate,
        DateTime checkOutDate,
        DateTime currentTime
    )
    {
        if (propertyPricePerNight <= 0)
        {
            throw new DomainException(
                "El precio por noche de la propiedad debe ser mayor que cero."
            );
        }

        if (checkInDate.Date >= checkOutDate.Date)
        {
            throw new DomainException(
                "La fecha de salida debe ser posterior a la fecha de entrada."
            );
        }

        if (checkInDate.Date < currentTime.Date)
        {
            throw new DomainException(
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
    /// <param name="cleaning">La tarifa de limpieza de la propiedad.</param>
    /// <param name="service">La tarifa de servicio de la propiedad.</param>
    /// <param name="taxes">Los impuestos (ITBIS)</param>
    /// <returns>El precio total de la reserva.</returns>
    private static decimal CalculateTotalPrice(
        int totalDays,
        decimal pricePerNight,
        decimal cleaning,
        decimal service,
        decimal taxes
    )
    {
        return Math.Round((totalDays * pricePerNight) + cleaning + service + taxes, 2);
    }

    // ------------------------------------------------------
    // Metodos de comportamiento (DDD - Domain-Driven Design)
    // ------------------------------------------------------

    /// <summary>
    /// Método para confirmar la reserva, que cambia el estado de la reserva a Confirmed si actualmente está en estado Pending.
    /// </summary>
    /// <exception cref="DomainException">Se lanza cuando se intenta confirmar una reserva que no está en estado Pending.</exception>
    public void Confirm()
    {
        if (Status != ReservationStatus.Pending)
        {
            throw new DomainException($"No se puede confirmar una reserva en estado: {Status}.");
        }
        Status = ReservationStatus.Confirmed;
    }

    /// <summary>
    /// Método para cancelar la reserva, que cambia el estado de la reserva a Cancelled
    /// si actualmente está en estado Pending o Confirmed. No se puede cancelar una reserva que ya está completada o cancelada.
    /// </summary>
    /// <exception cref="DomainException">Se lanza cuando se intenta cancelar una reserva que no está en estado Pending o Confirmed.</exception>
    public void Cancel()
    {
        if (Status == ReservationStatus.Completed || Status == ReservationStatus.Cancelled)
        {
            throw new DomainException($"No se puede cancelar una reserva que ya está {Status}.");
        }

        Status = ReservationStatus.Cancelled;
    }

    /// <summary>
    /// Método para marcar la reserva como completada, que cambia el estado de la reserva a Completed
    /// si actualmente está en estado Confirmed y la fecha actual es posterior a la fecha de salida de la reserva.
    /// No se puede completar una reserva que no esté confirmada o que aún no haya finalizado.
    /// </summary>
    /// <param name="currentTime">La fecha y hora actuales.</param>
    /// <exception cref="DomainException">Se lanza cuando se intenta completar una reserva que no cumple con los criterios.</exception>
    public void Complete(DateTime currentTime)
    {
        if (Status != ReservationStatus.Confirmed)
        {
            throw new DomainException(
                "Solo las reservas confirmadas pueden marcarse como completadas."
            );
        }

        if (currentTime.Date <= CheckOutDate.Date)
        {
            throw new DomainException(
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
