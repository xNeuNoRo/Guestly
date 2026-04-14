using Guestly.Domain.Entities.Base;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;

namespace Guestly.Domain.Entities.User;

/// <summary>
/// Entidad que representa un usuario en la aplicación, con propiedades como nombre,
/// correo electrónico, contraseña, rol y estado de confirmación de correo electrónico.
/// </summary>
public class User : BaseEntity
{
    /// <summary>
    /// Nombre del usuario, que es un campo obligatorio y no puede ser nulo.
    /// Se utiliza para identificar al usuario en la aplicación y puede ser mostrado en la interfaz de usuario.
    /// </summary>
    public string FirstName { get; private set; } = null!;

    /// <summary>
    /// Apellido del usuario, que es un campo obligatorio y no puede ser nulo.
    /// Se utiliza junto con el nombre para identificar al usuario en la aplicación y puede ser mostrado en la interfaz de usuario.
    /// </summary>
    public string LastName { get; private set; } = null!;

    /// <summary>
    /// Correo electrónico del usuario, que es un campo obligatorio y no puede ser nulo.
    /// Se utiliza para la autenticación del usuario y para enviar notificaciones relacionadas con la cuenta
    /// como confirmación de correo electrónico y restablecimiento de contraseña. Debe ser único en la base de datos.
    /// </summary>
    public string Email { get; private set; } = null!;

    /// <summary>
    /// Contraseña del usuario, que es un campo obligatorio y no puede ser nulo.
    /// Es hasheada antes de ser almacenada en la base de datos para garantizar la seguridad de las credenciales del usuario.
    /// </summary>
    public string Password { get; private set; } = null!;

    /// <summary>
    /// Rol del usuario, definido por la enumeración UserRoles, que indica el tipo de usuario (por ejemplo, invitado o anfitrión).
    /// Este campo es obligatorio y no puede ser nulo, y se utiliza para controlar el acceso
    /// a ciertas funcionalidades de la aplicación según el rol del usuario.
    /// </summary>
    public UserRoles Role { get; private set; }

    /// <summary>
    /// Indica si el correo electrónico del usuario ha sido confirmado,
    /// lo cual es un requisito para que el usuario pueda iniciar sesión y utilizar la aplicación.
    /// </summary>
    public bool IsEmailConfirmed { get; private set; }

    /// <summary>
    /// Colección de tokens asociados al usuario,
    /// que se utiliza para funcionalidades como confirmación de correo electrónico y restablecimiento de contraseña.
    /// </summary>
    private readonly List<UserToken> _tokens = new();

    /// <summary>
    /// Propiedad de solo lectura que expone la colección de tokens asociados al usuario,
    /// permitiendo acceder a los tokens sin permitir modificaciones directas a la colección desde fuera de la clase User.
    /// </summary>
    public virtual IReadOnlyCollection<UserToken> Tokens => _tokens.AsReadOnly();

    /// <summary>
    /// Constructor privado para EF Core, que es necesario para que EF Core pueda crear instancias de la entidad User
    /// </summary>
    private User() { }

    /// <summary>
    /// Constructor público para crear una nueva instancia de User,
    /// que requiere el nombre, apellido, correo electrónico, contraseña y rol del usuario.
    /// </summary>
    /// <param name="firstName">El nombre del usuario.</param>
    /// <param name="lastName">El apellido del usuario.</param>
    /// <param name="email">El correo electrónico del usuario.</param>
    /// <param name="password">La contraseña del usuario.</param>
    /// <param name="role">El rol del usuario.</param>
    public User(string firstName, string lastName, string email, string password, UserRoles role)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Password = password;
        Role = role;
        IsEmailConfirmed = false;
    }

    /// <summary>
    /// Método para confirmar el correo electrónico del usuario, estableciendo la propiedad IsEmailConfirmed a true.
    /// </summary>
    /// <exception cref="DomainException">Se lanza cuando el correo electrónico ya ha sido confirmado.</exception>
    public void ConfirmEmail()
    {
        if (IsEmailConfirmed)
            throw new DomainException("La cuenta ya está confirmada.");

        IsEmailConfirmed = true;
    }

    /// <summary>
    /// Método para agregar un nuevo token a la colección de tokens del usuario,
    /// utilizado para funcionalidades como confirmación de correo electrónico y restablecimiento de contraseña.
    /// </summary>
    /// <param name="token">El token a agregar.</param>
    public void AddToken(UserToken token)
    {
        _tokens.Add(token);
    }

    /// <summary>
    /// Método para actualizar el correo electrónico del usuario, estableciendo la propiedad Email al nuevo valor proporcionado
    /// y restableciendo IsEmailConfirmed a false, ya que el nuevo correo electrónico aún no ha sido confirmado.
    /// </summary>
    /// <param name="newEmail">El nuevo correo electrónico del usuario.</param>
    public void UpdateEmail(string newEmail)
    {
        Email = newEmail;
        IsEmailConfirmed = false;
    }

    /// <summary>
    /// Método para actualizar la contraseña del usuario, estableciendo la propiedad Password al nuevo valor hasheado.
    /// </summary>
    /// <param name="hashedPassword">La contraseña hasheada del usuario.</param>
    public void UpdatePassword(string hashedPassword)
    {
        Password = hashedPassword;
    }

    /// <summary>
    /// Método para actualizar el perfil del usuario, estableciendo las propiedades FirstName y LastName
    /// a los nuevos valores proporcionados.
    /// </summary>
    /// <param name="firstName">El nuevo nombre del usuario.</param>
    /// <param name="lastName">El nuevo apellido del usuario.</param>
    public void UpdateProfile(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    /// <summary>
    /// Añade el rol de anfitrión (Host) al usuario, permitiéndole publicar propiedades
    /// sin perder su capacidad de ser huésped.
    /// </summary>
    /// <exception cref="DomainException">Se lanza cuando el usuario ya tiene permisos de anfitrión.</exception>
    public void AddHostRole()
    {
        if (Role.HasFlag(UserRoles.Host))
        {
            throw new DomainException("El usuario ya tiene permisos de anfitrión.");
        }

        // Suma el rol de anfitrión al rol actual del usuario
        Role |= UserRoles.Host;
    }

    /// <summary>
    /// Añade el rol de invitado (Guest) al usuario, permitiéndole reservar propiedades
    /// sin perder su capacidad de ser anfitrión.
    /// </summary>
    /// <exception cref="DomainException">Se lanza cuando el usuario ya tiene permisos de invitado.</exception>
    public void AddGuestRole()
    {
        if (Role.HasFlag(UserRoles.Guest))
        {
            throw new DomainException("El usuario ya tiene permisos de invitado.");
        }

        // Suma el rol de huésped al rol actual del usuario
        Role |= UserRoles.Guest;
    }
}
