using Guestly.Application.DTOs.Properties;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Guestly.Application.Commands.Properties.CreateProperty;

/// <summary>
/// Comando para crear una nueva propiedad. Contiene toda la información necesaria
/// para registrar una propiedad en el sistema, incluyendo detalles como el título,
/// descripción, ubicación, precio por noche, capacidad y las imágenes asociadas a la propiedad.
/// </summary>
public record CreatePropertyCommand(
    Guid HostId,
    string Title,
    string Description,
    string Location,
    decimal PricePerNight,
    int Capacity,
    List<IFormFile> Images
) : IRequest<PropertyResponse>;
