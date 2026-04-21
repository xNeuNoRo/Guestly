using Guestly.Application.DTOs.Users;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Users.GetUserProfile;

/// <summary>
/// Manejador del query GetUserProfileQuery, responsable de procesar la solicitud de obtener el perfil de un usuario.
/// Este manejador utiliza el repositorio de usuarios para recuperar la información del usuario a partir de su ID.
/// </summary>
public class GetUserProfileQueryHandler : IRequestHandler<GetUserProfileQuery, UserProfileResponse>
{
    private readonly IUserRepository _userRepository;

    public GetUserProfileQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <summary>
    /// Manejador del query GetUserProfileQuery, que procesa la solicitud de obtener el perfil de un usuario.
    /// </summary>
    public async Task<UserProfileResponse> Handle(
        GetUserProfileQuery request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound(
                "No se encontró el perfil del usuario.",
                ErrorCodes.UserNotFound
            );
        }

        return user.Adapt<UserProfileResponse>();
    }
}
