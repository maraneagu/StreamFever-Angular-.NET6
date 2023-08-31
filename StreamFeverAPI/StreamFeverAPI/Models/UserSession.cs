using System.ComponentModel.DataAnnotations;

namespace StreamFeverAPI.Models
{
    public class UserSession
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public int SessionId { get; set; }
    }
}
