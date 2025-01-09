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
    [Route("api/account")]
    public class AccountController : Controller
    {
        private readonly TokenService _tokenService;
        private readonly AccountService _accountService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountController(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager, TokenService tokenService, AccountService accountService, IHttpContextAccessor httpContextAccessor)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _accountService = accountService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] UserCreditentials userCreditentials)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _accountService.RegisterAsync(userCreditentials, _userManager);
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }

            return Ok();
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] UserCreditentials userCreditentials)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            LoginTokens tokens;

            try
            {
                tokens = await _accountService.LoginAsync(userCreditentials, _userManager, _signInManager);
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }

            return Ok(tokens);
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromBody] LoginTokens tokens)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                tokens = await _accountService.RefreshAsync(tokens, _userManager, _tokenService);
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }

            return Ok(tokens);
        }

        [HttpGet]
        [Route("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
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

            var userProfile = new UserProfile();

            try
            {
                userProfile = await _accountService.GetUserProfileAsync(_userManager, userId);
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }

            return Ok(userProfile);
        }

        [HttpPost]
        [Route("edit_profile")]
        [Authorize]
        public async Task<IActionResult> EditProfile([FromForm] UserProfile userProfile, IFormFile? avatar)
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
                userProfile = await _accountService.EditUserProfileAsync(_userManager, userId, userProfile, avatar);
            }
            catch (ActionResponseExceptions.BaseException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }
            return Ok(userProfile);
        }
    }
}
