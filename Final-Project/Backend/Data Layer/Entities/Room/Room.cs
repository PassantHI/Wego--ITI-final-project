using Data_Layer.Entities.enums;
using System.ComponentModel.DataAnnotations;


namespace Data_Layer.Entities.Room
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }

        public required string RoomDescribtion { get; set; }

        public required string RoomTitle { get; set; }
        public required string RoomAddress { get; set; }

        public required string RoomOwner { get; set; }
        //public required string RoomOwnerId { get; set; }

        public required string City { get; set; }

        public required string Country { get; set; }

        public required int Price { get; set; }
        public required int Rating { get; set; }

        public required RoomType RoomType { get; set; }

        public required bool IsActive { get; set; } //status

        public virtual IList<Images> Images { get; set; } = new List<Images>();


        public virtual IList<RoomBookingDetails> RoomBookingDetails { get; set; } = new List<RoomBookingDetails>();

    }

}
