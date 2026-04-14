using Guestly.Application.DTOs.Reservations;
using Guestly.Domain.Enums;
using MediatR;

namespace Guestly.Application.Commands.Reservations.UpdateReservationStatus;

/// <summary>
/// Comando para actualizar el estado de una reserva. Este comando encapsula la información necesaria
/// para realizar la operación de actualización del estado de una reserva, incluyendo el ID de la reserva
/// que se desea actualizar, el ID del usuario que realiza la acción (puede ser el huésped o el anfitrión),
/// y el nuevo estado que se desea asignar a la reserva.
/// </summary>
public record UpdateReservationStatusCommand(
    Guid ReservationId,
    Guid UserId,
    ReservationStatus NewStatus
) : IRequest<ReservationResponse>;
