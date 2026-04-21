using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Reservations;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Reservations.CreatePropertyBlock;

/// <summary>
/// Manejador para el comando CreatePropertyBlockCommand. Este manejador se encarga de procesar la lógica
/// para crear un bloque de propiedad, asegurándose de que la propiedad exista, que el host tenga permisos,
/// y que no haya reservas o bloqueos superpuestos en las fechas especificadas.
/// </summary>
public class CreatePropertyBlockCommandHandler
    : IRequestHandler<CreatePropertyBlockCommand, PropertyBlockResponse>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IReservationRepository _reservationRepository;
    private readonly IPropertyBlockRepository _propertyBlockRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreatePropertyBlockCommandHandler(
        IPropertyRepository propertyRepository,
        IReservationRepository reservationRepository,
        IPropertyBlockRepository propertyBlockRepository,
        IUnitOfWork unitOfWork
    )
    {
        _propertyRepository = propertyRepository;
        _reservationRepository = reservationRepository;
        _propertyBlockRepository = propertyBlockRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Maneja la creación de un bloque de propiedad. Verifica que la propiedad exista, que el host tenga permisos,
    /// y que no haya reservas o bloqueos superpuestos antes de crear el bloque.
    /// </summary>
    public async Task<PropertyBlockResponse> Handle(
        CreatePropertyBlockCommand request,
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

        if (property.HostId != request.HostId)
        {
            throw AppException.Forbidden(
                "No tienes permisos para bloquear fechas en esta propiedad.",
                ErrorCodes.PropertyAccessDenied
            );
        }

        var hasReservations = await _reservationRepository.HasOverlappingReservationsAsync(
            request.PropertyId,
            request.StartDate,
            request.EndDate,
            cancellationToken
        );

        if (hasReservations)
        {
            throw AppException.Conflict(
                "No puedes bloquear estas fechas porque ya existen reservas en ese período.",
                ErrorCodes.DatesUnavailable
            );
        }

        var hasBlocks = await _propertyBlockRepository.HasOverlappingBlocksAsync(
            request.PropertyId,
            request.StartDate,
            request.EndDate,
            null,
            cancellationToken
        );

        if (hasBlocks)
        {
            throw AppException.Conflict(
                "Ya existe un bloqueo programado en estas fechas.",
                ErrorCodes.DatesUnavailable
            );
        }

        var block = new PropertyBlock(
            request.PropertyId,
            request.StartDate,
            request.EndDate,
            request.Reason
        );

        await _propertyBlockRepository.AddAsync(block, cancellationToken);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // siempre, de esa siempre se persisten los cambios.
        await _unitOfWork.CommitAsync(cancellationToken);

        return block.Adapt<PropertyBlockResponse>();
    }
}
