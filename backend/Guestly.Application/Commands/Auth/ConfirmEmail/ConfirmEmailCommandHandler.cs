using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;
using Guestly.Domain.Interfaces;
using MediatR;

namespace Guestly.Application.Commands.Auth.ConfirmEmail;

/// <summary>
/// Manejador del comando de confirmación de correo electrónico. Se encarga de procesar la lógica de negocio
/// relacionada con la confirmación del correo electrónico de un usuario, incluyendo la verificación del token
/// de confirmación, la actualización del estado de confirmación del usuario y la revocación del token utilizado para la confirmación.
/// </summary>
public class ConfirmEmailCommandHandler : IRequestHandler<ConfirmEmailCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserTokenRepository _userTokenRepository;
    private readonly IDateTimeProvider _dateTimeProvider;

    public ConfirmEmailCommandHandler(
        IUserRepository userRepository,
        IUserTokenRepository userTokenRepository,
        IDateTimeProvider dateTimeProvider
    )
    {
        _userRepository = userRepository;
        _userTokenRepository = userTokenRepository;
        _dateTimeProvider = dateTimeProvider;
    }

    /// <summary>
    /// Maneja el comando de confirmación de correo electrónico. Verifica si el correo electrónico del usuario existe,
    /// si el usuario ya ha confirmado su correo electrónico, si el token de confirmación es
    /// válido y no ha expirado. Si todas las verificaciones son exitosas, actualiza el estado de confirmación del usuario a confirmado,
    /// revoca el token de confirmación utilizado y retorna true.
    /// </summary>
    public async Task<bool> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound("Usuario no encontrado.", ErrorCodes.UserNotFound);
        }

        if (user.IsEmailConfirmed)
        {
            throw AppException.Conflict(
                "La cuenta ya está confirmada.",
                ErrorCodes.AccountAlreadyConfirmed
            );
        }

        var userToken = await _userTokenRepository.GetByTokenValueAsync(
            request.Token,
            TokenTypes.EmailConfirmation,
            cancellationToken
        );

        var currentTime = _dateTimeProvider.UtcNow;

        if (userToken is null || userToken.UserId != user.Id || !userToken.IsValid(currentTime))
        {
            throw AppException.BadRequest(
                "El token es inválido o ha expirado.",
                ErrorCodes.InvalidToken
            );
        }

        user.ConfirmEmail();
        userToken.Revoke(currentTime);
        _userRepository.Update(user);

        // Aqui solo revocamos el token en memoria ya que EF Core lo persistira luego
        // Con el metodo SaveChangesAync que se llamara al final de la transaccion.

        return true;
    }
}
