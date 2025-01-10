using Microsoft.AspNetCore.Identity;

namespace CollectifyAPI.Models
{
    public class AppUser : IdentityUser
    {
        public string? Nickname { get; set; }
        public string? AvatarPath { get; set; }

        public virtual ICollection<Note>? Notes { get; set; }
        public virtual ICollection<NotesGroup>? OwnedGroups { get; set; }
        public virtual ICollection<GroupMembers>? MemberGroups { get; set; }
    }
}
