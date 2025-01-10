namespace CollectifyAPI.Models
{
    public class Group : BaseEntity
    {
        public string? Name { get; set; }
        public string? CreatorId { get; set; }
        public virtual AppUser? Creator { get; set; }
        
        public virtual ICollection<Note>? Notes { get; set; }
        public virtual ICollection<GroupMember>? Members { get; set; }
    }
}
