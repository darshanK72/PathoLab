using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PathoLabAPI.Models;

namespace PathoLabAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PathoLabDbContext _context;

        public AuthController(PathoLabDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null) return Unauthorized(new { message = "Invalid username or password" });
            
            // Simplified password check (in real app use hashing)
            if (user.PasswordHash != request.Password) return Unauthorized(new { message = "Invalid username or password" });

            return Ok(new { success = true, user = new { id = user.Id, username = user.Username, role = user.Role } });
        }

        [HttpGet("me")]
        public ActionResult GetCurrentUser()
        {
            // Simplified: return a mock user or check session/token
            return Ok(new { username = "admin", role = "admin" });
        }

        [HttpPost("logout")]
        public ActionResult Logout()
        {
            return Ok(new { success = true });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
