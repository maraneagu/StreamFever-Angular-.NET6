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

        [HttpGet("{id}")]
        public async Task<ActionResult<Group>> GetGroupById([FromRoute] int id)
        {
            var group = await _context.Groups.FirstOrDefaultAsync(g => g.Id == id);

            if (group == null)
            {
                return NotFound(new
                {
                    Message = "Group Not Found!"
                });
            }

            return Ok(new
            {
                Group = group
            });
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

        [HttpPut("edit")]
        public async Task<IActionResult> EditGroup([FromBody] Group groupBody)
        {
            var group = await _context.Groups.
                FirstOrDefaultAsync(g => g.Id == groupBody.Id);

            if (group == null)
            {
                return NotFound(new
                {
                    Message = "Group Not Found!"
                });
            }

            group.Name = groupBody.Name;
            group.Description = groupBody.Description;

            _context.Groups.Update(group);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Group Updated Succesfully!"
            });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var group = await _context.Groups.
                FirstOrDefaultAsync(g => g.Id == id);

            if (group == null)
            {
                return NotFound(new
                {
                    Message = "Group Not Found!"
                });
            }

            _context.Groups.Remove(group);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Group Deleted Succesfully!"
            });
        }

        [HttpPost("join")]
        public async Task<IActionResult> JoinGroup([FromBody] UserGroup userGroupBody)
        {
            var user = await _context.Users.
                FirstOrDefaultAsync(u => u.Id == userGroupBody.UserId);

            if (user == null)
            {
                return NotFound(new
                {
                    Message = "User Not Found!"
                });
            }

            var group = await _context.Groups.
                FirstOrDefaultAsync(g => g.Id == userGroupBody.GroupId);

            if (group == null)
            {
                return NotFound(new
                {
                    Message = "Group Not Found!"
                });
            }

            await _context.UserGroups.AddAsync(userGroupBody);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Group Joined Succesfully!"
            });
        }

        [HttpPost("user")]
        public async Task<ActionResult<bool>> UserInGroup([FromBody] UserGroup userGroupBody)
        {
            var userGroup = await _context.UserGroups.
                FirstOrDefaultAsync(ug => ug.UserId == userGroupBody.UserId && ug.GroupId == userGroupBody.GroupId);

            if (userGroup == null)
            {
                return false;
            }
            return true;
        }
    }
}
