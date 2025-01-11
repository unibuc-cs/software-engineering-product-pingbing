using Microsoft.AspNetCore.Identity;
using CollectifyAPI.Data;
using CollectifyAPI.Models;
using CollectifyAPI.Dtos;
using CollectifyAPI.Repositories;
using CollectifyAPI.Helpers;
using AutoMapper;
using static Azure.Core.HttpHeader;

namespace CollectifyAPI.Services
{
    public class NoteService
    {
        private readonly NoteRepository _noteRepository;
        private readonly GroupRepository _groupRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public NoteService(NoteRepository noteRepository, GroupRepository groupRepository, UserManager<AppUser> userManager, IMapper mapper)
        {
            _noteRepository = noteRepository;
            _groupRepository = groupRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<SimpleNote> CreateNoteAsync(string userId, SimpleNote note)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Creator user does not exist!");
            }

            var newNote = _mapper.Map<Note>(note);

            if (newNote.Title != null)
            {
                newNote.Title = await Encrypter.Encrypt(newNote.Title);
            }
            if (newNote.Content != null)
            {
                newNote.Content = await Encrypter.Encrypt(newNote.Content);
            }

            newNote.CreatorId = userId;
            
            var addedNote = await _noteRepository.AddAsync(newNote);

            newNote.Id = addedNote.Id;

            return _mapper.Map<SimpleNote>(newNote);
        }

        public async Task<ICollection<SimpleNote>> GetOwnedNotesAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Note owner not found!");
            }

            var notes =  await _noteRepository.GetNotesByCreatorIdAsync(userId);

            var decryptedNotesTasks = notes
            .Select(async note => new SimpleNote
            {
                Id = note.Id,
                Title = await Encrypter.Decrypt(note.Title!),
                Content = await Encrypter.Decrypt(note.Content!),
                GroupId = note.GroupId,
                CreatedAt = note.CreatedAt,
                UpdatedAt = note.UpdatedAt
            });

            return await Task.WhenAll(decryptedNotesTasks);
        }

        public async Task<SimpleNote> UpdateNoteAsync(string userId, SimpleNote updatedNote)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Note owner not found!");
            }

            var note = await _noteRepository.GetByIdAsync(updatedNote.Id);
            if (note == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Note not found!");
            }

            if (userId != note.CreatorId && note.GroupId == null)
            {
                throw new ActionResponseExceptions.ForbiddenAccessException("You can't update this note!");

            }

            if (updatedNote.Title != null)
            {
                note.Title = await Encrypter.Encrypt(updatedNote.Title);
            }
            if (updatedNote.Content != null)
            {
                note.Content = await Encrypter.Encrypt(updatedNote.Content);
            }


            await _noteRepository.Update(note);

            return updatedNote;
        }

        public async Task DeleteNoteAsync(string userId, Guid id)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Note owner not found!");
            }

            var note = await _noteRepository.GetByIdAsync(id);
            if (note == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Note not found!");
            }

            if (userId != note.CreatorId && note.GroupId == null)
            {
                throw new ActionResponseExceptions.ForbiddenAccessException("You can't delete this note!");

            }

            await _noteRepository.Delete(note);
        }

        public async Task<SimpleNote> GetNoteAsync(Guid id, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Note owner not found!");
            }

            var note = await _noteRepository.GetByIdAsync(id);
            if (note == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Note not found!");
            }

            var simpleNote = _mapper.Map<SimpleNote>(note);

            simpleNote.Title = await Encrypter.Decrypt(note.Title!);
            simpleNote.Content = await Encrypter.Decrypt(note.Content!);

            return simpleNote;
        }

        public async Task<ICollection<SimpleNote>> GetNotesByGroupIdAsync(Guid groupId)
        {
            var group = await _groupRepository.GetByIdAsync(groupId);
            if (group == null)
            {
                throw new ActionResponseExceptions.NotFoundException("Group not found!");
            }

            var encryptedNotes = await _noteRepository.GetNotesByGroupIdAsync(groupId);
            
            var notesTasks = encryptedNotes
            .Select(async note => new SimpleNote
            {
                Id = note.Id,
                Title = await Encrypter.Decrypt(note.Title!),
                Content = await Encrypter.Decrypt(note.Content!),
                GroupId = note.GroupId,
                CreatedAt = note.CreatedAt,
                UpdatedAt = note.UpdatedAt
            });

            var notes = await Task.WhenAll(notesTasks);

            return _mapper.Map<ICollection<SimpleNote>>(notes);
        }
    }
}
