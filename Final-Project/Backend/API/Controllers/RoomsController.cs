using AutoMapper;
using Data_Layer.Entities.Room;
using Data_Layer.Repositories;
using Data_Layer.Repositories.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController(IRoomRepository roomRepository, IMapper mapper) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDTO>>> GetAll() 
        {
            var Rooms = await roomRepository.GetListAsync();
            if (Rooms!=null && Rooms.Any()) 
            {
                return Ok(Rooms);
            }
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDTO>> GetById(int id) 
        {
            var room= await roomRepository.GetByIdAsync(id);
            if (room!=null) return Ok(room);
            return NotFound();
        
        }

        [HttpGet("filter/{country}")]
        public async Task<ActionResult<RoomDTO>> Filter(string country , int type)
        {
            var rooms=await roomRepository.FilterRooms(country,type);
            if (rooms != null && rooms.Any())
            {
                return Ok(rooms);
            }
            return NotFound();

        }

        //[HttpPost]

        //public async Task<ActionResult<RoomDTO>> AddRoom(RoomDTO roomdto) 
        //{
        //    if (ModelState.IsValid) 
        //    {
        //       var result = await roomRepository.AddRoomAsync(roomdto);
        //        if(result) return Ok(roomdto);  
        //    }
        //    return BadRequest();
        
        
        //}

        //[HttpPut]

        //public async Task<ActionResult<RoomDTO>> Update(RoomDTO roomdto)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var result = await roomRepository.UpdateRoomAsync(roomdto);
        //        if (result) { return Ok(roomdto); }
        //        else return BadRequest("cant update");

        //    }

        //    return BadRequest();
        //}

        [HttpDelete]
        public async Task<ActionResult> Delete(int roomId)
        {
            var res = await roomRepository.DeleteRoomAsync(roomId);
            if (res) { return Ok("deleted"); }
            return BadRequest();
        }


        [HttpPost("dashboard/room/create")]
        public async Task<ActionResult> CreateRoom(RoomDTO roomDto)
        {
            if (roomDto == null) return NotFound("not Found Room");
            var room = await roomRepository.AddRoomDashboardAsync(roomDto);
            if (await roomRepository.SaveAllAsync()) return Ok(room.RoomId);
            return NotFound();
        }

        [HttpPut("dashboard/room/{id}")]
        public async Task<ActionResult> UpdateRoom(int id, [FromBody] RoomDTO roomDto)
        {
            var room = await roomRepository.GetByIdAsync(id);
            if (room == null) return NotFound("the room is not found");
            var roomUpdate = mapper.Map<Room>(roomDto);
            roomRepository.UpdateRoom(roomUpdate);
            if (await roomRepository.SaveAllAsync()) return NoContent();
            return NotFound();
        }

        [HttpDelete("dashboard/delete/{id}")]
        public async Task<ActionResult> DeleteRoom(int id)
        {
            var room = await roomRepository.GetRoomWithIdAsync(id);
            if (room is null) return NotFound();
            roomRepository.DeleteRoom(room);
            if (await roomRepository.SaveAllAsync()) return Ok();
            return NotFound();
        }
    }
}
