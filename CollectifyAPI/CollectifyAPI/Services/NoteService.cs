using Microsoft.AspNetCore.Identity;
using CollectifyAPI.Data;
using CollectifyAPI.Models;
using CollectifyAPI.Dtos;
using CollectifyAPI.Repositories;
using CollectifyAPI.Helpers;
using AutoMapper;

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

        public async Task<SimpleNote> CreateNoteAsync(String userId, SimpleNote note)
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
            
            await _noteRepository.AddAsync(newNote);

            return note;
        }

        public async Task<Note> UpdateNoteAsync(Note note)
        {
            await _noteRepository.Update(note);
            return note;
        }

        public async Task DeleteNoteAsync(Note note)
        {
            await _noteRepository.Delete(note);
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
                GroupId = note.GroupId
            });

            return await Task.WhenAll(decryptedNotesTasks);
        }
    }
}
