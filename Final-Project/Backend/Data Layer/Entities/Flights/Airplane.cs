using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data_Layer.Entities.Flights
{
    public class Airplane
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public string Type { get; set; }

        public int? AirlineId { get; set; }
        [ForeignKey("AirlineId")]
        public virtual Airline? Airline { get; set; }

        public virtual Feature Feature { get; set; }
        public virtual ICollection<Flight> Flights { get; set; } = new List<Flight>();

        public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}
