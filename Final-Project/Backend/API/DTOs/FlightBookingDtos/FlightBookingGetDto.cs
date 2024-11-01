namespace API.DTOs.FlightBookingDtos
{
    public class FlightBookingGetDto
    {
        public int Id { get; set; }
        public string User { get; set; }
        public string PaymentMethod { get; set; }
        public string Status { get; set; }
        public string BookingDate { get; set; }
        public double? TotalPrice { get; set; }
        public string DepartureCity { get; set; }
        public string ArrivalCity { get; set; }
        public string DepartureTime { get; set; }
        public string DepartureDate { get; set; }
        public string ArrivalTime { get; set; }
        public string ArrivalDate { get; set; }
        public virtual ICollection<string> SeatNumbers { get; set; } = [];

    }
}
