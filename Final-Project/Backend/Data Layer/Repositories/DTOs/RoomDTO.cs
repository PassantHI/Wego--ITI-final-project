using Data_Layer.Entities.enums;
using System.ComponentModel.DataAnnotations;

namespace Data_Layer.Repositories.DTOs
{
    public class RoomDTO
    {
        public int? RoomID { get; set; }
        public string RoomDescribtion { get; set; }
        [Required]
        public string RoomTitle { get; set; }
        public string RoomAddress { get; set; }
        [Required]
        public string RoomOwner { get; set; }
        //public string RoomOwnerID { get; set; }

        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public int Price { get; set; }
        public int Rating { get; set; }
        [Required]
        public RoomType RoomType { get; set; }
        [Required]
        public bool IsActive { get; set; }
        public IList<RoomImagesDTO> Images { get; set; } = new List<RoomImagesDTO>();

    }

   
    public class RoomImagesDTO
    {
        public string URL { get; set; }

    }
}
