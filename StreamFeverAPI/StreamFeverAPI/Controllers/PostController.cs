using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamFeverAPI.Context;
using StreamFeverAPI.Models;

namespace StreamFeverAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PostController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost([FromRoute] int id)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new
                {
                    Message = "Post Not Found!"
                });
            }

            return Ok(new
            {
                Post = post
            });
        }

        [HttpGet("group/{groupId}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts([FromRoute] int groupId)
        {
            var posts = await _context.Posts
            .Where(p => p.GroupId == groupId)
            .OrderByDescending(p => p.Date)
            .ToListAsync();

            if (!posts.Any())
            {
                return NotFound(new
                {
                    Message = "No Posts Created!"
                });
            }

            return Ok(posts);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePost([FromBody] Post postBody)
        {
            postBody.Date = DateTime.Now;

            await _context.Posts.AddAsync(postBody);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Post Created Succesfully!"
            });
        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditPost([FromBody] Post postBody)
        {
            var post = await _context.Posts.
                FirstOrDefaultAsync(p => p.Id == postBody.Id);

            if (post == null)
            {
                return NotFound(new
                {
                    Message = "Post Not Found!"
                });
            }

            post.Description = postBody.Description;
            post.Date = DateTime.Now;

            _context.Posts.Update(post);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Post Updated Succesfully!"
            });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.
                FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new
                {
                    Message = "Post Not Found!"
                });
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Post Deleted Succesfully!"
            });
        }
    }
}
