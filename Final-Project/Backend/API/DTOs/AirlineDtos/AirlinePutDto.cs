using System.ComponentModel.DataAnnotations;

namespace API.DTOs.AirlineDtos
{
    public class AirlinePutDto
    {
        [Required]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public IFormFile? Image { get; set; }
    }
}
