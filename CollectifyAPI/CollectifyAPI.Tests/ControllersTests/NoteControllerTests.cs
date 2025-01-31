using Moq;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using CollectifyAPI.Controllers;
using CollectifyAPI.Services;
using CollectifyAPI.Dtos;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Security.Claims;
using System;
using System.Collections.Generic;
using CollectifyAPI.Helpers;
using CollectifyAPI.Data;

namespace CollectifyAPI.Tests
{
    public class NoteControllerTests
    {
        private readonly Mock<NoteService> _mockNoteService;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;
        private readonly NoteController _noteController;

        public NoteControllerTests()
        {
            _mockNoteService = new Mock<NoteService>(MockBehavior.Strict, null, null, null, null);
            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            _noteController = new NoteController(_mockNoteService.Object, _mockHttpContextAccessor.Object);
        }

        private void SetUpHttpContext(string? userId)
        {
            var claims = userId != null ? new[] { new Claim(ClaimTypes.NameIdentifier, userId) } : new Claim[] { };
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));
            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });
        }

        // ✅ Positive Tests
        [Fact]
        public async Task GetOwnedNotes_ValidRequest_ReturnsOk()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            _mockNoteService.Setup(service => service.GetOwnedNotesAsync(userId)).ReturnsAsync(new List<SimpleNote>());

            var result = await _noteController.GetOwnedNotes();

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.IsType<List<SimpleNote>>(okResult.Value);
        }

        [Fact]
        public async Task CreateNote_ValidRequest_ReturnsOk()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            var newNote = new SimpleNote { Id = Guid.NewGuid(), Title = "Test Note", Content = "Test Content" };
            _mockNoteService.Setup(service => service.CreateNoteAsync(userId, newNote)).ReturnsAsync(newNote);

            var result = await _noteController.CreateNote(newNote);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<SimpleNote>(okResult.Value);
            Assert.Equal(newNote.Title, returnValue.Title);
        }

        [Fact]
        public async Task UpdateNote_ValidRequest_ReturnsOk()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            var updatedNote = new SimpleNote { Id = Guid.NewGuid(), Title = "Updated Note", Content = "Updated Content" };
            _mockNoteService.Setup(service => service.UpdateNoteAsync(userId, updatedNote)).ReturnsAsync(updatedNote);

            var result = await _noteController.UpdateNote(updatedNote);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<SimpleNote>(okResult.Value);
            Assert.Equal(updatedNote.Title, returnValue.Title);
        }

        [Fact]
        public async Task DeleteNote_ValidRequest_ReturnsOk()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            var noteId = Guid.NewGuid();
            _mockNoteService.Setup(service => service.DeleteNoteAsync(userId, noteId)).Returns(Task.CompletedTask);

            var result = await _noteController.DeleteNote(noteId);

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task GetNote_ValidRequest_ReturnsOk()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            var noteId = Guid.NewGuid();
            var note = new SimpleNote { Id = noteId, Title = "Test Note", Content = "Test Content" };
            _mockNoteService.Setup(service => service.GetNoteAsync(noteId, userId)).ReturnsAsync(note);

            var result = await _noteController.GetNote(noteId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<SimpleNote>(okResult.Value);
            Assert.Equal(note.Title, returnValue.Title);
        }

        [Fact]
        public async Task GetNotesFromGroup_ValidRequest_ReturnsOk()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            var groupId = Guid.NewGuid();
            var notes = new List<SimpleNote> { new SimpleNote { Id = Guid.NewGuid(), Title = "Group Note", Content = "Group Content" } };
            _mockNoteService.Setup(service => service.GetNotesByGroupIdAsync(groupId)).ReturnsAsync(notes);

            var result = await _noteController.GetNotesFromGroup(groupId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.IsType<List<SimpleNote>>(okResult.Value);
        }

        // ❌ Negative Tests

        [Fact]
        public async Task CreateNote_UnauthorizedUser_ReturnsBadRequest()
        {
            SetUpHttpContext(null); // No user authenticated

            var result = await _noteController.CreateNote(new SimpleNote());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task UpdateNote_UserNotOwner_ReturnsForbidden()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            var updatedNote = new SimpleNote { Id = Guid.NewGuid(), Title = "Updated Note" };

            _mockNoteService.Setup(service => service.UpdateNoteAsync(userId, updatedNote))
                .ThrowsAsync(new ActionResponseExceptions.ForbiddenAccessException("You can't update this note!"));

            var result = await _noteController.UpdateNote(updatedNote);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(403, objectResult.StatusCode);
        }

        [Fact]
        public async Task DeleteNote_NoteNotFound_ReturnsNotFound()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            var noteId = Guid.NewGuid();

            _mockNoteService.Setup(service => service.DeleteNoteAsync(userId, noteId))
                .ThrowsAsync(new ActionResponseExceptions.NotFoundException("Note not found!"));

            var result = await _noteController.DeleteNote(noteId);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(404, objectResult.StatusCode);
        }

        [Fact]
        public async Task GetNote_NoteNotFound_ReturnsNotFound()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            var noteId = Guid.NewGuid();

            _mockNoteService.Setup(service => service.GetNoteAsync(noteId, userId))
                .ThrowsAsync(new ActionResponseExceptions.NotFoundException("Note not found!"));

            var result = await _noteController.GetNote(noteId);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(404, objectResult.StatusCode);
        }

        [Fact]
        public async Task GetNotesFromGroup_GroupNotFound_ReturnsNotFound()
        {
            var userId = "user123";
            SetUpHttpContext(userId);
            var groupId = Guid.NewGuid();

            _mockNoteService.Setup(service => service.GetNotesByGroupIdAsync(groupId))
                .ThrowsAsync(new ActionResponseExceptions.NotFoundException("Group not found!"));

            var result = await _noteController.GetNotesFromGroup(groupId);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(404, objectResult.StatusCode);
        }
    }
}
