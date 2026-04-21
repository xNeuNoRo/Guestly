using FluentValidation;
using Guestly.Application.DTOs.Reservations;
using Guestly.Domain.Enums;

namespace Guestly.Application.Validators.Reservations;

/// <summary>
/// Valida las propiedades del UpdateReservationStatusRequest para asegurar que el nuevo estado de la reserva
/// sea uno de los valores permitidos (Confirmed o Cancelled) y que no se pueda establecer manualmente
/// a Completada o Pendiente, ya que el sistema gestionará automáticamente esos estados según el flujo de la reserva.
/// </summary>
public class UpdateReservationStatusRequestValidator
    : AbstractValidator<UpdateReservationStatusRequest>
{
    public UpdateReservationStatusRequestValidator()
    {
        RuleFor(x => x.NewStatus)
            .IsInEnum()
            .WithMessage(
                "El estado de la reserva debe ser valido. Los estados permitidos son: Confirmada o Cancelada."
            )
            .Must(status =>
                status == ReservationStatus.Confirmed || status == ReservationStatus.Cancelled
            )
            .WithMessage(
                "No puedes marcar una reserva como Completada o Pendiente manualmente. El sistema lo gestionará automáticamente."
            );
    }
}
