using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Guestly.Domain.ValueObjects;
using MediatR;

namespace Guestly.Application.Queries.Reservations.GetPricePreview;

/// <summary>
/// Manejador de la consulta GetReservationPricePreviewQuery. Este manejador se encarga de procesar la lógica de negocio
/// para calcular una vista previa del precio de una reserva, basándose en las fechas de check-in y check-out, el precio por noche
/// de la propiedad, y las tarifas adicionales como limpieza, servicio e impuestos.
/// </summary>
public class GetReservationPricePreviewQueryHandler
    : IRequestHandler<GetReservationPricePreviewQuery, PricePreviewResponse>
{
    private readonly IPropertyRepository _propertyRepository;

    public GetReservationPricePreviewQueryHandler(IPropertyRepository propertyRepository)
    {
        _propertyRepository = propertyRepository;
    }

    /// <summary>
    /// Maneja la lógica para calcular la vista previa del precio de una reserva. Valida las fechas, obtiene la propiedad,
    /// calcula el número total de noches, el subtotal, las tarifas adicionales y el total general
    /// antes de devolver la respuesta con los detalles del precio.
    /// </summary>
    public async Task<PricePreviewResponse> Handle(
        GetReservationPricePreviewQuery request,
        CancellationToken cancellationToken
    )
    {
        if (request.StartDate >= request.EndDate)
        {
            throw AppException.BadRequest(
                "La fecha de salida debe ser posterior a la fecha de entrada."
            );
        }

        var property = await _propertyRepository.GetByIdAsync(
            request.PropertyId,
            cancellationToken
        );
        if (property is null)
        {
            throw AppException.NotFound("Propiedad no encontrada.", ErrorCodes.PropertyNotFound);
        }

        var breakdown = ReservationPriceBreakdown.Calculate(
            request.StartDate,
            request.EndDate,
            property.PricePerNight,
            property.CleaningFee
        );

        return new PricePreviewResponse
        {
            TotalNights = breakdown.TotalNights,
            PricePerNight = breakdown.PricePerNight,
            Subtotal = breakdown.Subtotal,
            CleaningFee = breakdown.CleaningFee,
            ServiceFee = breakdown.ServiceFee,
            Taxes = breakdown.Taxes,
            GrandTotal = breakdown.GrandTotal,
        };
    }
}
