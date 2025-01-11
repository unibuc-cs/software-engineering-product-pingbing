using CollectifyAPI.Data;
using CollectifyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CollectifyAPI.Repositories
{
    public class GroupRepository : GenericRepository<Group>
    {
        public GroupRepository(ApplicationDbContext context) : base(context)
        {

        }
        
        public async Task<ICollection<Group>> GetGroupsByCreatorIdAsync(string userId)
        {
            return await _dbSet
                .Where(g => g.CreatorId == userId)
                .OrderByDescending(g => g.UpdatedAt)
                .Include(g => g.Notes)
                .ToListAsync();
        }

        public async Task<GroupMember> AddMemberToGroupAsync(string userId, Guid? groupId)
        {
            var groupMember = new GroupMember { MemberId = userId, GroupId = groupId };

            await _context.GroupMembers.AddAsync(groupMember);
            await SaveChangesAsync();

            return groupMember;
        }

        public async Task<bool> RemoveMemberFromGroupAsync(string userId, Guid? groupId)
        {
            var groupMember = await _context.GroupMembers
                .Where(gm => gm.MemberId == userId && gm.GroupId == groupId)
                .FirstOrDefaultAsync();
            if (groupMember != null)
            {
                _context.GroupMembers.Remove(groupMember);
                await SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<ICollection<GroupMember>> GetMembersByGroupIdAsync(Guid? groupId)
        {
            return await _context.GroupMembers
                .Where(gm => gm.GroupId == groupId)
                .Include(gm => gm.Member)
                .ToListAsync();
        }

        public async Task<ICollection<Group>> GetGroupsByMemberIdAsync(string userId)
        {
            return await _context.GroupMembers
                .Where(gm => gm.MemberId == userId)
                .Select(gm => gm.Group!)
                .ToListAsync();
        }
    }
}
