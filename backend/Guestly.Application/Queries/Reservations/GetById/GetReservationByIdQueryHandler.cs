using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Reservations.GetById;

/// <summary>
/// Manejador del query GetReservationByIdQuery. Este manejador se encarga de procesar la lógica de negocio
/// para obtener los detalles de una reserva específica por su ID, validando que el usuario que realiza
/// la consulta (que puede ser el huésped o el anfitrión) tenga permisos para acceder a la información de la reserva.
/// </summary>
public class GetReservationByIdQueryHandler
    : IRequestHandler<GetReservationByIdQuery, ReservationResponse>
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;

    public GetReservationByIdQueryHandler(
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
    /// Maneja la lógica para obtener los detalles de una reserva específica por su ID, validando que el usuario que realiza
    /// la consulta (que puede ser el huésped o el anfitrión) tenga permisos para acceder a la información de la reserva.
    /// </summary>
    public async Task<ReservationResponse> Handle(
        GetReservationByIdQuery request,
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
        if (property is null)
        {
            throw AppException.NotFound(
                "La propiedad asociada a esta reserva no existe.",
                ErrorCodes.PropertyNotFound
            );
        }

        bool isHost = property != null && property.HostId == request.UserId;
        bool isGuest = reservation.GuestId == request.UserId;

        if (!isHost && !isGuest)
        {
            throw AppException.Forbidden(
                "No tienes permiso para ver esta reserva.",
                ErrorCodes.ReservationAccessDenied
            );
        }

        var guestUser = await _userRepository.GetByIdAsync(reservation.GuestId, cancellationToken);
        var hostUser = await _userRepository.GetByIdAsync(property!.HostId, cancellationToken);

        var response = reservation.Adapt<ReservationResponse>();

        return response with
        {
            PropertyTitle = property.Title,
            PropertyLocation = property.Location,
            PropertyThumbnailUrl = property.Images.FirstOrDefault() ?? string.Empty,
            GuestName = $"{guestUser!.FirstName} {guestUser.LastName}",
            HostId = hostUser!.Id,
            HostName = $"{hostUser.FirstName} {hostUser.LastName}",
        };
    }
}
