using Guestly.Domain.Entities.Base;
using Guestly.Domain.Enums;

namespace Guestly.Domain.Entities.Notifications;

/// <summary>
/// Entidad que representa una notificación en la aplicación, asociada a un usuario específico,
/// con propiedades como el título, el mensaje, el tipo de notificación (definido por la enumeración NotificationTypes),
/// y un indicador de si la notificación ha sido leída o no, junto con la fecha y hora en que fue leída.
/// </summary>
public class Notification : BaseEntity
{
    /// <summary>
    /// Identificador del usuario al que pertenece esta notificación, con una relación de clave foránea a la entidad User.
    /// </summary>
    public Guid UserId { get; private set; }

    /// <summary>
    /// Referencia de navegación al usuario al que pertenece esta notificación,
    /// establecida como virtual para permitir lazy loading al usar EF Core
    /// </summary>
    public virtual User.User? User { get; }

    /// <summary>
    /// Título de la notificación, que es un campo obligatorio y no puede ser nulo.
    /// Se utiliza para mostrar un resumen de la notificación al usuario.
    /// </summary>
    public string Title { get; private set; } = null!;

    /// <summary>
    /// Mensaje de la notificación, que es un campo obligatorio y no puede ser nulo.
    /// Contiene el contenido completo de la notificación que se muestra al usuario cuando visualiza
    /// la notificación en detalle. Puede incluir información adicional o instrucciones para el usuario relacionadas con la notificación.
    /// </summary>
    ///
    public string Message { get; private set; } = null!;

    /// <summary>
    /// Tipo de notificación, definido por la enumeración NotificationTypes,
    /// que indica el propósito o categoría de la notificación (por ejemplo, reserva confirmada, mensaje nuevo, etc.).
    /// </summary>
    public NotificationTypes Type { get; private set; }

    /// <summary>
    /// Indicador de si la notificación ha sido leída o no, que es un campo obligatorio.
    /// </summary>
    public bool IsRead { get; private set; }

    /// <summary>
    /// Fecha y hora en que la notificación fue leída por el usuario. Si la notificación no ha sido leída, este valor será null.
    /// </summary>
    public DateTime? ReadAt { get; private set; }

    /// <summary>
    /// Constructor protegido para EF Core, que es necesario para que EF pueda crear instancias de la clase Notification.
    /// </summary>
    protected Notification() { }

    /// <summary>
    /// Constructor público para crear una nueva notificación, que requiere el
    /// identificador del usuario al que pertenece la notificación, el título,
    /// el mensaje y el tipo de notificación. El indicador de si la notificación
    /// ha sido leída se establece inicialmente en false, y la fecha de lectura se establece en null.
    /// </summary>
    /// <param name="userId">El identificador del usuario al que pertenece la notificación.</param>
    /// <param name="title">El título de la notificación.</param>
    /// <param name="message">El mensaje de la notificación.</param>
    /// <param name="type">El tipo de notificación.</param>
    public Notification(Guid userId, string title, string message, NotificationTypes type)
    {
        ValidateNotification(title, message);

        UserId = userId;
        Title = title;
        Message = message;
        Type = type;
        IsRead = false;
        ReadAt = null;
    }

    /// <summary>
    /// Método privado para validar el título y el mensaje de la notificación,
    /// asegurándose de que ambos campos no estén vacíos o solo contengan espacios en blanco.
    /// </summary>
    /// <param name="title">El título de la notificación.</param>
    /// <param name="message">El mensaje de la notificación.</param>
    /// <exception cref="ArgumentException">Se lanza cuando el título o el mensaje están vacíos o contienen solo espacios en blanco.</exception>
    private static void ValidateNotification(string title, string message)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("El título de la notificación no puede estar vacío.");
        }

        if (string.IsNullOrWhiteSpace(message))
        {
            throw new ArgumentException("El mensaje de la notificación no puede estar vacío.");
        }
    }

    /// <summary>
    /// Método para marcar la notificación como leída, estableciendo el indicador IsRead
    /// a true y registrando la fecha y hora en que se leyó la notificación.
    /// </summary>
    /// <param name="currentTime">La fecha y hora en que se marca la notificación como leída.</param>
    public void MarkAsRead(DateTime currentTime)
    {
        // Si ya esta leida, no es necesario que hagamos algo mas.
        if (IsRead)
            return;

        IsRead = true;
        ReadAt = currentTime;
    }

    /// <summary>
    /// Método para marcar la notificación como no leída, estableciendo el indicador IsRead
    /// a false y borrando la fecha y hora de lectura (estableciéndola en null).
    /// </summary>
    public void MarkAsUnread()
    {
        // Si ya esta sin leer, no es necesario que hagamos algo mas.
        if (!IsRead)
            return;

        IsRead = false;
        ReadAt = null;
    }
}
