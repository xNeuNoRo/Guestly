using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
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

        var totalNights = (request.EndDate.Date - request.StartDate.Date).Days;
        var subtotal = totalNights * property.PricePerNight;

        var cleaningFee = property.CleaningFee;
        var serviceFee = subtotal * 0.05m; // Cobraremos una comisión del 5% sobre el subtotal como tarifa de servicio
        var taxes = (subtotal + cleaningFee + serviceFee) * 0.18m; // 18% de impuestos (ITBIS)
        var grandTotal = subtotal + cleaningFee + serviceFee + taxes;

        return new PricePreviewResponse
        {
            TotalNights = totalNights,
            PricePerNight = property.PricePerNight,
            Subtotal = Math.Round(subtotal, 2),
            CleaningFee = Math.Round(cleaningFee, 2),
            ServiceFee = Math.Round(serviceFee, 2),
            Taxes = Math.Round(taxes, 2),
            GrandTotal = Math.Round(grandTotal, 2),
        };
    }
}
