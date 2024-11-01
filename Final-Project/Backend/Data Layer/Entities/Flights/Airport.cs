using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data_Layer.Entities.Flights
{
    public class Airport
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public int LocationId { get; set; }
        [ForeignKey("LocationId")]
        public virtual Location Location { get; set; }

        public virtual ICollection<Terminal> Terminals { get; set; } = new List<Terminal>();
    }
}
