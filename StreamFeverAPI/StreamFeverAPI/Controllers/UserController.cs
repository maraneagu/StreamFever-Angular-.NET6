using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamFeverAPI.Context;
using StreamFeverAPI.Models;

namespace StreamFeverAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User userBody)
        {
            if (userBody == null)
            {
                return BadRequest();
            }

            var user = await _context.Users.
                FirstOrDefaultAsync(u => u.Username == userBody.Username && u.Password == userBody.Password);
            if (user == null)
            {
                return NotFound(new
                {
                    Message = "User Not Found!"
                });
            }

            return Ok(new
            {
                Message = "Login Succesful!"
            });
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User userBody)
        {
            if (userBody == null)
            {
                return BadRequest();
            }

            await _context.Users.AddAsync(userBody);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Signup Succesful!"
            });
        }
    }
}
