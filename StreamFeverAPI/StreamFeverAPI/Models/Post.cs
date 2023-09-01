using System.ComponentModel.DataAnnotations;

namespace StreamFeverAPI.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public int GroupId { get; set; }
    }
}
