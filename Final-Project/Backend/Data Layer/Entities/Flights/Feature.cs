using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Data_Layer.Entities.Flights
{
    public class Feature
    {
        [Key]
        public int Id { get; set; }

        public bool Meal { get; set; } = false;
        public bool Wifi { get; set; } = false ;
        public bool Video { get; set; } = false ;
        public bool Usb { get; set; } = false ;

        [JsonIgnore]
        public int AirplaneId { get; set; }
        [ForeignKey("AirplaneId")]
        [JsonIgnore]
        public virtual Airplane Airplane { get; set; }
    }
}
