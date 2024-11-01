using System.ComponentModel.DataAnnotations;

namespace Data_Layer.Entities.Flights
{
    public class Airline
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Code { get; set; }
        public string? Image { get; set; }

        public virtual ICollection<Flight> Flights { get; set; } = new List<Flight>();

        public virtual ICollection<Airplane> Airplanes { get; set; } = new List<Airplane>();
    }
}
