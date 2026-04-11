using Guestly.Domain.Entities.Base;
using Guestly.Domain.Entities.Properties;

namespace Guestly.Domain.Entities.Reservations;

/// <summary>
/// Entidad que representa un bloque de fechas para una propiedad,
/// utilizado para marcar fechas en las que la propiedad no está disponible para reservas,
/// ya sea por mantenimiento, ocupación del anfitrión u otras razones.
/// </summary>
public class PropertyBlock : BaseEntity
{
    /// <summary>
    /// Identificador de la propiedad bloqueada, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public Guid PropertyId { get; private set; }

    /// <summary>
    /// Referencia de navegación a la propiedad bloqueada, que es una relación de muchos a uno.
    /// </summary>
    public virtual Property? Property { get; }

    /// <summary>
    /// Fechas de inicio y fin del bloque, que son campos obligatorios y no pueden ser nulos.
    /// La fecha de fin debe ser posterior a la fecha de inicio.
    /// </summary>
    public DateTime StartDate { get; private set; }

    /// <summary>
    /// Fecha de fin del bloque, que es un campo obligatorio y no puede ser nulo. Debe ser posterior a la fecha de inicio.
    /// </summary>
    public DateTime EndDate { get; private set; }

    /// <summary>
    /// Razón opcional para el bloque de fechas, que puede ser utilizada
    /// para describir el motivo por el cual la propiedad está bloqueada en esas fechas
    /// (por ejemplo, mantenimiento, ocupación del anfitrión, etc.). Este campo es opcional y puede ser nulo.
    /// </summary>
    public string? Reason { get; private set; }

    /// <summary>
    /// Constructor público para crear un nuevo bloque de fechas para una propiedad,
    /// que recibe como parámetros el identificador de la propiedad bloqueada,
    /// las fechas de inicio y fin del bloque, y una razón opcional para el bloque de fechas.
    /// </summary>
    /// <param name="propertyId">El identificador de la propiedad bloqueada.</param>
    /// <param name="startDate">La fecha de inicio del bloque.</param>
    /// <param name="endDate">La fecha de fin del bloque.</param>
    /// <param name="reason">La razón opcional para el bloque de fechas.</param>
    public PropertyBlock(
        Guid propertyId,
        DateTime startDate,
        DateTime endDate,
        string? reason = null
    )
    {
        ValidateBlock(startDate, endDate);

        PropertyId = propertyId;
        StartDate = startDate;
        EndDate = endDate;
        Reason = reason;
    }

    /// <summary>
    /// Método privado para validar las fechas del bloque, asegurándose de que la fecha de fin sea posterior a la fecha de inicio.
    /// </summary>
    /// <param name="startDate">La fecha de inicio del bloque.</param>
    /// <param name="endDate">La fecha de fin del bloque.</param>
    /// <exception cref="ArgumentException">Se lanza cuando las fechas del bloque no son válidas.</exception>
    private static void ValidateBlock(DateTime startDate, DateTime endDate)
    {
        if (startDate.Date >= endDate.Date)
            throw new ArgumentException("La fecha de fin debe ser posterior a la fecha de inicio.");
    }

    /// <summary>
    /// Método para verificar si las fechas de este bloque se superponen con las fechas de otra reserva o bloque,
    /// lo que es útil para evitar conflictos de disponibilidad en la misma propiedad.
    /// </summary>
    /// <param name="otherStartDate">La fecha de inicio de la otra reserva o bloque.</param>
    /// <param name="otherEndDate">La fecha de fin de la otra reserva o bloque.</param>
    /// <returns>True si las fechas se superponen, false en caso contrario.</returns>
    public bool OverlapsWith(DateTime otherStartDate, DateTime otherEndDate)
    {
        return StartDate.Date < otherEndDate.Date && EndDate.Date > otherStartDate.Date;
    }
}
