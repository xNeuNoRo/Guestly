using Guestly.Domain.Enums;
using Guestly.Domain.Interfaces;
using Guestly.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Guestly.Infrastructure.Services;

public class ReservationStatusUpdaterService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ReservationStatusUpdaterService> _logger;

    public ReservationStatusUpdaterService(
        IServiceProvider serviceProvider,
        ILogger<ReservationStatusUpdaterService> logger
    )
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Se ejecuta infinitamente mientras la API esté viva
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Creamos un scope para obtener servicios con vida corta (como DbContext)
                using var scope = _serviceProvider.CreateScope();
                // Obtenemos el DbContext y el proveedor de tiempo
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                // Obtenemos la hora actual para comparar con las fechas de las reservas
                var dateTimeProvider =
                    scope.ServiceProvider.GetRequiredService<IDateTimeProvider>();
                // Hora actual en UTC para evitar problemas de zonas horarias
                var now = dateTimeProvider.UtcNow;

                // Cancelamos reservas pendientes que ya pasaron 24 horas desde su creación
                var expiredPending = await dbContext
                    .Reservations.Where(r =>
                        r.Status == ReservationStatus.Pending && r.CreatedAt.AddHours(24) < now
                    )
                    .ToListAsync(stoppingToken);

                // Iteramos sobre todas las reservas que cumplen la condición y actualizamos su estado a Cancelada
                foreach (var res in expiredPending)
                    dbContext.Entry(res).Property(r => r.Status).CurrentValue =
                        ReservationStatus.Cancelled;

                // Buscamos reservas confirmadas que ya pasaron su fecha de check-out para marcarlas como completadas
                var completedReservations = await dbContext
                    .Reservations.Where(r =>
                        r.Status == ReservationStatus.Confirmed && r.CheckOutDate < now
                    )
                    .ToListAsync(stoppingToken);

                // Iteramos sobre todas las reservas que cumplen la condición y actualizamos su estado a Completada
                foreach (var res in completedReservations)
                    dbContext.Entry(res).Property(r => r.Status).CurrentValue =
                        ReservationStatus.Completed;

                // Guardar si hubo cambios
                if (expiredPending.Any() || completedReservations.Any())
                {
                    await dbContext.SaveChangesAsync(stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar estados de reservas");
            }

            // Esperamos un intervalo antes de volver a ejecutar la lógica (por ejemplo, cada hora)
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}
