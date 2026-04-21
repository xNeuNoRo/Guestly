using System.Security.Claims;
using Guestly.API.Controllers.Base;
using Guestly.Application.Commands.Reviews.CreateReview;
using Guestly.Application.Commands.Reviews.DeleteReview;
using Guestly.Application.Commands.Reviews.UpdateReview;
using Guestly.Application.DTOs.Reviews;
using Guestly.Application.Queries.Reviews.GetById;
using Guestly.Application.Queries.Reviews.GetByProperty;
using Guestly.Application.Queries.Reviews.GetByReservation;
using Guestly.Application.Queries.Reviews.GetByUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Guestly.API.Controllers;

/// <summary>
/// Controlador encargado de gestionar las reseñas y calificaciones de las propiedades.
/// </summary>
[Authorize]
public class ReviewsController : BaseApiController
{
    private readonly IMediator _mediator;

    public ReviewsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : Guid.Empty;
    }

    /// <summary>
    /// Crea una nueva reseña para una reserva completada.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequest request)
    {
        var command = new CreateReviewCommand(
            GetUserId(),
            request.PropertyId,
            request.ReservationId,
            request.Rating,
            request.Comment
        );

        var result = await _mediator.Send(command);
        return CreatedSuccess(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Actualiza una reseña existente. Solo el autor original puede modificarla.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateReviewRequest request)
    {
        var command = new UpdateReviewCommand(id, GetUserId(), request.Rating, request.Comment);

        var result = await _mediator.Send(command);
        return Success(result);
    }

    /// <summary>
    /// Elimina una reseña existente. Solo el autor original puede borrarla.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeleteReviewCommand(id, GetUserId());
        await _mediator.Send(command);
        return Success();
    }

    /// <summary>
    /// Obtiene el detalle de una reseña específica por su ID.
    /// </summary>
    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetReviewByIdQuery(id);
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Obtiene una reseña específica por su ID de reserva.
    /// </summary>
    [HttpGet("reservations/{reservationId:guid}")]
    public async Task<IActionResult> GetByReservation(Guid reservationId)
    {
        var query = new GetReviewByReservationQuery(reservationId);
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Obtiene todas las reseñas asociadas a una propiedad específica.
    /// </summary>
    [AllowAnonymous]
    [HttpGet("properties/{propertyId:guid}")]
    public async Task<IActionResult> GetByProperty(Guid propertyId)
    {
        var query = new GetReviewsByPropertyQuery(propertyId);
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Obtiene todas las reseñas escritas por un usuario específico.
    /// </summary>
    [AllowAnonymous]
    [HttpGet("users/{userId:guid}")]
    public async Task<IActionResult> GetByUser(Guid userId)
    {
        var query = new GetReviewsByUserQuery(userId);
        var result = await _mediator.Send(query);
        return Success(result);
    }
}
