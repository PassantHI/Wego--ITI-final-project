namespace Data_Layer.Repositories.DTOs
{
    public class ChangePasswordDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }

    }
}
