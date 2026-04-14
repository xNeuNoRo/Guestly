using Guestly.Application.DTOs.Properties;
using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Properties;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Properties.CreateProperty;

/// <summary>
/// Manejador del comando CreatePropertyCommand. Este manejador se encarga de procesar la lógica de negocio
/// para crear una nueva propiedad en el sistema. Verifica que el anfitrión exista y tenga los permisos necesarios,
/// sube las imágenes asociadas a la propiedad, guarda la propiedad en la base de datos
/// y finalmente mapea la entidad de la propiedad a un DTO de respuesta que se devuelve al cliente.
/// </summary>
public class CreatePropertyCommandHandler : IRequestHandler<CreatePropertyCommand, PropertyResponse>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;
    private readonly IImageUploadService _imageUploadService;
    private readonly IUnitOfWork _unitOfWork;

    public CreatePropertyCommandHandler(
        IPropertyRepository propertyRepository,
        IUserRepository userRepository,
        IImageUploadService imageUploadService,
        IUnitOfWork unitOfWork
    )
    {
        _propertyRepository = propertyRepository;
        _userRepository = userRepository;
        _imageUploadService = imageUploadService;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Maneja la lógica para crear una nueva propiedad. Verifica que el anfitrión exista y tenga permisos,
    /// sube las imágenes, guarda la propiedad y mapea la respuesta.
    /// </summary>
    public async Task<PropertyResponse> Handle(
        CreatePropertyCommand request,
        CancellationToken cancellationToken
    )
    {
        var host = await _userRepository.GetByIdAsync(request.HostId, cancellationToken);
        if (host is null)
        {
            throw AppException.NotFound("Anfitrión no encontrado.", ErrorCodes.UserNotFound);
        }

        if (!host.Role.HasFlag(UserRoles.Host))
        {
            throw AppException.Forbidden(
                "No tienes permisos de anfitrión para crear una propiedad.",
                ErrorCodes.PropertyAccessDenied
            );
        }

        var property = new Property(
            request.Title,
            request.Description,
            request.Location,
            request.PricePerNight,
            request.CleaningFee,
            request.Capacity,
            request.HostId
        );

        // Subimos las imagenes 1 por 1 y las asociamos a la propiedad
        foreach (var image in request.Images)
        {
            var imageUrl = await _imageUploadService.UploadImageAsync(image, cancellationToken);
            property.AddImage(imageUrl);
        }

        // Guardamos la propiedad en la base de datos
        await _propertyRepository.AddAsync(property, cancellationToken);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // solamente si es que no detecta una transaccion activa
        await _unitOfWork.CommitAsync(cancellationToken);

        // Mapeamos la propiedad a PropertyResponse
        var response = property.Adapt<PropertyResponse>();

        // Completamos la información adicional del anfitrión y las imágenes
        return response with
        {
            Host = new HostSummaryResponse
            {
                HostId = host.Id,
                HostName = $"{host.FirstName} {host.LastName}",
            },
            AverageRating = 0.0,
            TotalReviews = 0,
            ImageUrls = property.Images.ToList(),
        };
    }
}
