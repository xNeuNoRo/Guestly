using Guestly.Domain.Entities.Base;
using Guestly.Domain.Enums;

namespace Guestly.Domain.Entities.User;

/// <summary>
/// Entidad que representa un token asociado a un usuario,
/// utilizado para funcionalidades como confirmación de correo electrónico y restablecimiento de contraseña.
/// </summary>
public class UserToken : BaseEntity
{
    /// <summary>
    /// Identificador del usuario al que pertenece este token, con una relación de clave foránea a la entidad User.
    /// </summary>
    public Guid UserId { get; private set; }

    /// <summary>
    /// Valor del token, que puede ser un string generado aleatoriamente o un JWT, dependiendo del tipo de token.
    /// </summary>
    public string Token { get; private set; }

    /// <summary>
    /// Tipo de token, definido por la enumeración TokenType, que indica el propósito del token (por ejemplo, confirmación de correo electrónico o restablecimiento de contraseña).
    /// </summary>
    public TokenTypes Type { get; private set; }

    /// <summary>
    /// Fecha y hora de expiración del token, después de la cual el token ya no
    /// es válido y no puede ser utilizado para su propósito previsto.
    /// </summary>
    public DateTime ExpiresAt { get; private set; }

    /// <summary>
    /// Fecha y hora en que el token fue revocado, si es que ha sido revocado.
    /// Si el token no ha sido revocado, este valor será null.
    /// </summary>
    public DateTime? RevokedAt { get; private set; }

    /// <summary>
    /// Referencia de navegación al usuario al que pertenece este token,
    /// establecida como virtual para permitir lazy loading al usar EF Core
    /// </summary>
    public virtual User? User { get; }

    /// <summary>
    /// Constructor protegido para EF Core, que inicializa el valor del token como una cadena vacía.
    /// </summary>
    protected UserToken()
    {
        Token = string.Empty;
    }

    /// <summary>
    /// Constructor público para crear una nueva instancia de UserToken,
    /// que requiere el identificador del usuario, el valor del token, el tipo de token y la fecha de expiración.
    /// </summary>
    /// <param name="userId">El identificador del usuario al que pertenece el token.</param>
    /// <param name="token">El valor del token.</param>
    /// <param name="type">El tipo de token.</param>
    /// <param name="expiresAt">La fecha y hora de expiración del token.</param>
    public UserToken(Guid userId, string token, TokenTypes type, DateTime expiresAt)
    {
        UserId = userId;
        Token = token;
        Type = type;
        ExpiresAt = expiresAt;
    }

    /// <summary>
    /// Método para verificar si el token es válido, es decir, que no ha sido revocado y que no ha expirado.
    /// </summary>
    /// <param name="currentTime">La fecha y hora actual.</param>
    /// <returns>True si el token es válido, false en caso contrario.</returns>
    public bool IsValid(DateTime currentTime)
    {
        return RevokedAt == null && ExpiresAt >= currentTime;
    }

    /// <summary>
    /// Método para revocar el token, estableciendo la fecha y hora de revocación al valor actual.
    /// </summary>
    /// <param name="currentTime">La fecha y hora actual.</param>
    public void Revoke(DateTime currentTime)
    {
        RevokedAt = currentTime;
    }
}
