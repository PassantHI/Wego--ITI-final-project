using Data_Layer.Entities.StripeClasses;
using Stripe;
using Stripe.Checkout;

namespace Business_Layer.Services
{
    public interface IPaymentService
    {
        Task<Session> CreatePaymentSessionAsync(PaymentRequest request,string email,string baseUrl);
        
    }
}
