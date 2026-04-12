using Guestly.Domain.Entities.User;

namespace Guestly.Application.Interfaces.Security;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
