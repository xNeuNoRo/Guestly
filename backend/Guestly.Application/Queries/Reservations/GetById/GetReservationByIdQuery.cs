using Guestly.Application.DTOs.Reservations;
using MediatR;

namespace Guestly.Application.Queries.Reservations.GetById;

/// <summary>
/// Query para obtener los detalles de una reserva específica por su ID. Este query requiere el ID de la reserva
/// y el ID del usuario que realiza la consulta (que puede ser el huésped o el anfitrión), para validar que el usuario
/// tenga permisos para acceder a la información de la reserva. La respuesta incluye los detalles de la reserva, así como
/// información adicional de la propiedad, huésped y anfitrión relacionada con la reserva, adaptada a un objeto ReservationResponse.
/// </summary>
public record GetReservationByIdQuery(Guid ReservationId, Guid UserId)
    : IRequest<ReservationResponse>;
