using System.ComponentModel.DataAnnotations;

namespace API.DTOs.AirplaneDto
{
    public class AirplanePutDto
    {
        [Required]
        public int Id { get; set; }

        public string? Code { get; set; }

        public string? Type { get; set; }

        public int? AirlineId { get; set; }

        public IEnumerable<string>? FeatureNames { get; set; } = null;
    }
}
