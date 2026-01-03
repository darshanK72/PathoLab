using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PathoLabAPI.Models;

namespace PathoLabAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly PathoLabDbContext _context;

        public SettingsController(PathoLabDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Setting>>> GetSettings()
        {
            return await _context.Settings.ToListAsync();
        }

        [HttpGet("{key}")]
        public async Task<ActionResult<Setting>> GetSetting(string key)
        {
            var setting = await _context.Settings.FindAsync(key);
            if (setting == null) return NotFound();
            return setting;
        }

        [HttpPut("{key}")]
        public async Task<IActionResult> UpdateSetting(string key, Setting setting)
        {
            if (key != setting.Key) return BadRequest();
            _context.Entry(setting).State = EntityState.Modified;
            try
            {
                if (!_context.Settings.Any(s => s.Key == key))
                {
                    _context.Settings.Add(setting);
                }
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return NoContent();
        }
    }
}
