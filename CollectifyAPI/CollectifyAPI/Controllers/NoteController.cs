using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        [Route("update_note/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateNote(Guid id, SimpleNote updatedNote)
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
                return Ok(await _noteService.UpdateNoteAsync(userId, id, updatedNote));
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
        [Route("delete_note/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteNote(Guid id)
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
                await _noteService.DeleteNoteAsync(userId, id);
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
        [Route("get_note/{id}")]
        [Authorize]
        public async Task<IActionResult> GetNote(Guid id)
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
                return Ok(await _noteService.GetNoteAsync(id, userId));
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
