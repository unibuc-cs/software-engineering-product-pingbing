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
    [Route("api/groups")]
    public class GroupController : Controller
    {
        private readonly GroupService _groupService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GroupController(GroupService groupService, IHttpContextAccessor httpContextAccessor)
        {
            _groupService = groupService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        [Route("create_group")]
        [Authorize]
        public async Task<IActionResult> CreateGroup([FromBody] Group group)
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
                return Ok(await _groupService.CreateGroupAsync(group, userId));
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
        [Route("update_group")]
        [Authorize]
        public async Task<IActionResult> UpdateGroup([FromBody] Group group)
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
                return Ok(await _groupService.UpdateGroupAsync(group, userId));
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
        [Route("delete_group")]
        [Authorize]
        public async Task<IActionResult> DeleteGroup(Guid groupId)
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
                await _groupService.DeleteGroupAsync(groupId, userId);
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

        [HttpPost]
        [Route("add_member")]
        [Authorize]
        public async Task<IActionResult> AddMemberToGroup([FromBody] GroupMember groupMember)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_httpContextAccessor.HttpContext == null)
            {
                return NotFound();
            }

            try
            {
                await _groupService.AddMemberToGroupAsync(groupMember);
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

        [HttpDelete]
        [Route("remove_member")]
        [Authorize]
        public async Task<IActionResult> RemoveMemberFromGroup([FromBody] GroupMember groupMember)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_httpContextAccessor.HttpContext == null)
            {
                return NotFound();
            }

            try
            {
                await _groupService.RemoveMemberFromGroupAsync(groupMember);
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
        [Route("get_group_members")]
        [Authorize]
        public async Task<IActionResult> GetMembersByGroupId(Guid groupId)
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
                return Ok(await _groupService.GetMembersByGroupIdAsync(groupId));
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
        [Route("get_member_groups")]
        [Authorize]
        public async Task<IActionResult> GetGroupsByMemberId()
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
                return Ok(await _groupService.GetGroupsByMemberIdAsync(userId));
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
        [Route("get_owned_groups")]
        [Authorize]
        public async Task<IActionResult> GetGroupsByCreatorId()
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
                return Ok(await _groupService.GetGroupsByCreatorIdAsync(userId));
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
