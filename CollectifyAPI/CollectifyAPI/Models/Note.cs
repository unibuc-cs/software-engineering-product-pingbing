namespace CollectifyAPI.Models
{
    public class Note : BaseEntity
    {
        public string? Title { get; set; }
        public string? Content { get; set; }

        public string? CreatorId { get; set; }
        public virtual AppUser? Creator { get; set; }

        public Guid? GroupId { get; set; }
        public virtual NotesGroup? Group { get; set; }
    }
}
