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
        // Gets the groups 
        public async Task<ICollection<Group>> GetGroupsByCreatorIdAsync(string userId)
        {
            return await _dbSet
                .Where(g => g.CreatorId == userId)
                .OrderByDescending(g => g.UpdatedAt)
                .Include(g => g.Notes)
                .ToListAsync();
        }

        public async Task<GroupMember> AddMemberToGroupAsync(String userId, Guid groupId)
        {
            var groupMember = new GroupMember { MemberId = userId, GroupId = groupId };
            await SaveChangesAsync();
            await _context.GroupMembers.AddAsync(groupMember);
            return groupMember;
        }

        public async Task RemoveMemberFromGroupAsync(String userId, Guid groupId)
        {
            var groupMember = await _context.GroupMembers
                .Where(gm => gm.MemberId == userId && gm.GroupId == groupId)
                .FirstOrDefaultAsync();
            if (groupMember != null)
            {
                _context.GroupMembers.Remove(groupMember);
                await SaveChangesAsync();
            }
        }

        public async Task<ICollection<GroupMember>> GetMembersByGroupIdAsync(Guid groupId)
        {
            return await _context.GroupMembers
                .Where(gm => gm.GroupId == groupId)
                .ToListAsync();
        }

        public async Task<ICollection<Group>> GetGroupsByMemberIdAsync(string userId)
        {
            return await _context.AppUsers
                .Where(u => u.Id == userId)
                .Include(u => u.Groups)
                    .ThenInclude(gm => gm.Group)
                .SelectMany(u => u.Groups.Select(gm => gm.Group))
                .ToListAsync();
        }
    }
}
