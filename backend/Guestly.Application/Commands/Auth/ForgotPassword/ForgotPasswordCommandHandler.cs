using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Application.Models.Emails;
using Guestly.Domain.Entities.User;
using Guestly.Domain.Enums;
using Guestly.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;

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
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public ForgotPasswordCommandHandler(
        IUserRepository userRepository,
        IUserTokenRepository userTokenRepository,
        IRandomTokenGenerator tokenGenerator,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork,
        IEmailService emailService,
        IConfiguration configuration
    )
    {
        _userRepository = userRepository;
        _userTokenRepository = userTokenRepository;
        _tokenGenerator = tokenGenerator;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _configuration = configuration;
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

        try
        {
            await _userTokenRepository.RemoveExistingTokensAsync(
                user.Id,
                TokenTypes.PasswordReset,
                cancellationToken
            );

            var tokenString = _tokenGenerator.Generate();
            var expiresAt = _dateTimeProvider.UtcNow.AddHours(1);
            var userToken = new UserToken(
                user.Id,
                tokenString,
                TokenTypes.PasswordReset,
                expiresAt
            );
            await _userTokenRepository.AddAsync(userToken, cancellationToken);

            // UnitOfWork es inteligente y llamara a SaveChangesAsync()
            // siempre, de esa siempre se persisten los cambios.
            await _unitOfWork.CommitAsync(cancellationToken);

            var baseUrl = _configuration["FrontendSettings:BaseUrl"] ?? "http://localhost:3000";
            var resetLink =
                $"{baseUrl}/auth/reset-password?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(tokenString)}";

            var emailModel = new PasswordResetModel(user.FirstName, resetLink, 60);

            await _emailService.SendTemplateEmailAsync(
                user.Email,
                "Recuperación de Contraseña - Guestly",
                EmailTemplate.PasswordReset,
                emailModel,
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
