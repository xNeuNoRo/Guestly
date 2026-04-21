using System.Text;
using System.Text.Json.Serialization;
using Guestly.API.Extensions;
using Guestly.API.Middlewares;
using Guestly.Application;
using Guestly.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Registramos el servicio de OpenAPI (Swagger) para documentación de la API
builder.Services.AddOpenApi();

// Inyectamos las capas personalizadas que hemos creado previamente
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Configuramos CORS para permitir solicitudes desde el frontend
// Usando los origenes permitidos definidos en el archivo de appsettings
// En caso de que no se encuentre se permite solo desde localhost:3000 (que es donde corre el frontend de next.js)
var allowedOrigins =
    builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? ["http://localhost:3000"];

// Le decimos a CORS que permita solicitudes desde los origenes definidos
builder.Services.AddCors(options =>
{
    // Definimos una politica de CORS llamada "DefaultPolicy"
    options.AddPolicy(
        "DefaultPolicy",
        policy =>
        {
            // Configuramos la politica para permitir solicitudes desde los origenes definidos
            policy
                .WithOrigins(allowedOrigins)
                .AllowAnyHeader() // Permite cualquier header en las solicitudes CORS
                .AllowAnyMethod() // Permite cualquier metodo HTTP (GET, POST, PUT, DELETE, etc.) en las solicitudes CORS
                .AllowCredentials(); // Permite el uso de cookies y otras credenciales en las solicitudes CORS
        }
    );
});

// Configuramos el enrutamiento para que las URLs de los endpoints sean en minúsculas,
// lo que es una buena práctica para la consistencia y legibilidad de las URLs
builder.Services.AddRouting(options => options.LowercaseUrls = true);

// Configuramos la respuesta de error personalizada para los casos en que el modelo de datos no sea válido
// (por ejemplo, si faltan campos requeridos o si los datos no cumplen con las validaciones definidas en los DTOs)
builder
    .Services.AddControllers(options =>
    {
        // Configuramos los mensajes de error personalizados para las validaciones de model binding,
        // utilizando el metodo de extension que definimos en MvcOptionsExtensions
        options.ConfigureModelBindingMessages();
    })
    .AddJsonOptions(options =>
    {
        // Configuramos el serializador JSON para que convierta los enums a sus representaciones en cadena,
        // en lugar de usar sus valores numéricos, lo que hace que las respuestas de la API
        // sean más legibles y fáciles de entender para los consumidores de la API
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        // Configuramos la respuesta de error personalizada para los casos en que el modelo de datos no sea válido,
        // utilizando el metodo de extension que definimos en ApiBehaviorOptionsExtensions
        options.ConfigureInvalidModelStateResponse();
    });

// Registramos la autenticación mediante JWT
builder
    .Services.AddAuthentication(options =>
    {
        // Configuramos el esquema de autenticación predeterminado para que sea JWT Bearer,
        // lo que significa que la aplicación esperará recibir un token JWT en las solicitudes para autenticar a los usuarios
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        // Configuramos los parámetros de validación del token JWT, como el emisor, la audiencia, la clave de firma, etc.
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Habilitamos la validación del emisor del token para asegurarnos de que el token proviene de una fuente confiable
            ValidateIssuer = true,
            // Habilitamos la validación de la audiencia del token para asegurarnos de que el token está destinado a nuestra aplicación
            ValidateAudience = true,
            // Habilitamos la validación de la fecha de expiración del token para asegurarnos de que el token no ha expirado
            ValidateLifetime = true,
            // Habilitamos la validación de la firma del token para asegurarnos de que el token no ha sido alterado y es legítimo
            ValidateIssuerSigningKey = true,
            // Configuramos el emisor válido del token, que debe coincidir con el valor definido en el archivo de configuración (appsettings)
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            // Configuramos la audiencia válida del token, que debe coincidir con el valor definido en el archivo de configuración (appsettings)
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            // Configuramos la clave de firma que se utilizará para validar la firma del token JWT,
            // utilizando una clave simétrica generada a partir de una cadena secreta definida en
            // el archivo de configuración (appsettings)
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]!)
            ),
        };
    });

// Construimos la aplicación a partir de la configuración y servicios registrados
var app = builder.Build();

// Configuramos el pipeline de procesamiento de las solicitudes HTTP

// Aqui agregamos nuestro middleware personalizado para manejar excepciones de manera centralizada en toda la aplicación
app.UseMiddleware<ExceptionMiddleware>();

// Si estamos en desarrollo, habilitamos la documentación de la API con Swagger/OpenAPI
if (app.Environment.IsDevelopment())
{
    // Mapeamos el endpoint para la documentación de la API,
    // lo que nos permitirá acceder a ella a través de una URL específica (por ejemplo, /swagger o /openapi)
    app.MapOpenApi();

    // Mapeamos el endpoint para la referencia de la API,
    // lo que nos permitirá acceder a una página con ejemplos de cómo consumir la API
    // y ver la estructura de las solicitudes y respuestas
    app.MapScalarApiReference("/docs");
}

// Habilitamos CORS con la politica "DefaultPolicy" que definimos anteriormente, para permitir solicitudes desde el frontend
app.UseCors("DefaultPolicy");

// Redirigimos todas las solicitudes HTTP a HTTPS para mayor seguridad
app.UseHttpsRedirection();

// Habilitamos la autenticación para que el sistema reconozca quién hace la petición leyendo el token JWT
app.UseAuthentication();

// Habilitamos la autorización, aunque en este punto no hemos configurado nada relacionado a la autorización, es una buena práctica tenerlo en el pipeline (por si acaso) por si se necesita en el futuro
app.UseAuthorization();

// Mapeamos los controladores para que puedan manejar las solicitudes HTTP entrantes
app.MapControllers();

// Finalmente, ejecutamos la aplicación, lo que pone en marcha el servidor web y comienza a escuchar las solicitudes HTTP
await app.RunAsync();
