using System.ComponentModel.DataAnnotations;

namespace CollectifyAPI.Models
{
    public class GroupMember : BaseEntity
    {
        [Required]
        public string? MemberId { get; set; }
        public virtual AppUser? Member { get; set; }

        [Required]
        public Guid? GroupId { get; set; }
        public virtual Group? Group { get; set; }
    }
}
