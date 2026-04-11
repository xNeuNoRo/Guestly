namespace Guestly.Domain.Enums;

/// <summary>
/// Enumeración que define los roles de usuario en la aplicación,
/// como invitado (Guest) y anfitrión (Host).
/// </summary>
[Flags]
public enum UserRoles
{
    None = 0,
    Guest = 1,
    Host = 2,
}
