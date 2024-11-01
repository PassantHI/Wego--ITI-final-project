using System.ComponentModel.DataAnnotations;

namespace API.DTOs.AirportDtos
{
    public class AirportPutDto
    {
        [Required]
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? Code { get; set; }

        public int? LocationId { get; set; }

    }
}
