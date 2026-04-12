using Guestly.Application.DTOs.Users;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Users.UpdateProfile;

/// <summary>
/// Manejador del comando UpdateUserProfileCommand, responsable de procesar la solicitud de actualización del perfil de un usuario.
/// Este manejador interactúa con el repositorio de usuarios para obtener el usuario correspondiente, actualizar
/// su perfil con los nuevos datos proporcionados en el comando, y retornar una respuesta con la
/// información actualizada del perfil del usuario.
/// </summary>
public class UpdateUserProfileCommandHandler
    : IRequestHandler<UpdateUserProfileCommand, UserProfileResponse>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserProfileCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <summary>
    /// Manejador del comando UpdateUserProfileCommand, que procesa la solicitud de actualización del perfil de un usuario.
    /// </summary>
    public async Task<UserProfileResponse> Handle(
        UpdateUserProfileCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound("Usuario no encontrado.", ErrorCodes.UserNotFound);
        }

        user.UpdateProfile(request.FirstName, request.LastName);
        _userRepository.Update(user);
        return user.Adapt<UserProfileResponse>();
    }
}
