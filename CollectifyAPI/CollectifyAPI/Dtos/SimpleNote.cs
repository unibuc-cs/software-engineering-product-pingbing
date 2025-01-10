using CollectifyAPI.Models;

namespace CollectifyAPI.Dtos
{
    public class SimpleNote
    {
        public Guid? Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public Guid? GroupId { get; set; }
    }
}
