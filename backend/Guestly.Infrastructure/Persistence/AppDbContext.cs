using Guestly.Domain.Entities.Notifications;
using Guestly.Domain.Entities.Properties;
using Guestly.Domain.Entities.Reservations;
using Guestly.Domain.Entities.Reviews;
using Guestly.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace Guestly.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    // Tablas principales que tendremos en la BD
    public DbSet<User> Users { get; set; }
    public DbSet<UserToken> UserTokens { get; set; }
    public DbSet<Property> Properties { get; set; }
    public DbSet<PropertyBlock> PropertyBlocks { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // En lugar de andar creando 1 por 1 cada configuración, buscamos todas
        // las clases que implementen IEntityTypeConfiguration<T> y las aplique automáticamente
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
