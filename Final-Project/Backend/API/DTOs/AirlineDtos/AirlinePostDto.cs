using System.ComponentModel.DataAnnotations;

namespace API.DTOs.AirlineDtos
{
    public class AirlinePostDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public IFormFile Image { get; set; }

    }
}
