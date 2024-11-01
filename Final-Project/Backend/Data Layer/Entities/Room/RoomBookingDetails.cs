using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Layer.Entities.Room
{
    public class RoomBookingDetails
    {
        [Key]
        public int RoomBookingId { get; set; }
        [ForeignKey("Booking")]
        public int BookingId { get; set; }

        [ForeignKey("Room")]
        public int RoomId { get; set; }

        [Required]
        public DateOnly Checkin { get; set; }
        [Required]
        public DateOnly Checkout { get; set; }
        public int Guests { get; set; }
        public virtual Room Room { get; set; }
        public virtual Booking Booking { get; set; }

    }
}
