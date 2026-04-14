namespace Guestly.Application.Interfaces.Security;

public interface IRandomTokenGenerator
{
    string Generate(int length = 32);
}
