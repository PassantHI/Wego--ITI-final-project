namespace Data_Layer.Repositories.DTOs
{
    public class ResetPasswordDTO
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public string Password { get; set; }
    }
}
