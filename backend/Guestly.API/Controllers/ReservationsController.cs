using System.Security.Claims;
using Guestly.API.Controllers.Base;
using Guestly.Application.Commands.Reservations.CreatePropertyBlock;
using Guestly.Application.Commands.Reservations.CreateReservation;
using Guestly.Application.Commands.Reservations.DeletePropertyBlock;
using Guestly.Application.Commands.Reservations.UpdatePropertyBlock;
using Guestly.Application.Commands.Reservations.UpdateReservationStatus;
using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Queries.Reservations.GetById;
using Guestly.Application.Queries.Reservations.GetPricePreview;
using Guestly.Application.Queries.Reservations.GetPropertyBlocks;
using Guestly.Application.Queries.Reservations.Search;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Guestly.API.Controllers;

/// <summary>
/// Controlador encargado de gestionar el ciclo de vida de las reservas y los bloqueos de disponibilidad.
/// </summary>
[Authorize]
public class ReservationsController : BaseApiController
{
    private readonly IMediator _mediator;

    public ReservationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : Guid.Empty;
    }

    /// <summary>
    /// Crea una nueva solicitud de reserva para una propiedad.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest request)
    {
        var command = new CreateReservationCommand(
            GetUserId(),
            request.PropertyId,
            request.StartDate,
            request.EndDate
        );

        var result = await _mediator.Send(command);
        return CreatedSuccess(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Obtiene el detalle de una reserva específica por su ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetReservationByIdQuery(id, GetUserId());
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Busca y filtra reservas según el rol del usuario (Huésped, Anfitrión o Propiedad).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] ReservationSearchRequest request)
    {
        var query = new ReservationSearchQuery(
            request.PropertyId,
            request.GuestId,
            request.HostId,
            request.Status,
            request.StartDate,
            request.EndDate
        );

        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Obtiene una previsualización del desglose de precios (noches, tasas, limpieza) antes de reservar.
    /// </summary>
    [HttpGet("price-preview")]
    public async Task<IActionResult> GetPricePreview(
        [FromQuery] Guid propertyId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate
    )
    {
        var query = new GetReservationPricePreviewQuery(propertyId, startDate, endDate);
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Actualiza el estado de una reserva (Confirmar o Cancelar).
    /// Solo el Anfitrión puede confirmar; ambos pueden cancelar bajo ciertas reglas.
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] UpdateReservationStatusRequest request
    )
    {
        var command = new UpdateReservationStatusCommand(id, GetUserId(), request.NewStatus);

        var result = await _mediator.Send(command);
        return Success(result);
    }

    /// <summary>
    /// Permite a un Anfitrión bloquear fechas manualmente en una de sus propiedades.
    /// </summary>
    [Authorize(Roles = "Host")]
    [HttpPost("properties/{propertyId:guid}/blocks")]
    public async Task<IActionResult> CreateBlock(
        Guid propertyId,
        [FromBody] CreatePropertyBlockRequest request
    )
    {
        var command = new CreatePropertyBlockCommand(
            GetUserId(),
            propertyId,
            request.StartDate,
            request.EndDate,
            request.Reason
        );

        var result = await _mediator.Send(command);
        return Success(result);
    }

    /// <summary>
    /// Obtiene todos los bloques de fechas establecidos para una propiedad específica.
    /// </summary>
    [HttpGet("properties/{propertyId:guid}/blocks")]
    public async Task<IActionResult> GetBlocks(Guid propertyId)
    {
        var query = new GetPropertyBlocksQuery(propertyId);
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Actualiza un bloqueo de fechas existente. Solo el Host propietario puede realizarlo.
    /// </summary>
    [Authorize(Roles = "Host")]
    [HttpPut("blocks/{id:guid}")]
    public async Task<IActionResult> UpdateBlock(
        Guid id,
        [FromBody] UpdatePropertyBlockRequest request
    )
    {
        var command = new UpdatePropertyBlockCommand(
            id,
            GetUserId(),
            request.StartDate,
            request.EndDate,
            request.Reason
        );

        var result = await _mediator.Send(command);
        return Success(result);
    }

    /// <summary>
    /// Elimina un bloqueo de fechas para volver a habilitar la disponibilidad.
    /// </summary>
    [Authorize(Roles = "Host")]
    [HttpDelete("blocks/{id:guid}")]
    public async Task<IActionResult> DeleteBlock(Guid id)
    {
        var command = new DeletePropertyBlockCommand(id, GetUserId());
        await _mediator.Send(command);
        return Success();
    }
}
