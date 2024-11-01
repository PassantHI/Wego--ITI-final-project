using API.DTOs.AirlineDtos;
using API.DTOs.AirplaneDto;
using API.Mapper;
using Business_Layer.Services;
using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AirplanesController : ControllerBase
    {
        private readonly IUnitOfWork _unit;
        private readonly IGenericRepository<Airplane> _airplaneRepository;
        private readonly IAirplaneService _airplaneService;
        private readonly IMapper _mapper;
        public AirplanesController(IUnitOfWork unitOfWork, IAirplaneService airplaneService, IMapper mapper)
        {
            _unit = unitOfWork;
            _mapper = mapper;
            _airplaneRepository = _unit.AirplaneRepository;
            _airplaneService = airplaneService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int pageIndex = 1, int pageSize = 10, string search = "")
        {
            IEnumerable<Airplane> result = await _airplaneRepository
                .GetPaginatedAsync(pageIndex, pageSize,
                    a => string.IsNullOrEmpty(search) ||
                    a.Code.ToLower().Contains(search.ToLower())
                );

            var resCount = await _airplaneRepository
                .CountAsync(a => string.IsNullOrEmpty(search) ||
                a.Code.ToLower().Contains(search.ToLower()));

            var res = _mapper.ToAirplaneDtoList(result);

            return Ok(new { data = res, Total = resCount });
        }

        [HttpGet("{routeId:int}")]
        public async Task<IActionResult> GetById(int routeId)
        {
            var airplane = await _airplaneRepository.GetByIdAsync(routeId);
            if (airplane is { })
            {
                var res = _mapper.ToAirplaneDto(airplane);
                return Ok(res);
            }
            return NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> NewAirplane(AirplanePostDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var airplane = _mapper.FromAirplaneDto(dto);
            try
            {
                await _airplaneService.UpdateAirplaneFeaturesAsync(airplane, dto.FeatureNames);
                await _airplaneRepository.AddAsync(airplane);
                await _unit.CompleteAsync();
                await _airplaneService
                    .CreateAirplaneSeatsAsync(airplane,dto.EconomySeats,dto.BusinessSeats,dto.FirstClassSeats);
            }
            catch
            {
                return BadRequest(new { Message= "Error Ocurred while adding Airplane",
                PossibleErrors = new List<string>() {"Airline does not exist"}
                });
            }
            if (airplane.AirlineId is { })
                airplane.Airline = await _unit.AirlineRepository.GetByIdAsync(airplane.AirlineId.Value);
            var res = _mapper.ToAirplaneDto(airplane);

            return CreatedAtAction("GetById", new { routeId = airplane.Id }, res);
        }

        [HttpPut("{routeId:int}")]
        public async Task<IActionResult> UpdateAirplane(int routeId, AirplanePutDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (routeId != dto.Id)
                return BadRequest("Route id and Airplane Id did not match");

            var airplane = await _airplaneRepository.GetByIdAsync(dto.Id);
            if (airplane is not { })
                return NotFound();

            airplane.Code = dto.Code ?? airplane.Code;
            airplane.Type = dto.Type ?? airplane.Type;
            airplane.AirlineId = dto.AirlineId ?? airplane.AirlineId;

            if (dto.FeatureNames is { })
            {
                await _airplaneService.UpdateAirplaneFeaturesAsync(airplane,dto.FeatureNames);
            }
            try
            {
                await _airplaneRepository.UpdateAsync(airplane);
                await _unit.CompleteAsync();
            }
            catch
            {
                return BadRequest("Error ocurred while updating Airplane");
            }
            if (airplane.AirlineId is { })
                airplane.Airline = await _unit.AirlineRepository.GetByIdAsync(airplane.AirlineId.Value);


            var res = _mapper.ToAirplaneDto(airplane);

            return Ok(res);
        }

        [HttpDelete("{routeId:int}")]
        public async Task<IActionResult> DeleteAirplane(int routeId)
        {
            var airplane = await _airplaneRepository.GetByIdAsync(routeId);
            if (airplane is { })
            {
                if (airplane.Flights.Any())
                    return BadRequest("There are Flights Associated to this airplane, it can't be deleted");
                await _airplaneRepository.DeleteAsync(airplane);
                await _unit.CompleteAsync();
                return NoContent();
            }
            return NotFound();
        }

        [HttpGet("{routeId:int}/flights")]
        public async Task<IActionResult> AirplaneFlights(int routeId)
        {
            var airplane = await _airplaneRepository.GetByIdAsync(routeId);
            if (airplane is { })
            {
                var flights = airplane.Flights;
                var res = flights
                    .Select(f => new {
                        Id = f.Id,
                        DepartureTime = f.DepartureTime.ToString("hh:mm tt"),
                        ArrivalTime = f.ArrivalTime.ToString("hh:mm tt"),
                        DepartureAirport = f.DepartureTerminal.Airport.Name,
                        ArrivalAirport = f.ArrivalTerminal.Airport.Name,
                        From = f.DepartureTerminal.Airport.Location.Country,
                        To = f.ArrivalTerminal.Airport.Location.Country
                    });
                return Ok(res);
            }
            return NotFound();
        }

        //[HttpGet("{routeId:int}/features")]
        //public async Task<IActionResult> AirlineAirplanes(int routeId)
        //{
        //    var airplane = await _airplaneRepository.GetByIdAsync(routeId);
        //    if (airplane is { })
        //    {
        //        var features = airplane.Features;
        //        var res = features
        //            .Select(f => new {
        //                f.Id,
        //                f.Name,
        //                f.Description,
        //            });
        //        return Ok(res);
        //    }
        //    return NotFound();
        //}
    }
}
