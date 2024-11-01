using Data_Layer.Entities.StripeClasses;
using Stripe;
using Stripe.Checkout;

namespace Business_Layer.Services
{
    public class PaymentService:IPaymentService
    {
        public async Task<Session> CreatePaymentSessionAsync(PaymentRequest request,string email, string baseUrl)
        {
            var options = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)request.Amount * 100,  // Amount in cents
                            Currency = request.Currency,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.ProductName,
                                Description = request.Description ?? "N/A",
                                Images = request.Images,
                            },
                    },
                        Quantity = request.Quantity,
                    },
                },
                Mode = "payment",
                CustomerEmail = email,
                Metadata = new Dictionary<string, string>
                {
                    {"BookingType",request.BookingType},{"BookingId",string.Join(',',request.BookingIds)},
                },
                SuccessUrl = $"{baseUrl}/account/dashboard/{request.BookingType}",  
                CancelUrl = request.CancelUrl, 
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);
            return session;
        }
    }
}
