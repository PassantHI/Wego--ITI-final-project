using System.ComponentModel.DataAnnotations;

namespace API.DTOs.AirplaneDto
{
    public class AirplanePostDto
    {

        [Required]
        public string Code { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public int AirlineId { get; set; }
        [Required]
        public int EconomySeats { get; set; }
        [Required]
        public int FirstClassSeats { get; set; }
        [Required]
        public int BusinessSeats { get; set; }
        public IEnumerable<string> FeatureNames { get; set; } = [];
    }
}
