using Microsoft.AspNetCore.Identity;
using CollectifyAPI.Data;
using CollectifyAPI.Models;
using CollectifyAPI.Dtos;
using CollectifyAPI.Repositories;
using System.Security.Claims;
using AutoMapper;

namespace CollectifyAPI.Services
{
    public class NoteService
    {
        private readonly NoteRepository _noteRepository;

        public NoteService(NoteRepository noteRepository)
        {
            _noteRepository = noteRepository;
        }

        public async Task<Note> CreateNoteAsync(Note note)
        {
            return await _noteRepository.AddAsync(note);
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
    }
}
