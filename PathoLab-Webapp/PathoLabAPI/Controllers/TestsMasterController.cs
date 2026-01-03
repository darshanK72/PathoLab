using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PathoLabAPI.Models;

namespace PathoLabAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestsMasterController : ControllerBase
    {
        private readonly PathoLabDbContext _context;

        public TestsMasterController(PathoLabDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestsMaster>>> GetTestsMaster()
        {
            return await _context.TestsMaster.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestsMaster>> GetTestsMaster(string id)
        {
            var testsMaster = await _context.TestsMaster.FindAsync(id);
            if (testsMaster == null) return NotFound();
            return testsMaster;
        }

        [HttpPost]
        public async Task<ActionResult<TestsMaster>> CreateTestsMaster(TestsMaster testsMaster)
        {
            if (string.IsNullOrEmpty(testsMaster.Id)) testsMaster.Id = "TEST-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            _context.TestsMaster.Add(testsMaster);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTestsMaster), new { id = testsMaster.Id }, testsMaster);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTestsMaster(string id, TestsMaster testsMaster)
        {
            if (id != testsMaster.Id) return BadRequest();
            _context.Entry(testsMaster).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TestsMasterExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTestsMaster(string id)
        {
            var testsMaster = await _context.TestsMaster.FindAsync(id);
            if (testsMaster == null) return NotFound();
            _context.TestsMaster.Remove(testsMaster);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TestsMasterExists(string id)
        {
            return _context.TestsMaster.Any(e => e.Id == id);
        }
    }
}
