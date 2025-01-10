using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CollectifyAPI.Models
{
    public class UserRefreshToken : BaseEntity
    {
        public string? UserId { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? Expiration { get; set; }
    }
}
