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

        [HttpGet("{id}")]
        public async Task<ActionResult<Session>> GetSessionById([FromRoute] int id)
        {
            var session = await _context.Sessions.FirstOrDefaultAsync(s => s.Id == id);

            if (session == null)
            {
                return NotFound(new
                {
                    Message = "Session Not Found!"
                });
            }

            return Ok(new
            {
                Session = session
            });
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

        [HttpGet("{userId}/created")]
        public async Task<ActionResult<IEnumerable<Session>>> CreatedSessions([FromRoute] int userId)
        {
            var sessions = await _context.Sessions
                .Where(s => s.UserId == userId)
                .ToListAsync();

            if (!sessions.Any())
            {
                return NotFound(new
                {
                    Message = "No Sessions Found!"
                });
            }

            return Ok(sessions);
        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditSession([FromBody] Session sessionBody)
        {
            var session = await _context.Sessions.
                FirstOrDefaultAsync(s => s.Id == sessionBody.Id);

            if (session == null)
            {
                return NotFound(new
                {
                    Message = "Session Not Found!"
                });
            }

            session.Title = sessionBody.Title;
            session.Description = sessionBody.Description;
            session.Date = sessionBody.Date;
            session.Time = sessionBody.Time;

            _context.Sessions.Update(session);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Session Updated Succesfully!"
            });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var session = await _context.Sessions.
                FirstOrDefaultAsync(s => s.Id == id);

            if (session == null)
            {
                return NotFound(new
                {
                    Message = "Session Not Found!"
                });
            }

            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Session Deleted Succesfully!"
            });
        }

        [HttpPost("attend")]
        public async Task<IActionResult> AttendSession([FromBody] UserSession userSessionBody)
        {
            var user = await _context.Users.
                FirstOrDefaultAsync(u => u.Id == userSessionBody.UserId);

            if (user == null)
            {
                return NotFound(new
                {
                    Message = "User Not Found!"
                });
            }

            var session = await _context.Sessions.
                FirstOrDefaultAsync(s => s.Id == userSessionBody.SessionId);

            if (session == null)
            {
                return NotFound(new
                {
                    Message = "Session Not Found!"
                });
            }

            await _context.UserSessions.AddAsync(userSessionBody);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Session Attended Succesfully!"
            });
        }

        [HttpGet("{userId}/attended")]
        public async Task<ActionResult<IEnumerable<Session>>> AttendedSessions([FromRoute] int userId)
        {
            var userSessions = await _context.UserSessions
               .Where(us => us.UserId == userId)
               .ToListAsync();

            if (!userSessions.Any())
            {
                return NotFound(new
                {
                    Message = "No Sessions Joined!"
                });
            }

            var sessionIds = userSessions.Select(us => us.SessionId).ToList();
            var sessions = await _context.Sessions
                .Where(s => sessionIds.Contains(s.Id))
                .ToListAsync();

            return Ok(sessions);
        }

        [HttpPost("user")]
        public async Task<ActionResult<bool>> UserInSession([FromBody] UserSession userSessionBody)
        {
            var userSession = await _context.UserSessions.
                FirstOrDefaultAsync(us => us.UserId == userSessionBody.UserId && us.SessionId == userSessionBody.SessionId);

            if (userSession == null)
            {
                return false;
            }
            return true;
        }
    }
}
