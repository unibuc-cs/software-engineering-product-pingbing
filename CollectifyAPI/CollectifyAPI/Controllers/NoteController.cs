﻿using Microsoft.AspNetCore.Mvc;
using CollectifyAPI.Data;
using CollectifyAPI.Models;
using CollectifyAPI.Services;
using CollectifyAPI.Dtos;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CollectifyAPI.Controllers
{
    [ApiController]
    [Route("api/notes")]
    public class NoteController : Controller
    {
        private readonly NoteService _noteService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NoteController(NoteService noteService, IHttpContextAccessor httpContextAccessor)
        {
            _noteService = noteService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        [Route("owned_notes")]
        [Authorize]
        public async Task<IActionResult> GetOwnedNotes()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_httpContextAccessor.HttpContext == null)
            {
                return NotFound();
            }

            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return BadRequest("You are not logged in!");
            }

            try
            {
                return Ok(await _noteService.GetOwnedNotesAsync(userId));
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("add_note")]
        [Authorize]
        public async Task<IActionResult> CreateNote(SimpleNote note)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_httpContextAccessor.HttpContext == null)
            {
                return NotFound();
            }

            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return BadRequest("You are not logged in!");
            }

            try
            {
                return Ok(await _noteService.CreateNoteAsync(userId, note));
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("update_note")]
        [Authorize]
        public async Task<IActionResult> UpdateNote([FromBody] SimpleNote updatedNote)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_httpContextAccessor.HttpContext == null)
            {
                return NotFound();
            }

            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return BadRequest("You are not logged in!");
            }

            try
            {
                return Ok(await _noteService.UpdateNoteAsync(userId, updatedNote));
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete_note")]
        [Authorize]
        public async Task<IActionResult> DeleteNote(Guid noteId)
        {
            if (_httpContextAccessor.HttpContext == null)
            {
                return NotFound();
            }

            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return BadRequest("You are not logged in!");
            }

            try
            {
                await _noteService.DeleteNoteAsync(userId, noteId);
                return Ok();
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }
        }

        [HttpGet]
        [Route("get_note")]
        [Authorize]
        public async Task<IActionResult> GetNote(Guid noteId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_httpContextAccessor.HttpContext == null)
            {
                return NotFound();
            }

            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return BadRequest("You are not logged in!");
            }

            try
            {
                return Ok(await _noteService.GetNoteAsync(noteId, userId));
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }
        }

        [HttpGet]
        [Route("get_notes_from_group")]
        [Authorize]
        public async Task<IActionResult> GetNotesFromGroup(Guid groupId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_httpContextAccessor.HttpContext == null)
            {
                return NotFound();
            }
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return BadRequest("You are not logged in!");
            }
            try
            {
                return Ok(await _noteService.GetNotesByGroupIdAsync(groupId));
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }
        }
    }
}
