using System.ComponentModel.DataAnnotations;

namespace StreamFeverAPI.Models
{
    public class Session
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public int UserId { get; set; }
    }
}
