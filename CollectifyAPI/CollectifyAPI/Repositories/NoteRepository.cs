using CollectifyAPI.Data;
using CollectifyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CollectifyAPI.Repositories
{
    public class NoteRepository : GenericRepository<Note>
    {
        public NoteRepository(ApplicationDbContext context) : base(context)
        {
            
        }

        public async Task<ICollection<Note>> GetNotesByUserIdAsync(string userId)
        {
            return await _dbSet
                .Where(n => n.CreatorId == userId)
                .OrderByDescending(n => n.UpdatedAt)
                .ToListAsync();
        }

        public async Task<ICollection<Note>> GetNotesByGroupIdAsync(Guid groupId)
        {
            return await _dbSet
                .Where(n => n.GroupId == groupId)
                .OrderByDescending(n => n.UpdatedAt)
                .ToListAsync();
        }
    }
}
