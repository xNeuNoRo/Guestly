using Guestly.Application.DTOs.Properties;
using MediatR;

namespace Guestly.Application.Queries.Properties.GetById;

/// <summary>
/// Query para obtener una propiedad por su ID.
/// </summary>
public record GetPropertyByIdQuery(Guid PropertyId) : IRequest<PropertyResponse>;
