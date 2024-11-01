using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Data_Layer.Entities.enums;
using Data_Layer.Entities.Booking;

namespace Data_Layer.Entities.Flights
{
    public class Seat
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Number { get; set; }

        [Required]
        public SeatClass Class { get; set; } = SeatClass.Economy;

        [Required]
        public bool IsAvailable { get; set; } = true;

        [Required]
        public int AirplaneId { get; set; }

        [ForeignKey("AirplaneId")]
        public virtual Airplane Airplane { get; set; }

        public virtual ICollection<SeatReservation> SeatReservations { get; set; } = new List<SeatReservation>();

    }
}
