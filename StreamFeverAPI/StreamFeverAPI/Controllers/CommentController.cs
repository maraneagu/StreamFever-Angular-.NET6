using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamFeverAPI.Context;
using StreamFeverAPI.Models;

namespace StreamFeverAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CommentController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment([FromRoute] int id)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
            {
                return NotFound(new
                {
                    Message = "Comment Not Found!"
                });
            }

            return Ok(new
            {
                Comment = comment
            });
        }

        [HttpGet("post/{postId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments([FromRoute] int postId)
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == postId)
                .ToListAsync();

            if (!comments.Any())
            {
                return NotFound(new
                {
                    Message = "No Comments Added!"
                });
            }

            return Ok(comments);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateComment([FromBody] Comment commentBody)
        {
            commentBody.Date = DateTime.Now;

            await _context.Comments.AddAsync(commentBody);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Comment Created Succesfully!"
            });
        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditComment([FromBody] Comment commentBody)
        {
            var comment = await _context.Comments.
                FirstOrDefaultAsync(c => c.Id == commentBody.Id);

            if (comment == null)
            {
                return NotFound(new
                {
                    Message = "Comment Not Found!"
                });
            }

            comment.Content = commentBody.Content;
            comment.Date = DateTime.Now;

            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Comment Updated Succesfully!"
            });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.
                FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
            {
                return NotFound(new
                {
                    Message = "Comment Not Found!"
                });
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Comment Deleted Succesfully!"
            });
        }
    }
}
