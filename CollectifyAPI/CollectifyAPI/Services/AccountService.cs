using Microsoft.AspNetCore.Identity;
using CollectifyAPI.Data;
using CollectifyAPI.Models;
using CollectifyAPI.Dtos;
using System.Security.Claims;

namespace CollectifyAPI.Services
{
    public class AccountService
    {
        private readonly TokenService _tokenService;

        public AccountService(TokenService tokenService) 
        {
            _tokenService = tokenService;
        }

        public async Task RegisterAsync(UserCreditentials userCreditentials, UserManager<AppUser> userManager)
        {
            if (userCreditentials.Email == null)
            {
                throw new ActionResponseExceptions.BadRequestException("No email provided for the user");
            }

            if (userCreditentials.Password == null)
            {
                throw new ActionResponseExceptions.BadRequestException("No password provided for the user");
            }

            if (await userManager.FindByEmailAsync(userCreditentials.Email) != null)
            {
                throw new ActionResponseExceptions.BadRequestException("There is already an user with this email");
            }

            var user = new AppUser { UserName = userCreditentials.Email, Email = userCreditentials.Email };
            var result = await userManager.CreateAsync(user, userCreditentials.Password);

            if (!result.Succeeded)
            {
                var errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ActionResponseExceptions.BadRequestException($"Failed to create user: {errorMessage}");
            }

            result = await userManager.AddToRoleAsync(user, "user");

            if (!result.Succeeded)
            {
                var errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ActionResponseExceptions.BadRequestException($"Failed to assign role to user: {errorMessage}");
            }
        }

        public async Task<LoginTokens> LoginAsync(UserCreditentials userCreditentials, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            if (userCreditentials.Email == null)
            {
                throw new ActionResponseExceptions.BadRequestException("No email provided for the user");
            }

            if (userCreditentials.Password == null)
            {
                throw new ActionResponseExceptions.BadRequestException("No password provided for the user");
            }

            var user = await userManager.FindByEmailAsync(userCreditentials.Email);
            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User not found");
            }

            var result = await signInManager.CheckPasswordSignInAsync(user, userCreditentials.Password, false);
            if (!result.Succeeded)
            {
                throw new UnauthorizedAccessException("Wrong password");
            }

            var roles = await userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAccessToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken();
            await _tokenService.SaveRefreshTokenAsync(user.Id, refreshToken);

            return new LoginTokens(accessToken, refreshToken);
        }

        public async Task<LoginTokens> RefreshAsync(LoginTokens tokens, UserManager<AppUser> userManager, TokenService tokenService)
        {
            if (tokens.AccessToken == null || tokens.RefreshToken == null)
            {
                throw new ActionResponseExceptions.BadRequestException("Token or refresh token not provided");
            }

            var principal = tokenService.GetPrincipalFromExpiredToken(tokens.AccessToken);
            var userId = principal?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null || !await tokenService.ValidateRefreshTokenAsync(userId, tokens.AccessToken))
            {
                throw new ActionResponseExceptions.UnauthorizedAccessException("Invalid refresh token");
            }

            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
            {
                throw new ActionResponseExceptions.NotFoundException("User from token not found!");
            }
            var roles = await userManager.GetRolesAsync(user);
            var newAccessToken = tokenService.GenerateAccessToken(user, roles);
            var newRefreshToken = tokenService.GenerateRefreshToken();

            await tokenService.DeleteRefreshTokenAsync(userId, tokens.RefreshToken);
            await tokenService.SaveRefreshTokenAsync(userId, newRefreshToken);

            return new LoginTokens(newAccessToken, newRefreshToken);
        }
    }
}
