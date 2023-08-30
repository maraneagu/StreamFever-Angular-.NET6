using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamFeverAPI.Context;
using StreamFeverAPI.Models;

namespace StreamFeverAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SessionController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpGet]
        public async Task<ActionResult<Session>> GetSessions()
        {
            return Ok(await _context.Sessions.ToListAsync());
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateSession([FromBody] Session sessionBody)
        {
            string userToken = HttpContext.Request.Headers["Authorization"];

            if (!string.IsNullOrWhiteSpace(userToken) && userToken.StartsWith("Bearer "))
            {
                userToken = userToken.Substring("Bearer ".Length).Trim();
            }
            else
            {
                return Unauthorized();
            }

            var user = await _context.Users.
                FirstOrDefaultAsync(u => u.Token == userToken);

            sessionBody.UserId = user.Id;

            await _context.Sessions.AddAsync(sessionBody);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Session Created Succesfully!"
            });
        }
    }
}
