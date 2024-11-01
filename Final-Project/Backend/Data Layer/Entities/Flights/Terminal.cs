using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data_Layer.Entities.Flights
{
    public class Terminal
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int AirportId { get; set; }
        [ForeignKey("AirportId")]
        public virtual Airport Airport { get; set; }

        [InverseProperty("DepartureTerminal")]
        public virtual ICollection<Flight> DepartureFlights { get; set; } = new List<Flight>();

        [InverseProperty("ArrivalTerminal")]
        public virtual ICollection<Flight> ArriveFlights { get; set; } = new List<Flight>();
    }
}
