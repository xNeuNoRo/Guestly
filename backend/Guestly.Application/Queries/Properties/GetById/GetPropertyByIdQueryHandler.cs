using Guestly.Application.DTOs.Properties;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Properties.GetById;

/// <summary>
/// Manejador para la consulta GetPropertyByIdQuery, que obtiene una propiedad por su ID.
/// </summary>
public class GetPropertyByIdQueryHandler : IRequestHandler<GetPropertyByIdQuery, PropertyResponse>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;

    public GetPropertyByIdQueryHandler(
        IPropertyRepository propertyRepository,
        IUserRepository userRepository
    )
    {
        _propertyRepository = propertyRepository;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Maneja la consulta para obtener una propiedad por su ID, incluyendo detalles del anfitrión y calificaciones.
    /// </summary>
    public async Task<PropertyResponse> Handle(
        GetPropertyByIdQuery request,
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

        var host = await _userRepository.GetByIdAsync(property.HostId, cancellationToken);
        if (host is null)
        {
            throw AppException.NotFound(
                "No se encontró el anfitrión asociado a esta propiedad.",
                ErrorCodes.UserNotFound
            );
        }

        double averageRating = 0.0;
        int totalReviews = property.Reviews.Count;

        if (totalReviews > 0)
        {
            averageRating = property.Reviews.Average(r => r.Rating);
        }

        var response = property.Adapt<PropertyResponse>();

        return response with
        {
            Host = new HostSummaryResponse
            {
                HostId = host!.Id,
                HostName = $"{host.FirstName} {host.LastName}",
            },
            AverageRating = Math.Round(averageRating, 1), // Redondear a 1 decimal
            TotalReviews = totalReviews,
            ImageUrls = property.Images.ToList(),
        };
    }
}
