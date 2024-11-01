
using Data_Layer.Entities.enums;

namespace Data_Layer.Repositories.DTOs
{
    public class BookingDTO
    {
       
        public int? BookingId { get; set; }

        public string? UserId { get; set; }

        public required int TotalPrice { get; set; } 

        public BookingStatus Status { get; set; } = BookingStatus.Pending;


    }
}
