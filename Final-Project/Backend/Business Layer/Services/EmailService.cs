using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace Business_Layer.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string email, string subject, string body)
        {
            var fromEmail = "dentaltest616@gmail.com"; // Sender's Gmail address
            var fromPassword = "zulu xdpq uhyf tjtn";// App password 
            var smtpclient = new SmtpClient()
            {
                Host = "smtp.gmail.com",
                Port = 587,
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Credentials = new NetworkCredential(fromEmail, fromPassword),
                EnableSsl = true
            };

            var mailmassege = new MailMessage
            {
                From = new MailAddress("dentaltest616@gmail.com"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };


            mailmassege.To.Add(email);

            await smtpclient.SendMailAsync(mailmassege);
        }

    }
}
