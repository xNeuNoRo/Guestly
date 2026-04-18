using System.Security.Claims;
using Guestly.API.Controllers.Base;
using Guestly.Application.Commands.Properties.CreateProperty;
using Guestly.Application.Commands.Properties.DeleteProperty;
using Guestly.Application.Commands.Properties.UpdateProperty;
using Guestly.Application.DTOs.Properties;
using Guestly.Application.Queries.Properties.GetAvailability;
using Guestly.Application.Queries.Properties.GetByHost;
using Guestly.Application.Queries.Properties.GetById;
using Guestly.Application.Queries.Properties.Search;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Guestly.API.Controllers;

/// <summary>
/// Controlador encargado de gestionar las propiedades (alojamientos).
/// Permite a los Hosts crear y administrar sus propiedades, y a cualquier usuario buscarlas y ver su disponibilidad.
/// </summary>
[Authorize] // Los endpoints requieren autenticación por defecto, salvo los marcados explícitamente
public class PropertiesController : BaseApiController
{
    private readonly IMediator _mediator;

    public PropertiesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Extrae el ID del usuario directamente desde los claims del token JWT.
    /// </summary>
    private Guid GetUserId()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : Guid.Empty;
    }

    /// <summary>
    /// Busca propiedades basándose en filtros como ubicación, fechas, cantidad de huéspedes y precio.
    /// </summary>
    [AllowAnonymous] // Permite acceso sin autenticación para que cualquier usuario pueda buscar propiedades
    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] PropertySearchRequest request)
    {
        var query = new PropertySearchQuery(
            request.Location,
            request.StartDate,
            request.EndDate,
            request.Capacity,
            request.MinPrice,
            request.MaxPrice
        );

        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Obtiene los detalles de una propiedad específica por su ID.
    /// </summary>
    [AllowAnonymous] // Permite acceso sin autenticación para que cualquier usuario pueda ver los detalles de una propiedad
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetPropertyByIdQuery(id);
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Obtiene las fechas bloqueadas o reservadas de una propiedad (Disponibilidad).
    /// </summary>
    [AllowAnonymous] // Permite acceso sin autenticación para que cualquier usuario pueda verificar la disponibilidad de una propiedad
    [HttpGet("{id:guid}/availability")]
    public async Task<IActionResult> GetAvailability(
        Guid id,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate
    )
    {
        var query = new GetPropertyAvailabilityQuery(id, startDate, endDate);
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Permite a un Host obtener la lista de todas las propiedades que ha publicado.
    /// </summary>
    [Authorize(Roles = "Host")] // Solo los usuarios con rol de Host pueden acceder a este endpoint para ver sus propias propiedades
    [HttpGet("host")]
    public async Task<IActionResult> GetByHost()
    {
        var query = new GetPropertiesByHostQuery(GetUserId());
        var result = await _mediator.Send(query);
        return Success(result);
    }

    /// <summary>
    /// Crea una nueva propiedad. Requiere rol de Host y se envían los datos como multipart/form-data.
    /// </summary>
    [Authorize(Roles = "Host")] // Solo los usuarios con rol de Host pueden crear propiedades, y se utiliza multipart/form-data para manejar la carga de imágenes junto con los datos de la propiedad
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] CreatePropertyRequest request)
    {
        var command = new CreatePropertyCommand(
            GetUserId(),
            request.Title,
            request.Description,
            request.Location,
            request.PricePerNight,
            request.CleaningFee,
            request.Capacity,
            request.Images
        );

        var result = await _mediator.Send(command);

        // Usamos CreatedSuccess para devolver un 201 Created y el header "Location"
        return CreatedSuccess(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Actualiza una propiedad existente. Solo el Host propietario puede hacerlo.
    /// Se envían los datos como multipart/form-data debido al manejo de imágenes.
    /// </summary>
    [Authorize(Roles = "Host")] // Solo los usuarios con rol de Host pueden actualizar propiedades, y se utiliza multipart/form-data para manejar la carga de imágenes junto con los datos de la propiedad
    [HttpPut("{id:guid}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdatePropertyRequest request)
    {
        var command = new UpdatePropertyCommand(
            id,
            GetUserId(),
            request.Title,
            request.Description,
            request.Location,
            request.PricePerNight,
            request.CleaningFee,
            request.Capacity,
            request.Images,
            request.ImagesToDelete
        );

        var result = await _mediator.Send(command);
        return Success(result);
    }

    /// <summary>
    /// Elimina una propiedad. Solo el Host propietario puede hacerlo.
    /// </summary>
    [Authorize(Roles = "Host")] // Solo los usuarios con rol de Host pueden eliminar propiedades, y solo podrán eliminar las propiedades que ellos mismos hayan creado
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeletePropertyCommand(id, GetUserId());
        await _mediator.Send(command);
        return Success();
    }
}
