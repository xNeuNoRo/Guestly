using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Application.Models.Emails;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;
using Guestly.Domain.Interfaces;
using MediatR;

namespace Guestly.Application.Commands.Auth.ResetPassword;

/// <summary>
/// Manejador del comando de restablecimiento de contraseña. Se encarga de procesar la lógica de negocio
/// relacionada con el restablecimiento de contraseña de un usuario, incluyendo la verificación del token
/// de restablecimiento de contraseña, la actualización de la contraseña del usuario y la revocación
/// del token utilizado para el restablecimiento.
/// </summary>
public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserTokenRepository _userTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;

    public ResetPasswordCommandHandler(
        IUserRepository userRepository,
        IUserTokenRepository userTokenRepository,
        IPasswordHasher passwordHasher,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork,
        IEmailService emailService
    )
    {
        _userRepository = userRepository;
        _userTokenRepository = userTokenRepository;
        _passwordHasher = passwordHasher;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
    }

    /// <summary>
    /// Maneja el comando de restablecimiento de contraseña. Verifica si el correo electrónico del usuario existe,
    /// si el token de restablecimiento de contraseña es válido y no ha expirado.
    /// Si todas las verificaciones son exitosas, actualiza la contraseña del usuario al nuevo valor hasheado,
    /// revoca el token de restablecimiento de contraseña utilizado y retorna true.
    /// </summary>
    public async Task<bool> Handle(
        ResetPasswordCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound("Usuario no encontrado.", ErrorCodes.UserNotFound);
        }

        var userToken = await _userTokenRepository.GetByTokenValueAsync(
            request.Token,
            TokenTypes.PasswordReset,
            cancellationToken
        );

        var currentTime = _dateTimeProvider.UtcNow;

        if (userToken is null || userToken.UserId != user.Id || !userToken.IsValid(currentTime))
        {
            throw AppException.BadRequest(
                "El token de recuperación es inválido o ha expirado.",
                ErrorCodes.InvalidToken
            );
        }

        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            var hashedPassword = _passwordHasher.HashPassword(request.NewPassword);
            user.UpdatePassword(hashedPassword);
            userToken.Revoke(currentTime);
            _userRepository.Update(user);

            // UnitOfWork es inteligente y llamara a SaveChangesAsync()
            // siempre, de esa siempre se persisten los cambios.
            await _unitOfWork.CommitAsync(cancellationToken);

            var actionDate = currentTime.ToString("dd MMM yyyy, HH:mm") + " UTC";
            var alertModel = new SecurityAlertModel(
                user.FirstName,
                "Se ha modificado la contraseña de tu cuenta.",
                actionDate
            );

            await _emailService.SendTemplateEmailAsync(
                user.Email,
                "Alerta de Seguridad: Contraseña modificada",
                EmailTemplate.SecurityAlert,
                alertModel,
                cancellationToken
            );

            return true;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
