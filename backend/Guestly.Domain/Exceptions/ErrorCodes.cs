namespace Guestly.Domain.Exceptions;

/// <summary>
/// Clase estática que define constantes para los códigos de error utilizados en la aplicación,
/// lo que permite una gestión de errores más consistente y estructurada al proporcionar
/// códigos de error predefinidos para diferentes tipos de errores comunes en la aplicación,
/// como errores generales, errores relacionados con usuarios y autenticación, errores de propiedades,
/// errores de reservas y fechas, y errores de notificaciones, facilitando así la identificación
/// y manejo de errores específicos en la aplicación.
/// </summary>
public static class ErrorCodes
{
    // -----------------------------
    // Errores Generales
    // -----------------------------
    public const string BadRequest = "BAD_REQUEST";
    public const string InternalServerError = "INTERNAL_SERVER_ERROR";
    public const string NotFound = "NOT_FOUND";
    public const string Unauthorized = "UNAUTHORIZED";
    public const string Forbidden = "FORBIDDEN";
    public const string ResourceConflict = "RESOURCE_CONFLICT";
    public const string ValidationError = "VALIDATION_ERROR";

    // -----------------------------
    // Usuarios y Autenticación
    // -----------------------------
    public const string UserNotFound = "USER_NOT_FOUND";
    public const string EmailAlreadyExists = "EMAIL_ALREADY_EXISTS";
    public const string AccountAlreadyConfirmed = "ACCOUNT_ALREADY_CONFIRMED";
    public const string TokenExpired = "TOKEN_EXPIRED";
    public const string InvalidCredentials = "INVALID_CREDENTIALS";
    public const string InvalidToken = "INVALID_TOKEN";

    // ------------------------------
    // Propiedades
    // ------------------------------
    public const string PropertyNotFound = "PROPERTY_NOT_FOUND";
    public const string InvalidPropertyPrice = "INVALID_PROPERTY_PRICE";
    public const string InvalidPropertyCapacity = "INVALID_PROPERTY_CAPACITY";
    public const string PropertyAccessDenied = "PROPERTY_ACCESS_DENIED";

    // -----------------------------
    // Bloques de Fechas
    // -----------------------------
    public const string PropertyBlockNotFound = "PROPERTY_BLOCK_NOT_FOUND";

    // -----------------------------
    // Reservas y Fechas
    // -----------------------------
    public const string ReservationNotFound = "RESERVATION_NOT_FOUND";
    public const string ReservationAccessDenied = "RESERVATION_ACCESS_DENIED";
    public const string InvalidDateRange = "INVALID_DATE_RANGE";
    public const string PastDateNotAllowed = "PAST_DATE_NOT_ALLOWED";
    public const string DatesUnavailable = "DATES_UNAVAILABLE";
    public const string InvalidReservationStatus = "INVALID_RESERVATION_STATUS";

    // -----------------------------
    // Reseñas
    // -----------------------------
    public const string ReviewNotFound = "REVIEW_NOT_FOUND";
    public const string ReviewAlreadyExists = "REVIEW_ALREADY_EXISTS";
    public const string ReviewAccessDenied = "REVIEW_ACCESS_DENIED";

    // -----------------------------
    // Notificaciones
    // -----------------------------
    public const string NotificationNotFound = "NOTIFICATION_NOT_FOUND";
}
