using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Data_Layer.Context;
using Data_Layer.Entities.enums;
using Data_Layer.Entities.Flights;

namespace Data_Layer.Entities.Booking
{
    public class FlightBooking
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser? User { get; set; }

        public double? TotalPrice { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        [Required]
        public FlightBookingStatus Status { get; set; } = FlightBookingStatus.Pending;

        [Required]
        public DateTime BookingDate { get; set; } = DateTime.Now;

        public int FlightId { get; set; }

        [ForeignKey("FlightId")]
        public virtual Flight Flight { get; set; }

        public virtual ICollection<SeatReservation> SeatReservations { get; set; } = new List<SeatReservation>();
    }
}
