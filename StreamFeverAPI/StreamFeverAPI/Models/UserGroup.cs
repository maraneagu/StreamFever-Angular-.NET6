using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StreamFeverAPI.Models
{
    public class UserGroup
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public int GroupId { get; set; }
    }
}
