using System.ComponentModel.DataAnnotations;

namespace Data_Layer.Entities.Flights
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public virtual ICollection<Location> Locations { get; set; } = new List<Location>();
    }
}
