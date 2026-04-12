using FluentValidation;
using Guestly.Application.DTOs.Properties;

namespace Guestly.Application.Validators.Properties;

/// <summary>
/// Valida las propiedades del UpdatePropertyRequest para asegurar que el título, descripción, ubicación,
/// precio por noche y capacidad sean proporcionados y tengan un formato válido.
/// </summary>
public class UpdatePropertyRequestValidator : AbstractValidator<UpdatePropertyRequest>
{
    public UpdatePropertyRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("El título es obligatorio.")
            .MaximumLength(200)
            .WithMessage("El título no puede exceder los 200 caracteres.");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("La descripción es obligatoria.")
            .MaximumLength(2000)
            .WithMessage("La descripción no puede exceder los 2000 caracteres.");

        RuleFor(x => x.Location)
            .NotEmpty()
            .WithMessage("La ubicación es obligatoria.")
            .MaximumLength(200)
            .WithMessage("La ubicación no puede exceder los 200 caracteres.");

        RuleFor(x => x.PricePerNight)
            .GreaterThan(0)
            .WithMessage("El precio por noche debe ser un valor positivo.");

        RuleFor(x => x.Capacity)
            .GreaterThan(0)
            .WithMessage("La capacidad debe ser de al menos 1 huésped.")
            .LessThanOrEqualTo(100)
            .WithMessage("La capacidad no puede exceder los 100 huéspedes.");
    }
}
