using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Reservations.UpdateReservationStatus;

/// <summary>
/// Manejador del comando UpdateReservationStatusCommand. Este manejador se encarga de procesar la lógica de negocio
/// para actualizar el estado de una reserva, incluyendo la validación de que el usuario que realiza la acción
/// tenga los permisos necesarios (ya sea el huésped o el anfitrión), y la actualización del estado de la reserva en la base de datos.
/// </summary>
public class UpdateReservationStatusCommandHandler
    : IRequestHandler<UpdateReservationStatusCommand, ReservationResponse>
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;

    public UpdateReservationStatusCommandHandler(
        IReservationRepository reservationRepository,
        IPropertyRepository propertyRepository,
        IUserRepository userRepository
    )
    {
        _reservationRepository = reservationRepository;
        _propertyRepository = propertyRepository;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Maneja la lógica para actualizar el estado de una reserva. Esto incluye verificar que la reserva exista,
    /// que el usuario que realiza la acción sea el huésped o el anfitrión de la reserva, y que el nuevo estado
    /// sea válido para la operación. Si todas las validaciones pasan, se actualiza el estado de la reserva y
    /// se guarda en la base de datos, y se devuelve la información actualizada de la reserva en la respuesta.
    /// </summary>
    public async Task<ReservationResponse> Handle(
        UpdateReservationStatusCommand request,
        CancellationToken cancellationToken
    )
    {
        var reservation = await _reservationRepository.GetByIdAsync(
            request.ReservationId,
            cancellationToken
        );
        if (reservation is null)
        {
            throw AppException.NotFound("Reserva no encontrada.", ErrorCodes.ReservationNotFound);
        }

        var property = await _propertyRepository.GetByIdAsync(
            reservation.PropertyId,
            cancellationToken
        );

        bool isHost = property != null && property.HostId == request.UserId;
        bool isGuest = reservation.GuestId == request.UserId;

        if (!isHost && !isGuest)
        {
            throw AppException.Forbidden(
                "No tienes permiso para modificar esta reserva.",
                ErrorCodes.ReservationAccessDenied
            );
        }

        if (request.NewStatus == ReservationStatus.Confirmed)
        {
            if (!isHost)
            {
                throw AppException.Forbidden(
                    "Solo el anfitrión de la propiedad puede confirmar la reserva.",
                    ErrorCodes.ReservationAccessDenied
                );
            }
            reservation.Confirm();
        }
        else if (request.NewStatus == ReservationStatus.Cancelled)
        {
            reservation.Cancel();
        }
        else
        {
            throw AppException.BadRequest(
                "Estado de reserva no válido para esta operación.",
                ErrorCodes.InvalidReservationStatus
            );
        }

        _reservationRepository.Update(reservation);

        var guest = await _userRepository.GetByIdAsync(reservation.GuestId, cancellationToken);
        var host = await _userRepository.GetByIdAsync(property!.HostId, cancellationToken);

        var response = reservation.Adapt<ReservationResponse>();

        return response with
        {
            PropertyTitle = property.Title,
            PropertyLocation = property.Location,
            PropertyThumbnailUrl = property.Images.FirstOrDefault() ?? string.Empty,
            GuestName = $"{guest!.FirstName} {guest.LastName}",
            HostName = $"{host!.FirstName} {host.LastName}",
        };
    }
}
