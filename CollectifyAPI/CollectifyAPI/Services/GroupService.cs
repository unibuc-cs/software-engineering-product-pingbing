using Microsoft.AspNetCore.Identity;
using CollectifyAPI.Data;
using CollectifyAPI.Models;
using CollectifyAPI.Dtos;
using CollectifyAPI.Repositories;
using AutoMapper;

namespace CollectifyAPI.Services
{
    public class GroupService
    {
        private readonly GroupRepository _groupRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public GroupService(GroupRepository groupRepository, UserManager<AppUser> userManager, IMapper mapper)
        {
            _groupRepository = groupRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        public virtual async Task<SimpleGroup> CreateGroupAsync(Group group, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            group.CreatorId = userId;

            group = await _groupRepository.AddAsync(group);
            await _groupRepository.AddMemberToGroupAsync(userId, group.Id);

            return _mapper.Map<SimpleGroup>(group);
        }
        
        public virtual async Task<SimpleGroup> UpdateGroupAsync(Group updatedGroup, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            var group = await _groupRepository.GetByIdAsync(updatedGroup.Id);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            if (group.CreatorId != userId)
            {
                throw new ActionResponseExceptions.ForbiddenAccessException("You are not the owner of this group!");
            }

            group.Name = updatedGroup.Name;

            await _groupRepository.Update(group);

            return _mapper.Map<SimpleGroup>(group);
        }
        
        public virtual async Task DeleteGroupAsync(Guid groupId, string userId)
        {
            var group = await _groupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group owner not found!");
            }

            if (group.CreatorId != userId)
            {
                throw new ActionResponseExceptions.ForbiddenAccessException("You are not the owner of this group!");
            }

            await _groupRepository.Delete(group);
        }

        public virtual async Task AddMemberToGroupAsync(GroupMember groupMember)
        {
            if (groupMember.MemberId == null || groupMember.GroupId == null)
            {
                throw new ActionResponseExceptions.BadRequestException("MemberId and GroupId are required!");
            }

            var user = await _userManager.FindByIdAsync(groupMember.MemberId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            var group = await _groupRepository.GetByIdAsync(groupMember.GroupId);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            await _groupRepository.AddMemberToGroupAsync(groupMember.MemberId, groupMember.GroupId);
        }

        public virtual async Task RemoveMemberFromGroupAsync(GroupMember groupMember)
        {
            if (groupMember.MemberId == null || groupMember.GroupId == null)
            {
                throw new ActionResponseExceptions.BadRequestException("MemberId and GroupId are required!");
            }

            var user = await _userManager.FindByIdAsync(groupMember.MemberId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            var group = await _groupRepository.GetByIdAsync(groupMember.GroupId);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            var result = await _groupRepository.RemoveMemberFromGroupAsync(groupMember.MemberId, groupMember.GroupId);

            if (result)
            {
                return;
            }
            else
            {
                throw new ActionResponseExceptions.BadRequestException("Member removal failed!");
            }
        }

        public virtual async Task<ICollection<UserProfile>> GetMembersByGroupIdAsync(Guid groupId)
        {
            var group = await _groupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            var members = await _groupRepository.GetMembersByGroupIdAsync(groupId);

            return members.Select(m => new UserProfile
            {
                Id = m.MemberId,
                Nickname = m.Member!.Nickname,
                AvatarPath = m.Member.AvatarPath
            }).ToList();
        }

        public virtual async Task<ICollection<SimpleGroup>> GetGroupsByCreatorIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            var groups = await _groupRepository.GetGroupsByCreatorIdAsync(userId);
            return _mapper.Map<ICollection<SimpleGroup>>(groups);
        }

        public virtual async Task<ICollection<SimpleGroup>> GetGroupsByMemberIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            var groups = await _groupRepository.GetGroupsByMemberIdAsync(userId);

            return _mapper.Map<ICollection<SimpleGroup>>(groups);
        }

        public virtual async Task<SimpleGroup> GetGroupByIdAsync(Guid groupId, string userId)
        {
            var group = await _groupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            var members = await _groupRepository.GetMembersByGroupIdAsync(groupId);
            if (!members.Any(m => m.MemberId == userId))
            {
                throw new ActionResponseExceptions.ForbiddenAccessException("You are not a member of this group!");
            }

            return _mapper.Map<SimpleGroup>(group);
        }
    }
}
