using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Reservations.UpdatePropertyBlock;

/// <summary>
/// Manejador del comando para actualizar un bloque de fechas de una propiedad, que se encarga de
/// validar la existencia del bloque a actualizar, verificar que el anfitrión tenga permisos para modificarlo,
/// comprobar que las nuevas fechas no choquen con reservas existentes ni con otros bloques programados,
/// actualizar el bloque con las nuevas fechas y razón, y devolver la información actualizada del bloque
/// en un objeto de respuesta adaptado a PropertyBlockResponse, utilizando el repositorio de bloques de fechas,
/// el repositorio de propiedades y el repositorio de reservas para realizar las operaciones necesarias en la base de datos.
/// </summary>
public class UpdatePropertyBlockCommandHandler
    : IRequestHandler<UpdatePropertyBlockCommand, PropertyBlockResponse>
{
    private readonly IPropertyBlockRepository _propertyBlockRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IReservationRepository _reservationRepository;

    public UpdatePropertyBlockCommandHandler(
        IPropertyBlockRepository propertyBlockRepository,
        IPropertyRepository propertyRepository,
        IReservationRepository reservationRepository
    )
    {
        _propertyBlockRepository = propertyBlockRepository;
        _propertyRepository = propertyRepository;
        _reservationRepository = reservationRepository;
    }

    /// <summary>
    /// Manejador del comando para actualizar un bloque de fechas de una propiedad
    /// </summary>
    public async Task<PropertyBlockResponse> Handle(
        UpdatePropertyBlockCommand request,
        CancellationToken cancellationToken
    )
    {
        var block = await _propertyBlockRepository.GetByIdAsync(request.BlockId, cancellationToken);
        if (block is null)
        {
            throw AppException.NotFound(
                "El bloqueo de fechas no existe.",
                ErrorCodes.PropertyBlockNotFound
            );
        }

        var property = await _propertyRepository.GetByIdAsync(block.PropertyId, cancellationToken);
        if (property is null || property.HostId != request.HostId)
        {
            throw AppException.Forbidden(
                "No tienes permisos para modificar este bloqueo de fechas.",
                ErrorCodes.PropertyAccessDenied
            );
        }

        var hasReservations = await _reservationRepository.HasOverlappingReservationsAsync(
            block.PropertyId,
            request.StartDate,
            request.EndDate,
            cancellationToken
        );
        if (hasReservations)
        {
            throw AppException.Conflict(
                "Las nuevas fechas chocan con reservas existentes.",
                ErrorCodes.DatesUnavailable
            );
        }

        var hasOtherBlocks = await _propertyBlockRepository.HasOverlappingBlocksAsync(
            block.PropertyId,
            request.StartDate,
            request.EndDate,
            request.BlockId, // Excluimos el bloque actual para permitir ajustes de fechas o cambios de razón sin chocar con su versión anterior.
            cancellationToken
        );

        if (hasOtherBlocks)
        {
            throw AppException.Conflict(
                "Ya existe otro bloqueo programado para estas fechas.",
                ErrorCodes.DatesUnavailable
            );
        }

        block.Update(request.StartDate, request.EndDate, request.Reason);

        _propertyBlockRepository.Update(block);

        return block.Adapt<PropertyBlockResponse>();
    }
}
