using Guestly.Domain.Entities.Base;
using Guestly.Domain.Entities.Reservations;
using Guestly.Domain.Entities.Reviews;
using Guestly.Domain.Exceptions;

namespace Guestly.Domain.Entities.Properties;

/// <summary>
/// Entidad que representa una propiedad en la aplicación, con propiedades como título,
/// descripción, ubicación, precio por noche, capacidad y una colección de imágenes.
/// </summary>
public class Property : BaseEntity
{
    /// <summary>
    /// Título de la propiedad, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public string Title { get; private set; } = null!;

    /// <summary>
    /// Descripción de la propiedad, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public string Description { get; private set; } = null!;

    /// <summary>
    /// Ubicación de la propiedad, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public string Location { get; private set; } = null!;

    /// <summary>
    /// Precio por noche de la propiedad, que es un campo obligatorio y debe ser mayor que cero.
    /// </summary>
    public decimal PricePerNight { get; private set; }

    /// <summary>
    /// Capacidad de la propiedad, que es un campo obligatorio y debe ser mayor que cero.
    /// </summary>
    public int Capacity { get; private set; }

    /// <summary>
    /// Identificador del anfitrión que posee la propiedad, que es un campo obligatorio y no puede ser nulo.
    /// </summary>
    public Guid HostId { get; private set; }

    /// <summary>
    /// Referencia de navegación al usuario anfitrión que posee la propiedad, que es una relación de muchos a uno.
    /// </summary>
    public virtual User.User? Host { get; }

    /// <summary>
    /// Colección de URLs de imágenes asociadas a la propiedad, que se utiliza para mostrar fotos de la propiedad en la aplicación.
    /// </summary>
    private readonly List<string> _images = new();

    /// <summary>
    /// Propiedad de solo lectura que expone la colección de URLs de imágenes asociadas a la propiedad,
    /// permitiendo acceder a las imágenes sin permitir modificaciones directas a la colección desde fuera de la clase Property.
    /// </summary>
    public virtual IReadOnlyCollection<string> Images => _images.AsReadOnly();

    /// <summary>
    /// Colección de reservas asociadas a la propiedad, que se utiliza para gestionar las reservas realizadas para esta propiedad.
    /// </summary>
    private readonly List<Reservation> _reservations = new();

    /// <summary>
    /// Propiedad de solo lectura que expone la colección de reservas asociadas a la propiedad,
    /// permitiendo acceder a las reservas sin permitir modificaciones directas a la colección desde fuera de la clase Property.
    /// </summary>
    public virtual IReadOnlyCollection<Reservation> Reservations => _reservations.AsReadOnly();

    /// <summary>
    /// Colección de bloques de fechas asociados a la propiedad,
    /// que se utiliza para marcar fechas en las que la propiedad no está disponible para reservas,
    /// ya sea por mantenimiento, ocupación del anfitrión u otras razones.
    /// </summary>
    private readonly List<PropertyBlock> _blocks = new();

    /// <summary>
    /// Propiedad de solo lectura que expone la colección de bloques de fechas asociados a la propiedad,
    /// permitiendo acceder a los bloques sin permitir modificaciones directas a la colección desde fuera de la clase Property.
    /// </summary>
    public virtual IReadOnlyCollection<PropertyBlock> Blocks => _blocks.AsReadOnly();

    /// <summary>
    /// Colección de reseñas asociadas a la propiedad, que se utiliza para mostrar
    /// las opiniones y calificaciones de los huéspedes que han reservado la propiedad.
    /// </summary>
    private readonly List<Review> _reviews = new();

    /// <summary>
    /// Propiedad de solo lectura que expone la colección de reseñas asociadas a la propiedad,
    /// permitiendo acceder a las reseñas sin permitir modificaciones directas a la colección desde fuera de la clase Property.
    /// </summary>
    public virtual IReadOnlyCollection<Review> Reviews => _reviews.AsReadOnly();

    /// <summary>
    /// Constructor privado para Entity Framework, que es necesario para que EF pueda crear instancias de la clase Property
    /// </summary>
    private Property() { }

    /// <summary>
    /// Constructor público para crear una nueva instancia de la clase Property, que requiere todos los campos obligatorios
    /// </summary>
    /// <param name="title">El título de la propiedad</param>
    /// <param name="description">La descripción de la propiedad</param>
    /// <param name="location">La ubicación de la propiedad</param>
    /// <param name="pricePerNight">El precio por noche de la propiedad</param>
    /// <param name="capacity">La capacidad de la propiedad</param>
    /// <param name="hostId">El identificador del anfitrión que posee la propiedad</param>
    public Property(
        string title,
        string description,
        string location,
        decimal pricePerNight,
        int capacity,
        Guid hostId
    )
    {
        ValidateProperty(pricePerNight, capacity);

        Title = title;
        Description = description;
        Location = location;
        PricePerNight = pricePerNight;
        Capacity = capacity;
        HostId = hostId;
    }

    /// <summary>
    /// Método para actualizar los detalles de la propiedad, que permite modificar el título, descripción, ubicación,
    /// precio por noche y capacidad de la propiedad, con validaciones para asegurar que el precio por noche y la
    /// capacidad sean mayores que cero.
    /// </summary>
    /// <param name="title">El nuevo título de la propiedad</param>
    /// <param name="description">La nueva descripción de la propiedad</param>
    /// <param name="location">La nueva ubicación de la propiedad</param>
    /// <param name="pricePerNight">El nuevo precio por noche de la propiedad</param>
    /// <param name="capacity">La nueva capacidad de la propiedad</param>
    public void UpdateDetails(
        string title,
        string description,
        string location,
        decimal pricePerNight,
        int capacity
    )
    {
        ValidateProperty(pricePerNight, capacity);

        Title = title;
        Description = description;
        Location = location;
        PricePerNight = pricePerNight;
        Capacity = capacity;
    }

    /// <summary>
    /// Método privado para validar los detalles de la propiedad, que verifica que el precio
    /// por noche y la capacidad sean mayores que cero, lanzando una excepción
    /// DomainException si alguna de las validaciones falla.
    /// </summary>
    /// <param name="pricePerNight">El precio por noche de la propiedad</param>
    /// <param name="capacity">La capacidad de la propiedad</param>
    /// <exception cref="DomainException">Se lanza cuando el precio por noche o la capacidad no son válidos.</exception>
    private static void ValidateProperty(decimal pricePerNight, int capacity)
    {
        if (pricePerNight <= 0)
            throw new DomainException("El precio por noche debe ser mayor que cero.");

        if (capacity <= 0)
            throw new DomainException("La capacidad debe ser mayor que cero.");
    }

    /// <summary>
    /// Método para agregar una nueva imagen a la colección de imágenes de la propiedad,
    /// que verifica que la URL de la imagen no esté vacía o nula.
    /// </summary>
    /// <param name="imageUrl">La URL de la imagen a agregar</param>
    /// <exception cref="DomainException">Se lanza cuando la URL de la imagen está vacía o nula.</exception>
    public void AddImage(string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
            throw new DomainException("La URL de la imagen no puede estar vacía.");

        _images.Add(imageUrl);
    }

    /// <summary>
    /// Método para eliminar una imagen de la colección de imágenes de la propiedad
    /// </summary>
    /// <param name="imageUrl">La URL de la imagen a eliminar</param>
    public void RemoveImage(string imageUrl)
    {
        _images.Remove(imageUrl);
    }
}
