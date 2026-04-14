using Guestly.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Guestly.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Nombre de la tabla
        builder.ToTable("Users");

        // Config de la PK
        builder.HasKey(u => u.Id);

        builder.Property(u => u.FirstName).IsRequired().HasMaxLength(255);
        builder.Property(u => u.LastName).IsRequired().HasMaxLength(255);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(255);
        builder.Property(u => u.Password).IsRequired();
        builder.Property(u => u.Role).IsRequired();
        builder.Property(u => u.IsEmailConfirmed).IsRequired();

        // Configuración de la relación con UserToken
        builder
            .Metadata.FindNavigation(nameof(User.Tokens))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);

        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.UpdatedAt);
    }
}
