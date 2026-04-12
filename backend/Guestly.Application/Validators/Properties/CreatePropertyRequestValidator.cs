using FluentValidation;
using Guestly.Application.DTOs.Properties;

namespace Guestly.Application.Validators.Properties;

/// <summary>
/// Valida las propiedades del CreatePropertyRequest para asegurar que el título, descripción, ubicación,
/// precio por noche, capacidad y las imágenes sean proporcionados y tengan un formato válido,
/// además de cumplir con los requisitos de seguridad para la contraseña.
/// </summary>
public class CreatePropertyRequestValidator : AbstractValidator<CreatePropertyRequest>
{
    public CreatePropertyRequestValidator()
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

        RuleFor(x => x.Images)
            .NotNull()
            .WithMessage("Debe incluir imagenes de la propiedad.")
            .NotEmpty()
            .WithMessage("Debe subir al menos una imagen de la propiedad.");
    }
}
