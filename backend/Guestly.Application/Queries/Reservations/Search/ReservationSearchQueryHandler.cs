using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.Repositories;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Reservations.Search;

/// <summary>
/// Manejador del query ReservationSearchQuery. Este manejador se encarga de procesar la lógica de negocio
/// para buscar reservas en el sistema, aplicando los filtros opcionales proporcionados (por propiedad
/// ID, estado de la reserva, rango de fechas), y adaptando los resultados a una lista de ReservationResponse
/// que incluye información adicional de la propiedad, huésped y anfitrión para cada reserva encontrada.
/// </summary>
public class ReservationSearchQueryHandler
    : IRequestHandler<ReservationSearchQuery, IEnumerable<ReservationResponse>>
{
    private readonly IReservationRepository _reservationRepository;

    public ReservationSearchQueryHandler(IReservationRepository reservationRepository)
    {
        _reservationRepository = reservationRepository;
    }

    /// <summary>
    /// Maneja la lógica para buscar reservas en el sistema, aplicando los filtros opcionales proporcionados (por propiedad
    /// ID, estado de la reserva, rango de fechas), y adaptando los resultados a una lista de ReservationResponse
    /// que incluye información adicional de la propiedad, huésped y anfitrión para cada reserva encontrada.
    /// </summary>
    public async Task<IEnumerable<ReservationResponse>> Handle(
        ReservationSearchQuery request,
        CancellationToken cancellationToken
    )
    {
        var reservations = await _reservationRepository.SearchAsync(
            request.PropertyId,
            request.GuestId,
            request.HostId,
            request.Status,
            request.StartDate,
            request.EndDate,
            cancellationToken
        );

        var responseList = new List<ReservationResponse>();

        // Iteramos sobre las reservas obtenidas y adaptamos cada una a un ReservationResponse,
        // incluyendo información adicional de la propiedad, huésped y anfitrión.
        foreach (var reservation in reservations)
        {
            var baseResponse = reservation.Adapt<ReservationResponse>();

            var fullResponse = baseResponse with
            {
                PropertyTitle = reservation.Property?.Title ?? "Propiedad no disponible",
                PropertyLocation = reservation.Property?.Location ?? "Ubicación no disponible",
                PropertyThumbnailUrl =
                    reservation.Property?.Images.FirstOrDefault() ?? string.Empty,
                GuestName =
                    reservation.Guest != null
                        ? $"{reservation.Guest.FirstName} {reservation.Guest.LastName}"
                        : "Huésped desconocido",
                HostId = reservation.Property?.HostId ?? Guid.Empty,
                HostName =
                    reservation.Property?.Host != null
                        ? $"{reservation.Property.Host.FirstName} {reservation.Property.Host.LastName}"
                        : "Anfitrión desconocido",
            };

            responseList.Add(fullResponse);
        }

        return responseList;
    }
}
