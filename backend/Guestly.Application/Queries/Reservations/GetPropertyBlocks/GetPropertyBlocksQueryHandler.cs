using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Reservations.GetPropertyBlocks;

/// <summary>
/// Manejador para la consulta GetPropertyBlocksQuery, que obtiene los bloqueos de una propiedad específica.
/// </summary>
public class GetPropertyBlocksQueryHandler
    : IRequestHandler<GetPropertyBlocksQuery, IEnumerable<PropertyBlockResponse>>
{
    private readonly IPropertyBlockRepository _propertyBlockRepository;
    private readonly IPropertyRepository _propertyRepository;

    public GetPropertyBlocksQueryHandler(
        IPropertyBlockRepository propertyBlockRepository,
        IPropertyRepository propertyRepository
    )
    {
        _propertyBlockRepository = propertyBlockRepository;
        _propertyRepository = propertyRepository;
    }

    /// <summary>
    /// Maneja la consulta para obtener los bloqueos de una propiedad específica. Verifica que la propiedad exista 
    /// y luego obtiene los bloqueos futuros asociados a esa propiedad, adaptándolos a DTOs de respuesta. 
    /// Si la propiedad no existe, lanza una excepción de tipo NotFound.
    /// </summary>
    public async Task<IEnumerable<PropertyBlockResponse>> Handle(
        GetPropertyBlocksQuery request,
        CancellationToken cancellationToken
    )
    {
        var property = await _propertyRepository.GetByIdAsync(
            request.PropertyId,
            cancellationToken
        );
        if (property is null)
        {
            throw AppException.NotFound("Propiedad no encontrada.", ErrorCodes.PropertyNotFound);
        }

        var blocks = await _propertyBlockRepository.GetUpcomingBlocksByPropertyIdAsync(
            request.PropertyId,
            cancellationToken
        );

        return blocks.Adapt<IEnumerable<PropertyBlockResponse>>();
    }
}
