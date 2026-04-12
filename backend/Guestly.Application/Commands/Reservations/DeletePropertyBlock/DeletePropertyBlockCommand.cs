using MediatR;

namespace Guestly.Application.Commands.Reservations.DeletePropertyBlock;

/// <summary>
/// Comando para eliminar un bloque de fechas de una propiedad, que recibe como parámetros el
/// identificador del bloque a eliminar y el identificador del anfitrión propietario de la
/// propiedad bloqueada, y devuelve un booleano indicando si la eliminación fue exitosa o no.
/// </summary>
public record DeletePropertyBlockCommand(Guid BlockId, Guid HostId) : IRequest<bool>;
