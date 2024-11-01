using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace Data_Layer.Entities.Room
{
    public class Images
    {
        [Key]
        public int ImageId { get; set; }
        public required string URL { get; set; }

        [ForeignKey("Room")]
        public int RoomId { get; set; }
        public virtual Room Room { get; set; }
    }
}
