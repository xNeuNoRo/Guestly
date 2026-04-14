using Guestly.Application.DTOs.Reservations;
using MediatR;

namespace Guestly.Application.Commands.Reservations.UpdatePropertyBlock;

/// <summary>
/// Comando para actualizar un bloque de fechas de una propiedad, que recibe como parámetros
/// el identificador del bloque a actualizar, el identificador del anfitrión propietario de la
/// propiedad bloqueada, las nuevas fechas de inicio y fin del bloque, y una nueva razón opcional para el bloque de fechas.
/// </summary>
public record UpdatePropertyBlockCommand(
    Guid BlockId,
    Guid HostId,
    DateTime StartDate,
    DateTime EndDate,
    string? Reason
) : IRequest<PropertyBlockResponse>;
