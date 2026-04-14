using Guestly.Application.DTOs.Auth;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Auth.Login;

/// <summary>
/// Manejador del query de inicio de sesión. Se encarga de procesar la lógica de negocio relacionada con el inicio de sesión,
/// incluyendo la verificación de las credenciales del usuario,
/// la generación del token JWT y la construcción de la respuesta de autenticación.
/// </summary>
public class LoginQueryHandler : IRequestHandler<LoginQuery, AuthResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public LoginQueryHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator
    )
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    /// <summary>
    /// Maneja el query de inicio de sesión. Verifica si el correo electrónico y la contraseña son correctos,
    /// si lo son, genera un token JWT para el usuario y retorna una respuesta de autenticación
    /// con los datos del usuario y el token.
    /// </summary>
    public async Task<AuthResponse> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null || !_passwordHasher.VerifyPassword(request.Password, user.Password))
        {
            throw AppException.Unauthorized(
                "El correo electrónico o la contraseña son incorrectos.",
                ErrorCodes.InvalidCredentials
            );
        }

        // OJO: Aqui dejamos que el usuario se loguee incluso si no ha confirmado su correo
        // Ya que el frontend lo redirigira a una pantalla de confirmacion de correo, pero el backend no bloquea el login

        var token = _jwtTokenGenerator.GenerateToken(user);

        var response = user.Adapt<AuthResponse>();

        return response with
        {
            Token = token,
        };
    }
}
