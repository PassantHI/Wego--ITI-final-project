using AutoMapper;
using Data_Layer.Entities.Room;
using Data_Layer.Repositories.DTOs;


namespace API.Mapping
{
    public class MappingProfil :Profile
    {
        public MappingProfil()
        {
            CreateMap<Room,RoomDTO>().ReverseMap();
            CreateMap<Images, RoomImagesDTO>().ReverseMap();
            CreateMap<RoomBookingDetails, DetailsDTO>().ReverseMap();
            CreateMap<Booking, BookingDTO>().ReverseMap();
        }
    }
}
 