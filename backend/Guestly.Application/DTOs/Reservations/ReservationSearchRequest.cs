using Guestly.Domain.Enums;

namespace Guestly.Application.DTOs.Reservations;

public record ReservationSearchRequest()
{
    /// <summary>
    /// El id de la propiedad para filtrar las reservas. Si se proporciona,
    /// solo se devolverán las reservas asociadas a esta propiedad. Si es null,
    /// se devolverán todas las reservas sin filtrar por propiedad.
    /// </summary>
    public Guid? PropertyId { get; init; }

    /// <summary>
    /// El id del huésped para filtrar las reservas. Si se proporciona, solo se devolverán
    /// las reservas asociadas a este huésped. Si es null, se devolverán todas las reservas sin filtrar por huésped.
    /// </summary>
    public Guid? GuestId { get; init; }

    /// <summary>
    /// El id del anfitrión para filtrar las reservas. Si se proporciona, solo se devolverán
    /// las reservas asociadas a este anfitrión. Si es null, se devolverán todas las reservas sin filtrar por anfitrión.
    /// </summary>
    public Guid? HostId { get; init; }

    /// <summary>
    /// El estado de la reserva para filtrar las reservas. Si se proporciona,
    /// solo se devolverán las reservas que coincidan con este estado. Si es null,
    /// se devolverán todas las reservas sin filtrar por estado.
    /// </summary>
    public ReservationStatus? Status { get; init; }

    /// <summary>
    /// La fecha de inicio para filtrar las reservas. Si se proporciona, solo se devolverán
    /// las reservas que tengan una fecha de inicio igual o posterior a esta fecha. Si es null,
    /// se devolverán todas las reservas sin filtrar por fecha de inicio.
    /// </summary>
    public DateTime? StartDate { get; init; }

    /// <summary>
    /// La fecha de finalización para filtrar las reservas. Si se proporciona, solo se devolverán
    /// las reservas que tengan una fecha de finalización igual o anterior a esta fecha. Si es null,
    /// se devolverán todas las reservas sin filtrar por fecha de finalización.
    /// </summary>
    public DateTime? EndDate { get; init; }
}
