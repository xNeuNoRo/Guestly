using Guestly.Application.Commands.Properties.Search;
using Guestly.Application.DTOs.Properties;
using Guestly.Application.Interfaces.Repositories;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Properties.Search;

/// <summary>
/// Manejador de la consulta PropertySearchQuery, que se encarga de procesar la solicitud de búsqueda de propiedades
/// y devolver una lista de resultados que cumplen con los criterios de búsqueda especificados en la consulta.
/// </summary>
public class PropertySearchQueryHandler
    : IRequestHandler<PropertySearchQuery, IEnumerable<PropertyResponse>>
{
    private readonly IPropertyRepository _propertyRepository;

    public PropertySearchQueryHandler(IPropertyRepository propertyRepository)
    {
        _propertyRepository = propertyRepository;
    }

    /// <summary>
    /// Manejador del método Handle, que recibe una instancia de PropertySearchQuery con los parámetros de búsqueda,
    /// y utiliza el repositorio de propiedades para realizar la búsqueda en la base de datos.
    /// </summary>
    public async Task<IEnumerable<PropertyResponse>> Handle(
        PropertySearchQuery request,
        CancellationToken cancellationToken
    )
    {
        var properties = await _propertyRepository.SearchAsync(
            request.Location,
            request.StartDate,
            request.EndDate,
            request.Capacity,
            request.MinPrice,
            request.MaxPrice,
            cancellationToken
        );

        var responseList = new List<PropertyResponse>();

        // Para cada propiedad encontrada, se adapta la entidad Property a un DTO PropertyResponse,
        // y se completa con información adicional como el nombre del anfitrión, la calificación
        // promedio y el total de reseñas, y las URLs de las imágenes asociadas a la propiedad.
        foreach (var property in properties)
        {
            var baseResponse = property.Adapt<PropertyResponse>();

            var fullResponse = baseResponse with
            {
                Host = new HostSummaryResponse
                {
                    HostId = property.HostId,
                    HostName = property.Host is null
                        ? "Anfitrión"
                        : $"{property.Host.FirstName} {property.Host.LastName}",
                },
                AverageRating = property.Reviews.Any()
                    ? Math.Round(property.Reviews.Average(r => r.Rating), 1)
                    : 0.0,
                TotalReviews = property.Reviews.Count,
                ImageUrls = property.Images.ToList(),
            };

            responseList.Add(fullResponse);
        }

        return responseList;
    }
}
