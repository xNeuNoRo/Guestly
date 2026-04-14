using Guestly.Application.DTOs.Reservations;
using MediatR;

namespace Guestly.Application.Commands.Reservations.CreateReservation;

/// <summary>
/// Comando para crear una nueva reserva. Este comando encapsula la información necesaria
/// para realizar la operación de creación de una reserva, incluyendo el ID del huésped,
/// el ID de la propiedad, y las fechas de inicio y fin de la reserva.
/// </summary>
public record CreateReservationCommand(
    Guid GuestId,
    Guid PropertyId,
    DateTime StartDate,
    DateTime EndDate
) : IRequest<ReservationResponse>;
