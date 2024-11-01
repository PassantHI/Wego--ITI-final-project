using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Data_Layer.Entities.Flights;

namespace Data_Layer.Entities.Booking
{
    public class SeatReservation
    {
        [Key]
        public int Id { get; set; }

        public int? SeatId { get; set; }

        [ForeignKey("SeatId")]
        public virtual Seat? Seat { get; set; }

        [Required]
        public int FlightBookingId { get; set; }
        [ForeignKey("FlightBookingId")]
        public virtual FlightBooking FlightBooking { get; set; }
    }
}
