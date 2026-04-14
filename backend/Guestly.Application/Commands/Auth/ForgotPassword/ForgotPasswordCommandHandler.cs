using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Domain.Entities.User;
using Guestly.Domain.Enums;
using Guestly.Domain.Interfaces;
using MediatR;

namespace Guestly.Application.Commands.Auth.ForgotPassword;

/// <summary>
/// Manejador del comando de solicitud de restablecimiento de contraseña. Se encarga de procesar la lógica de negocio
/// relacionada con la solicitud de restablecimiento de contraseña, incluyendo la verificación de la existencia
/// del correo electrónico, la generación de un token de restablecimiento de contraseña,
/// la revocación de tokens de restablecimiento de contraseña existentes para el usuario y la persistencia
/// del nuevo token en la base de datos.
/// </summary>
public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserTokenRepository _userTokenRepository;
    private readonly IRandomTokenGenerator _tokenGenerator;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;

    public ForgotPasswordCommandHandler(
        IUserRepository userRepository,
        IUserTokenRepository userTokenRepository,
        IRandomTokenGenerator tokenGenerator,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork
    )
    {
        _userRepository = userRepository;
        _userTokenRepository = userTokenRepository;
        _tokenGenerator = tokenGenerator;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Maneja el comando de solicitud de restablecimiento de contraseña. Verifica si el correo electrónico existe,
    /// si existe, revoca cualquier token de restablecimiento de contraseña existente para el usuario
    /// y genera un nuevo token de restablecimiento de contraseña, lo guarda en la base de datos y retorna true.
    /// </summary>
    public async Task<bool> Handle(
        ForgotPasswordCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        // Regla de seguridad
        // No se debe revelar si el correo electrónico existe o no en el sistema,
        // para evitar ataques de enumeración de usuarios.
        if (user is null)
        {
            return true;
        }

        await _userTokenRepository.RemoveExistingTokensAsync(
            user.Id,
            TokenTypes.PasswordReset,
            cancellationToken
        );

        var tokenString = _tokenGenerator.Generate();
        var expiresAt = _dateTimeProvider.UtcNow.AddHours(1);
        var userToken = new UserToken(user.Id, tokenString, TokenTypes.PasswordReset, expiresAt);
        await _userTokenRepository.AddAsync(userToken, cancellationToken);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // solamente si es que no detecta una transaccion activa
        await _unitOfWork.CommitAsync(cancellationToken);

        // TODO: Enviar url con el token al correo electrónico del usuario para que pueda restablecer su contraseña.
        // algo tipo: https://frontend/reset-password?token=abc123

        return true;
    }
}
