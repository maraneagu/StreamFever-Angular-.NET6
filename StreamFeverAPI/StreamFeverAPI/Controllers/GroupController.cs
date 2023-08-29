using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using StreamFeverAPI.Context;
using StreamFeverAPI.Models;

namespace StreamFeverAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly AppDbContext _context;
        public GroupController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpGet]
        public async Task<ActionResult<Group>> GetGroups()
        {
            return Ok(await _context.Groups.ToListAsync());
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateGroup([FromBody] Group groupBody)
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

            groupBody.UserId = user.Id;

            await _context.Groups.AddAsync(groupBody);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Group Created Succesfully!"
            });
        }
    }
}
