using API.DTOs.TerminalDTOs;
using API.Mapper;
using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerminalsController : ControllerBase
    {
        private readonly IUnitOfWork _unit;
        private readonly IGenericRepository<Terminal> _terminalRepository;
        private readonly IGenericRepository<Airport> _airportRepository;
        private readonly IMapper _mapper;

        public TerminalsController(IUnitOfWork unit, IMapper mapper)
        {
            _unit = unit;
            _terminalRepository = unit.TerminalRepository;
            _airportRepository = unit.AirportRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int pageIndex = 1, int pageSize = 10, string search = "")
        {
            IEnumerable<Terminal> terminals = await _terminalRepository.GetPaginatedAsync(
                pageIndex, pageSize,
                a => string.IsNullOrEmpty(search) ||
                a.Name.Contains(search, StringComparison.OrdinalIgnoreCase)
                );

            var totalTerminalsCount = await _terminalRepository.CountAsync(
                a => string.IsNullOrEmpty(search) ||
                a.Name.Contains(search, StringComparison.OrdinalIgnoreCase)
                );

            var terminalDtoList = _mapper.ToTerminalDtoList(terminals);

            return Ok(new { data = terminalDtoList, total = totalTerminalsCount });
        }

        [HttpGet("{routeId:int}")]
        public async Task<IActionResult> GetById(int routeId)
        {
            var terminal = await _terminalRepository.GetByIdAsync(routeId);

            if (terminal is not { })
                return NotFound();

            var TerminalDto = _mapper.ToTerminalDto(terminal);

            return Ok(TerminalDto);
        }

        [HttpPost]
        public async Task<IActionResult> Add(TerminalPostDto terminalPostDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var terminal = _mapper.FromTerminalDto(terminalPostDto);
            try
            {
                await _terminalRepository.AddAsync(terminal);
                await _terminalRepository.SaveChangesAsync();
            }
            catch
            {
                BadRequest("Error occured on saving");
            }
            terminal.Airport = await _airportRepository.GetByIdAsync(terminal.AirportId);
            var terminalDto = _mapper.ToTerminalDto(terminal);

            return CreatedAtAction("GetById", new { routeId = terminalDto.Id }, terminalDto);
        }

        [HttpPut("{routeId:int}")]
        public async Task<IActionResult> Update(int routeId, TerminalPutDto terminalPutDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (routeId != terminalPutDto.Id)
                return BadRequest("Route Id and Terminal Id did not match");

            var terminal = await _terminalRepository.GetByIdAsync(terminalPutDto.Id);

            if (terminal is not { })
                return NotFound();

            terminal.Name = terminalPutDto.Name ?? terminal.Name;
            terminal.AirportId = terminalPutDto.AirportId ?? terminal.AirportId;

            try
            {
                await _terminalRepository.UpdateAsync(terminal);
                await _terminalRepository.SaveChangesAsync();
            }
            catch
            {
                BadRequest("Error occured on saving");
            }
            terminal.Airport = await _airportRepository.GetByIdAsync(terminal.AirportId);

            var terminalDto = _mapper.ToTerminalDto(terminal);
            return CreatedAtAction("GetById", new { routeId = terminalDto.Id }, terminalDto);
        }

        [HttpDelete("{routeId:int}")]
        public async Task<IActionResult> Delete(int routeId)
        {
            var terminal = await _terminalRepository.GetByIdAsync(routeId);
            if (terminal is not { })
                return NotFound();
            if (terminal.DepartureFlights.Any() || terminal.ArriveFlights.Any())
                return BadRequest("You have to remove Flights associated with this terminal first");

            try
            {
                await _terminalRepository.DeleteAsync(terminal);
                await _terminalRepository.SaveChangesAsync();
            }
            catch
            {
                BadRequest("Error occured on saving");
            }
            return NoContent();
        }
    }
}