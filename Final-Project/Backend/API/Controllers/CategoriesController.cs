using API.DTOs.AirlineDtos;
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
    public class CategoriesController : ControllerBase
    {
        private readonly IUnitOfWork _unit;
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IMapper _mapper;
        public CategoriesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unit = unitOfWork;
            _mapper = mapper;
            _categoryRepository = _unit.CategoryRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int pageIndex = 1, int pageSize = 10, string search = "")
        {
            IEnumerable<Category> result = await _categoryRepository
                .GetPaginatedAsync(pageIndex, pageSize,
                    c => string.IsNullOrEmpty(search) ||
                    c.Name.ToLower().Contains(search.ToLower())
                );

            var resCount = await _categoryRepository
                .CountAsync(c => string.IsNullOrEmpty(search) ||
                    c.Name.ToLower().Contains(search.ToLower())
                );

            return Ok(new { data = result.Select(c=> new{c.Id,c.Name }), Total = resCount });
        }

        [HttpGet("{routeId:int}")]
        public async Task<IActionResult> GetById(int routeId)
        {
            var category = await _categoryRepository.GetByIdAsync(routeId);
            if (category is { })
            {
                return Ok(new {category.Id, category.Name});
            }
            return NotFound();
        }

        [HttpGet("{routeId:int}/locations")]
        public async Task<IActionResult> GetLocations(int routeId)
        {
            var category = await _categoryRepository.GetByIdAsync(routeId);
            if (category == null)
                return NotFound();
            var locations = category.Locations.Take(9);

            return Ok(locations.Select(l => new {l.City,l.Country,l.Image }));
        }

        [HttpPost]
        public async Task<IActionResult> NewCategory(string name)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var category = new Category() {Name = name};

            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();
            return Ok(new { category.Id, category.Name });
        }

        [HttpPut("{routeId:int}")]
        public async Task<IActionResult> UpdateCategory(int routeId,int id, string name)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (routeId != id)
                return BadRequest("Route id and Category Id did not match");

            var category = await _categoryRepository.GetByIdAsync(id);
            if (category is not { })
                return NotFound();

            category.Name = name ?? category.Name;

            try
            {
                await _categoryRepository.UpdateAsync(category);
                await _categoryRepository.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("Error ocurred while updating");
            }

            return Ok(new {category.Id, category.Name});
        }

        [HttpDelete("{routeId:int}")]
        public async Task<IActionResult> DeleteCategory(int routeId)
        {
            var category = await _categoryRepository.GetByIdAsync(routeId);
            if (category is { })
            {
                if (category.Locations.Any())
                    return BadRequest("You have to remove Locations associated with this Category first");

                await _categoryRepository.DeleteAsync(category);
                await _categoryRepository.SaveChangesAsync();
                return NoContent();
            }
            return NotFound();
        }

    }
}
