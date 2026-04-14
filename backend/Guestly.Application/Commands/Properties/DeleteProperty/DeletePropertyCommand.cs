using MediatR;

namespace Guestly.Application.Commands.Properties.DeleteProperty;

/// <summary>
/// Comando para eliminar una propiedad existente.
/// Este comando requiere el ID de la propiedad a eliminar y el ID del host que intenta realizar la eliminación.
/// </summary>
public record DeletePropertyCommand(Guid PropertyId, Guid HostId) : IRequest<bool>;
