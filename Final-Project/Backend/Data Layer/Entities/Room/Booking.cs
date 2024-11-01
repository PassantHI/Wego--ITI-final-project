using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Data_Layer.Context;
using Data_Layer.Entities.enums;
namespace Data_Layer.Entities.Room
{
    public class Booking
    {

        [Key]
        public int BookingId { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }

        public required DateTime BookingDate { get; set; } = DateTime.Now;

        public required int TotalPrice { get; set; }

        public required BookingStatus Status { get; set; }

        public virtual ApplicationUser User { get; set; }

        public virtual IList<RoomBookingDetails> RoomBookingDetails { get; set; } = new List<RoomBookingDetails>();
    }

}
