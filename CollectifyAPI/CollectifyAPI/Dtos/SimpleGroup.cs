namespace CollectifyAPI.Dtos
{
    public class SimpleGroup
    {
        public Guid? Id { get; set; }
        public string? Name { get; set; }
        public string? CreatorId { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
