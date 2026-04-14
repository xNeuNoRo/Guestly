using Guestly.Application.DTOs.Properties;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Properties.GetByHost;

/// <summary>
/// Manejador para la consulta GetPropertiesByHostQuery, que obtiene las propiedades de un host específico.
/// </summary>
public class GetPropertiesByHostQueryHandler
    : IRequestHandler<GetPropertiesByHostQuery, IEnumerable<PropertyResponse>>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;

    public GetPropertiesByHostQueryHandler(
        IPropertyRepository propertyRepository,
        IUserRepository userRepository
    )
    {
        _propertyRepository = propertyRepository;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Maneja la consulta para obtener las propiedades de un host específico.
    /// Verifica que el host exista y luego obtiene sus propiedades, adaptándolas a PropertyResponse.
    /// </summary>
    public async Task<IEnumerable<PropertyResponse>> Handle(
        GetPropertiesByHostQuery request,
        CancellationToken cancellationToken
    )
    {
        var host = await _userRepository.GetByIdAsync(request.HostId, cancellationToken);
        if (host is null)
        {
            throw AppException.NotFound("Anfitrión no encontrado.", ErrorCodes.UserNotFound);
        }

        var properties = await _propertyRepository.GetByHostIdAsync(
            request.HostId,
            cancellationToken
        );

        return properties.Select(p =>
        {
            var response = p.Adapt<PropertyResponse>();

            return response with
            {
                Host = new HostSummaryResponse
                {
                    HostId = host.Id,
                    HostName = $"{host.FirstName} {host.LastName}",
                },
                AverageRating = p.Reviews.Any()
                    ? Math.Round(p.Reviews.Average(r => r.Rating), 1)
                    : 0.0,
                TotalReviews = p.Reviews.Count,
                ImageUrls = p.Images.ToList(),
            };
        });
    }
}
