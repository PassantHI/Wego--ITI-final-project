using System.ComponentModel.DataAnnotations;

namespace API.DTOs.AirportDtos
{
    public class AirportPostDto
    {

        [Required]
        public string Name { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public int LocationId { get; set; }

    }
}
