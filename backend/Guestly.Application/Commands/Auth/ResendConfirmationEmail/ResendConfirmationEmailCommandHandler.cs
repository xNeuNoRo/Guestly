using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Domain.Entities.User;
using Guestly.Domain.Enums;
using Guestly.Domain.Interfaces;
using MediatR;

namespace Guestly.Application.Commands.Auth.ResendConfirmationEmail;

/// <summary>
/// Manejador para reenvío de email de confirmación. Si el usuario no existe o ya ha confirmado su email,
/// simplemente retorna true para evitar revelar información sobre la existencia del usuario.
/// </summary>
public class ResendConfirmationEmailCommandHandler
    : IRequestHandler<ResendConfirmationEmailCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserTokenRepository _userTokenRepository;
    private readonly IRandomTokenGenerator _tokenGenerator;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;

    public ResendConfirmationEmailCommandHandler(
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
    /// Maneja el comando para reenvío de email de confirmación. Si el usuario no existe o ya ha confirmado su email,
    /// simplemente retorna true para evitar revelar información sobre la existencia del usuario.
    /// </summary>
    public async Task<bool> Handle(
        ResendConfirmationEmailCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        // Si el usuario no existe o ya ha confirmado su email,
        // retornamos true para evitar revelar información sobre la existencia del usuario
        if (user is null || user.IsEmailConfirmed)
        {
            return true;
        }

        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            var tokenString = _tokenGenerator.Generate();

            var userToken = new UserToken(
                user.Id,
                tokenString,
                TokenTypes.EmailConfirmation,
                _dateTimeProvider.UtcNow.AddHours(24)
            );

            await _userTokenRepository.AddAsync(userToken, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            // TODO: Enviar email de confirmación con el token generado
            // Idk algo como EmailService.SendConfirmationEmail(user.Email, tokenString);
            return true;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
