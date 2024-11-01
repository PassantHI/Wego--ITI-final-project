using System.ComponentModel.DataAnnotations;

namespace Data_Layer.Repositories.DTOs
{
    public class DetailsDTO
    {
        
        public int RoomBookingId { get; set; }
        public int BookingId { get; set; }
        public int RoomId { get; set; }

        [Required]
        public DateOnly Checkin { get; set; }
        [Required]
        public DateOnly Checkout { get; set; }
        public int Guests { get; set; }
        public BookingDTO Booking { get; set; }
       
    }
}
