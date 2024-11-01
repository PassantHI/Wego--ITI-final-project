namespace Data_Layer.Entities.StripeClasses
{
    public class PaymentRequest
    {
        public string BookingType { get; set; } // rooms/flights
        public string CancelUrl { get; set; }
        public string[] BookingIds { get; set; }
        public double Amount { get; set; }  
        public string Currency { get; set; }  
        public string ProductName { get; set; } 
        public int Quantity { get; set; }
        public string? Description { get; set; }
        public List<string>? Images { get; set; }

    }
}
