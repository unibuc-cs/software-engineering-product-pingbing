using Microsoft.AspNetCore.Identity;
using CollectifyAPI.Data;
using CollectifyAPI.Models;
using CollectifyAPI.Dtos;
using CollectifyAPI.Repositories;
using System.Security.Claims;
using AutoMapper;

namespace CollectifyAPI.Services
{
    public class GroupService
    {
        private readonly GroupRepository _groupRepository;
        private readonly UserManager<AppUser> _userManager;

        public GroupService(GroupRepository groupRepository, UserManager<AppUser> userManager)
        {
            _groupRepository = groupRepository;
            _userManager = userManager;
        }

        public async Task<NotesGroup> CreateGroupAsync(NotesGroup group)
        {
            return await _groupRepository.AddAsync(group);
        }
        
        public async Task<NotesGroup> UpdateGroupAsync(NotesGroup group)
        {
            await _groupRepository.Update(group);
            return group;
        }
        
        public async Task DeleteGroupAsync(NotesGroup group)
        {
            await _groupRepository.Delete(group);
        }

        public async Task AddMemberToGroupAsync(String userId, Guid groupId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            var group = await _groupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            await _groupRepository.AddMemberToGroupAsync(userId, groupId);
        }

        public async Task RemoveMemberFromGroupAsync(String userId, Guid groupId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            var group = await _groupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            await _groupRepository.RemoveMemberFromGroupAsync(userId, groupId);
        }


        public async Task<ICollection<GroupMember>> GetMembersByGroupIdAsync(Guid groupId)
        {
            var group = await _groupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            return await _groupRepository.GetMembersByGroupIdAsync(groupId);
        }

        public async Task<ICollection<NotesGroup>> GetGroupsByCreatorIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            return await _groupRepository.GetGroupsByCreatorIdAsync(userId);
        }

        public async Task<ICollection<NotesGroup>> GetGroupsByMemberIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found!");
            }

            return await _groupRepository.GetGroupsByMemberIdAsync(userId);
        }
    }
}
