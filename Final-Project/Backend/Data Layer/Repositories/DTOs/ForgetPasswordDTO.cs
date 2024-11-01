using System.ComponentModel.DataAnnotations;

namespace Data_Layer.Repositories.DTOs
{
    public class ForgetPasswordDTO
    {
        [Required]
        public string Email { get; set; }
    }
}
