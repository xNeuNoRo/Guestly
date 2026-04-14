using Guestly.Application.DTOs.Reservations;
using MediatR;

namespace Guestly.Application.Queries.Reservations.GetPropertyBlocks;

/// <summary>
/// Query para obtener los bloqueos de una propiedad específica.
/// </summary>
public record GetPropertyBlocksQuery(Guid PropertyId)
    : IRequest<IEnumerable<PropertyBlockResponse>>;
