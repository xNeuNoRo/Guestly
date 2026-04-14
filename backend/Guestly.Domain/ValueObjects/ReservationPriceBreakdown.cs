namespace Guestly.Domain.ValueObjects;

/// <summary>
/// Objeto de valor que centraliza las reglas de negocio y los redondeos
/// para el cálculo de precios de una reserva.
/// </summary>
public record ReservationPriceBreakdown
{
    public int TotalNights { get; init; }
    public decimal PricePerNight { get; init; }
    public decimal Subtotal { get; init; }
    public decimal CleaningFee { get; init; }
    public decimal ServiceFee { get; init; }
    public decimal Taxes { get; init; }
    public decimal GrandTotal { get; init; }

    /// <summary>
    /// Calcula el desglose de precios para una reserva, incluyendo el subtotal, tarifa de limpieza,
    /// comisión de servicio y impuestos, aplicando las reglas de negocio y redondeos necesarios para garantizar
    /// que el precio final sea correcto y consistente. Este método centraliza toda la lógica relacionada
    /// con el cálculo de precios
    /// </summary>
    /// <param name="checkInDate">La fecha de entrada</param>
    /// <param name="checkOutDate">La fecha de salida</param>
    /// <param name="pricePerNight">El precio por noche</param>
    /// <param name="cleaningFee">La tarifa de limpieza</param>
    /// <returns>El desglose de precios de la reserva</returns>
    public static ReservationPriceBreakdown Calculate(
        DateTime checkInDate,
        DateTime checkOutDate,
        decimal pricePerNight,
        decimal cleaningFee
    )
    {
        var totalNights = (checkOutDate.Date - checkInDate.Date).Days;

        var subtotal = totalNights * pricePerNight;

        var rawServiceFee = subtotal * 0.05m; // 5% Comisión de servicio
        var rawTaxes = (subtotal + cleaningFee + rawServiceFee) * 0.18m; // 18% Impuestos

        var roundedSubtotal = Math.Round(subtotal, 2);
        var roundedCleaningFee = Math.Round(cleaningFee, 2);
        var roundedServiceFee = Math.Round(rawServiceFee, 2);
        var roundedTaxes = Math.Round(rawTaxes, 2);

        var grandTotal = roundedSubtotal + roundedCleaningFee + roundedServiceFee + roundedTaxes;

        return new ReservationPriceBreakdown
        {
            TotalNights = totalNights,
            PricePerNight = Math.Round(pricePerNight, 2),
            Subtotal = roundedSubtotal,
            CleaningFee = roundedCleaningFee,
            ServiceFee = roundedServiceFee,
            Taxes = roundedTaxes,
            GrandTotal = grandTotal,
        };
    }
}
