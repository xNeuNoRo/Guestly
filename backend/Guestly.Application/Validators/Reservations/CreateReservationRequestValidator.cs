using FluentValidation;
using Guestly.Application.DTOs.Reservations;

namespace Guestly.Application.Validators.Reservations;

/// <summary>
/// Valida las propiedades del CreateReservationRequest para asegurar que la propiedad a reservar, 
/// la fecha de inicio y la fecha de finalización sean proporcionados y tengan un formato válido, 
/// además de cumplir con las reglas lógicas para las fechas.
/// </summary>
public class CreateReservationRequestValidator : AbstractValidator<CreateReservationRequest>
{
    public CreateReservationRequestValidator()
    {
        RuleFor(x => x.PropertyId)
            .NotEmpty()
            .WithMessage("Debe especificar la propiedad que desea reservar.");

        RuleFor(x => x.StartDate)
            .NotEmpty()
            .WithMessage("La fecha de inicio (Check-in) es obligatoria.")
            .GreaterThanOrEqualTo(DateTime.UtcNow.Date)
            .WithMessage("No puedes realizar una reserva en el pasado.");

        RuleFor(x => x.EndDate)
            .NotEmpty()
            .WithMessage("La fecha de finalización (Check-out) es obligatoria.")
            .GreaterThanOrEqualTo(x => x.StartDate)
            .WithMessage("La fecha de salida debe ser posterior a la fecha de entrada.");
    }
}
