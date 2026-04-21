namespace Guestly.Application.DTOs.Users;

/// <summary>
/// Representa la request para cambiar la contraseña de un usuario, incluyendo la contraseña actual del usuario,
/// la nueva contraseña que el usuario desea establecer como su contraseña válida, y la confirmación de la nueva contraseña
/// que el usuario desea establecer como su contraseña válida, utilizada para verificar
/// que el usuario ha ingresado correctamente la nueva contraseña.
/// </summary>
public record ChangePasswordRequest
{
    /// <summary>
    /// La contraseña actual del usuario que desea cambiar su contraseña,
    /// utilizada para verificar la identidad del usuario antes de realizar el cambio de contraseña.
    /// </summary>
    public required string CurrentPassword { get; init; }

    /// <summary>
    /// La nueva contraseña que el usuario desea establecer como su contraseña válida.
    /// </summary>
    public required string NewPassword { get; init; }

    /// <summary>
    /// La confirmación de la nueva contraseña que el usuario desea establecer como su contraseña válida,
    /// utilizada para verificar que el usuario ha ingresado correctamente la nueva contraseña.
    /// </summary>
    public required string ConfirmNewPassword { get; init; }
}
