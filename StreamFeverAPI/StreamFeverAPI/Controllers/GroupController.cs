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
        public async Task<ActionResult<Group>> GetGroup([FromRoute] int id)
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

        [HttpGet("{userId}/created")]
        public async Task<ActionResult<IEnumerable<Group>>> CreatedGroups([FromRoute] int userId)
        {
            var groups = await _context.Groups
                .Where(g => g.UserId == userId)
                .ToListAsync();

            if (!groups.Any())
            {
                return NotFound(new
                {
                    Message = "No Groups Created!"
                });
            }

            return Ok(groups);
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

        [HttpGet("{userId}/joined")]
        public async Task<ActionResult<IEnumerable<Group>>> JoinedGroups([FromRoute] int userId)
        {
            var userGroups = await _context.UserGroups
                .Where(ug => ug.UserId == userId)
                .ToListAsync();

            if (!userGroups.Any())
            {
                return NotFound(new
                {
                    Message = "No Groups Joined!"
                });
            }

            var groupIds = userGroups.Select(ug => ug.GroupId).ToList();
            var groups = await _context.Groups
                .Where(g => groupIds.Contains(g.Id))
                .ToListAsync();

            return Ok(groups);
        }

        [HttpDelete("leave/{userId}/{groupId}")]
        public async Task<IActionResult> LeaveGroup([FromRoute] int userId, int groupId)
        {
            var userGroup = await _context.UserGroups.
                FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GroupId == groupId);

            if (userGroup == null)
            {
                return NotFound(new
                {
                    Message = "User In Group Not Found!"
                });
            }

            _context.UserGroups.Remove(userGroup);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Group Left Succesfully!"
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
