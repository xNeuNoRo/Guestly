using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Application.Models.Emails;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;
using Guestly.Domain.Interfaces;
using MediatR;

namespace Guestly.Application.Commands.Users.ChangePassword;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly IDateTimeProvider _dateTimeProvider;

    public ChangePasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork,
        IEmailService emailService,
        IDateTimeProvider dateTimeProvider
    )
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<bool> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound("Usuario no encontrado", ErrorCodes.UserNotFound);
        }

        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.Password))
        {
            throw AppException.Unauthorized(
                "La contraseña actual es incorrecta.",
                ErrorCodes.InvalidCredentials
            );
        }

        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            var hashedNewPassword = _passwordHasher.HashPassword(request.NewPassword);
            user.UpdatePassword(hashedNewPassword);
            _userRepository.Update(user);

            // UnitOfWork es inteligente y llamara a SaveChangesAsync()
            // siempre, de esa siempre se persisten los cambios.
            await _unitOfWork.CommitAsync(cancellationToken);

            var actionDate = _dateTimeProvider.UtcNow.ToString("dd MMM yyyy, HH:mm") + " UTC";
            var alertModel = new SecurityAlertModel(
                user.FirstName,
                "Has actualizado la contraseña desde tu perfil.",
                actionDate
            );

            await _emailService.SendTemplateEmailAsync(
                user.Email,
                "Alerta de Seguridad: Contraseña actualizada",
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
