namespace Business_Layer.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string body);

    }
}
