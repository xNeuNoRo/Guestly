using Guestly.Domain.Entities.Base;
using Guestly.Domain.Entities.Notifications;
using Guestly.Domain.Entities.Properties;
using Guestly.Domain.Entities.Reservations;
using Guestly.Domain.Entities.Reviews;
using Guestly.Domain.Entities.User;
using Guestly.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Guestly.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    private readonly IDateTimeProvider _dateTimeProvider;

    public AppDbContext(DbContextOptions<AppDbContext> options, IDateTimeProvider dateTimeProvider)
        : base(options)
    {
        _dateTimeProvider = dateTimeProvider;
    }

    // Tablas principales que tendremos en la BD
    public DbSet<User> Users { get; set; }
    public DbSet<UserToken> UserTokens { get; set; }
    public DbSet<Property> Properties { get; set; }
    public DbSet<PropertyBlock> PropertyBlocks { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Filtramos todas las entidades que hereden de BaseEntity y hayan sido modificadas o agregadas
        var entries = ChangeTracker.Entries<BaseEntity>();

        // Por cada entrada del ChangeTracker de EF Core
        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                // Si la entidad es nueva (Added), asignamos la fecha de creación (CreatedAt) con la fecha y hora actual en UTC
                case EntityState.Added:
                    entry.Entity.CreatedAt = _dateTimeProvider.UtcNow;
                    entry.Entity.UpdatedAt = _dateTimeProvider.UtcNow; // También asignamos UpdatedAt para nuevas entidades
                    break;
                // Si la entidad ha sido modificada (Modified),
                // asignamos la fecha de actualización (UpdatedAt) con la fecha y hora actual en UTC
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = _dateTimeProvider.UtcNow;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // En lugar de andar creando 1 por 1 cada configuración, buscamos todas
        // las clases que implementen IEntityTypeConfiguration<T> y las aplique automáticamente
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Configuración global para convertir todas las propiedades DateTime a UTC
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            // Buscamos todas las propiedades de tipo DateTime o DateTime? en cada entidad
            var properties = entityType
                .GetProperties()
                .Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?));

            // Para cada propiedad encontrada, le asignamos un ValueConverter
            // que se encargará de convertir las fechas a UTC al guardarlas y de marcar las fechas como UTC al leerlas
            foreach (var property in properties)
            {
                property.SetValueConverter(
                    new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<
                        DateTime,
                        DateTime
                    >(
                        v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(), // Al guardar: Forzar a UTC
                        v => DateTime.SpecifyKind(v, DateTimeKind.Utc) // Al leer: Marcar como UTC
                    )
                );
            }
        }
    }
}
