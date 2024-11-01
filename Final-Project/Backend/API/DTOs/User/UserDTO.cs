using Data_Layer.Context;

namespace API.DTOs.User
{
    public class UserDTO
    {
        public string Id { get; set; }
        public string UserName { get; set; }

        public static ApplicationUser MapToUser(UserDTO userDTO)
        {
            ApplicationUser user = new ApplicationUser()
            {
                UserName = userDTO.UserName,
            };
            return user;
        }
        public static UserDTO MapToUserDTO(ApplicationUser user)
        {
            UserDTO userDTO = new UserDTO()
            {
                Id = user.Id,
                UserName = user.UserName,
            };
            return userDTO;
        }
    }
}