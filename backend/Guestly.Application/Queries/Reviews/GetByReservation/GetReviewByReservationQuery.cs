using Guestly.Application.DTOs.Reviews;
using MediatR;

namespace Guestly.Application.Queries.Reviews.GetByReservation;

/// <summary>
/// Query para obtener la reseña asociada a una reserva específica, identificado por su ReservationId.
/// </summary>
public record GetReviewByReservationQuery(Guid ReservationId) : IRequest<ReviewResponse>;
