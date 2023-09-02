using System.ComponentModel.DataAnnotations;

namespace StreamFeverAPI.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public int PostId { get; set; }
    }
}
