using Guestly.Application.DTOs.Properties;
using MediatR;

namespace Guestly.Application.Queries.Properties.GetByHost;

/// <summary>
/// Query para obtener las propiedades de un host específico.
/// </summary>
public record GetPropertiesByHostQuery(Guid HostId) : IRequest<IEnumerable<PropertyResponse>>;
