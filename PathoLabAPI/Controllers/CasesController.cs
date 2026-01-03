using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PathoLabAPI.Models;

namespace PathoLabAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CasesController : ControllerBase
    {
        private readonly PathoLabDbContext _context;

        public CasesController(PathoLabDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Case>>> GetCases()
        {
            return await _context.Cases.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Case>> GetCase(string id)
        {
            var @case = await _context.Cases.FindAsync(id);
            if (@case == null) return NotFound();
            return @case;
        }

        [HttpPost]
        public async Task<ActionResult<Case>> CreateCase(Case @case)
        {
            if (string.IsNullOrEmpty(@case.Id)) @case.Id = "CASE-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            _context.Cases.Add(@case);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCase), new { id = @case.Id }, @case);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCase(string id, Case @case)
        {
            if (id != @case.Id) return BadRequest();
            _context.Entry(@case).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CaseExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCase(string id)
        {
            var @case = await _context.Cases.FindAsync(id);
            if (@case == null) return NotFound();
            _context.Cases.Remove(@case);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool CaseExists(string id)
        {
            return _context.Cases.Any(e => e.Id == id);
        }
    }
}
