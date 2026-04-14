using Guestly.Application.DTOs.Users;
using MediatR;

namespace Guestly.Application.Queries.Users.GetUserProfile;

/// <summary>
/// Query para obtener el perfil de un usuario. Este query requiere el ID del usuario y devuelve un objeto UserProfileResponse
/// que contiene la información del perfil del usuario, como su nombre, correo electrónico, foto de perfil, etc.
/// </summary>
public record GetUserProfileQuery(Guid UserId) : IRequest<UserProfileResponse>;
