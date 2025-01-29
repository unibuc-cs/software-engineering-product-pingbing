using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using CollectifyAPI.Controllers;
using CollectifyAPI.Models;
using CollectifyAPI.Services;
using CollectifyAPI.Dtos;
using System.Security.Claims;
using CollectifyAPI.Data;

public class UserControllerTests
{
    private readonly Mock<UserManager<AppUser>> _userManagerMock;
    private readonly Mock<SignInManager<AppUser>> _signInManagerMock;
    private readonly Mock<TokenService> _tokenServiceMock;
    private readonly Mock<AccountService> _accountServiceMock;
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
    private readonly UserController _userController;

    public UserControllerTests()
    {
        _userManagerMock = new Mock<UserManager<AppUser>>(
            new Mock<IUserStore<AppUser>>().Object,
            null, null, null, null, null, null, null, null
        );

        _signInManagerMock = new Mock<SignInManager<AppUser>>(
            _userManagerMock.Object,
            new Mock<IHttpContextAccessor>().Object,
            new Mock<IUserClaimsPrincipalFactory<AppUser>>().Object,
            null, null, null, null
        );

        _tokenServiceMock = new Mock<TokenService>(null, null);
        _accountServiceMock = new Mock<AccountService>(null, null);
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

        _userController = new UserController(
            _signInManagerMock.Object,
            _userManagerMock.Object,
            _tokenServiceMock.Object,
            _accountServiceMock.Object,
            _httpContextAccessorMock.Object
        );
    }

    [Fact]
    public async Task Register_ValidRequest_ReturnsOk()
    {
        // Arrange
        var userCreditentials = new UserCreditentials { Email = "test@example.com", Password = "Password123" };
        _accountServiceMock.Setup(service => service.RegisterAsync(userCreditentials, _userManagerMock.Object))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _userController.Register(userCreditentials);

        // Assert
        var okResult = Assert.IsType<OkResult>(result);
        Assert.Equal(200, okResult.StatusCode);
    }

    [Fact]
    public async Task Register_InvalidModelState_ReturnsBadRequest()
    {
        // Arrange
        _userController.ModelState.AddModelError("Email", "The Email field is required.");
        var userCreditentials = new UserCreditentials();

        // Act
        var result = await _userController.Register(userCreditentials);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(400, badRequestResult.StatusCode);
    }

    [Fact]
    public async Task Register_ServiceThrowsException_ReturnsInternalServerError()
    {
        // Arrange
        var userCreditentials = new UserCreditentials { Email = "test@example.com", Password = "Password123" };
        _accountServiceMock.Setup(service => service.RegisterAsync(userCreditentials, _userManagerMock.Object))
            .ThrowsAsync(new System.Exception("Unexpected error"));

        // Act
        var result = await _userController.Register(userCreditentials);

        // Assert
        var statusCodeResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, statusCodeResult.StatusCode);
        Assert.Contains("Unexpected error", statusCodeResult.Value.ToString());
    }

    [Fact]
    public async Task Login_ValidRequest_ReturnsOk()
    {
        // Arrange
        var userCreditentials = new UserCreditentials { Email = "test@example.com", Password = "Password123" };
        var tokens = new LoginTokens { AccessToken = "valid_token", RefreshToken = "refresh_token" };
        _accountServiceMock.Setup(service => service.LoginAsync(userCreditentials, _userManagerMock.Object, _signInManagerMock.Object))
            .ReturnsAsync(tokens);

        // Act
        var result = await _userController.Login(userCreditentials);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        Assert.Equal(tokens, okResult.Value);
    }
    [Fact]
    public async Task Login_InvalidModelState_ReturnsBadRequest()
    {
        // Arrange
        _userController.ModelState.AddModelError("Email", "The Email field is required.");
        var userCreditentials = new UserCreditentials();

        // Act
        var result = await _userController.Login(userCreditentials);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(400, badRequestResult.StatusCode);
    }

    [Fact]
    public async Task Refresh_ValidRequest_ReturnsOk()
    {
        // Arrange
        var tokens = new LoginTokens { AccessToken = "valid_token", RefreshToken = "refresh_token" };
        _accountServiceMock.Setup(service => service.RefreshAsync(tokens, _userManagerMock.Object, _tokenServiceMock.Object))
            .ReturnsAsync(tokens);

        // Act
        var result = await _userController.Refresh(tokens);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        Assert.Equal(tokens, okResult.Value);
    }

    [Fact]
    public async Task GetProfile_UserAuthenticated_ReturnsOk()
    {
        // Arrange
        var userId = "user123";
        var userProfile = new UserProfile { Nickname = "TestUser" };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));
        _httpContextAccessorMock.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });
        _accountServiceMock.Setup(service => service.GetUserProfileAsync(_userManagerMock.Object, userId))
            .ReturnsAsync(userProfile);

        // Act
        var result = await _userController.GetProfile();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        Assert.Equal(userProfile, okResult.Value);
    }

    [Fact]
    public async Task GetProfile_UserDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var userId = "user123";
        var userProfile = new UserProfile { Nickname = "TestUser" };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));
        _httpContextAccessorMock.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });
        _accountServiceMock.Setup(service => service.GetUserProfileAsync(_userManagerMock.Object, userId))
            .ThrowsAsync(new ActionResponseExceptions.NotFoundException("User from token not found!"));

        // Act
        var result = await _userController.GetProfile();

        // Assert
        var statusCodeResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(404, statusCodeResult.StatusCode);
        Assert.Equal("User from token not found!", statusCodeResult.Value);
    }

    [Fact]
    public async Task EditProfile_ValidRequest_ReturnsOk()
    {
        // Arrange
        var userId = "user123";
        var userProfile = new UserProfile { Nickname = "UpdatedUser" };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));
        _httpContextAccessorMock.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });
        _accountServiceMock.Setup(service => service.EditUserProfileAsync(_userManagerMock.Object, userId, userProfile, null))
            .ReturnsAsync(userProfile);

        // Act
        var result = await _userController.EditProfile(userProfile, null);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        Assert.Equal(userProfile, okResult.Value);
    }

    [Fact]
    public async Task EditProfile_NullUser_ReturnsBadRequest()
    {
        // Arrange
        var userProfile = new UserProfile { Nickname = "UpdatedUser" };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());
        _httpContextAccessorMock.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

        // Act
        var result = await _userController.EditProfile(userProfile, null);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);  
        Assert.Equal("No user id provided", badRequestResult.Value);
    }

}
