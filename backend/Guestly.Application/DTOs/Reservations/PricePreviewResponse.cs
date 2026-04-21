namespace Guestly.Application.DTOs.Reservations;

public record PricePreviewResponse()
{
    /// <summary>
    /// Número total de noches para la reserva, calculado a partir de las fechas de check-in y check-out.
    /// </summary>
    public required int TotalNights { get; init; }

    /// <summary>
    /// Precio por noche para la propiedad reservada, obtenido de la base de datos o del servicio de precios.
    /// </summary>
    public required decimal PricePerNight { get; init; }

    /// <summary>
    /// Subtotal de la reserva, calculado como el precio por noche multiplicado por el número total de noches.
    /// </summary>
    public required decimal Subtotal { get; init; }

    /// <summary>
    /// Tarifa de limpieza para la reserva, que puede ser un monto fijo o
    /// un porcentaje del subtotal, dependiendo de la política de la propiedad.
    /// </summary>
    public required decimal CleaningFee { get; init; }

    /// <summary>
    /// Tarifa de servicio para la reserva, que puede ser un monto fijo o
    /// un porcentaje del subtotal, dependiendo de la política de la propiedad.
    /// </summary>
    public required decimal ServiceFee { get; init; }

    /// <summary>
    /// Impuestos para la reserva, que pueden ser un monto fijo o
    /// un porcentaje del subtotal, dependiendo de la política de la propiedad.
    /// </summary>
    public required decimal Taxes { get; init; }

    /// <summary>
    /// Total general de la reserva, calculado como la suma del subtotal,
    /// la tarifa de limpieza, la tarifa de servicio y los impuestos.
    /// </summary>
    public required decimal GrandTotal { get; init; }
}
