using CollectifyAPI.Data;
using CollectifyAPI.Models;

namespace CollectifyAPI.Repositories
{
    public class NoteRepository : GenericRepository<Note>
    {
        public NoteRepository(ApplicationDbContext context) : base(context)
        {

        }
    }
}
