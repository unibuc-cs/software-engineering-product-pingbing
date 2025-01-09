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
                return BadRequest("No user id provided");
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
                return BadRequest("No user id provided");
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
    }
}
