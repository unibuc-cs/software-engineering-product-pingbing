using Moq;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using CollectifyAPI.Controllers;
using CollectifyAPI.Services;
using CollectifyAPI.Models;
using CollectifyAPI.Dtos;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Security.Claims;
using System;
using CollectifyAPI.Data;

namespace CollectifyAPI.Tests
{
    public class GroupControllerTests
    {
        private readonly Mock<GroupService> _mockGroupService;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;
        private readonly GroupController _groupController;

        public GroupControllerTests()
        {
            _mockGroupService = new Mock<GroupService>(MockBehavior.Strict, null, null, null);
            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            _groupController = new GroupController(_mockGroupService.Object, _mockHttpContextAccessor.Object);
        }

        [Fact]
        public async Task CreateGroup_ValidRequest_ReturnsOk()
        {
            // Arrange
            var userId = "user123";
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            var newGroup = new Group { Id = Guid.NewGuid(), Name = "Test Group" }; 

            _mockGroupService.Setup(service => service.CreateGroupAsync(newGroup, It.IsAny<string>()))
                .ReturnsAsync(new SimpleGroup { Id = Guid.NewGuid(), Name = newGroup.Name });

            // Act
            var result = await _groupController.CreateGroup(newGroup);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result); 
            var returnValue = Assert.IsType<SimpleGroup>(okResult.Value); 
            Assert.Equal(newGroup.Name, returnValue.Name); 
        }



        [Fact]
        public async Task CreateGroup_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _groupController.ModelState.AddModelError("Name", "Required");

            // Act
            var result = await _groupController.CreateGroup(new Group());

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task UpdateGroup_GroupDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var userId = "user123";
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            var group = new Group { Id = Guid.NewGuid(), Name = "Updated Group" };
            _mockGroupService.Setup(service => service.UpdateGroupAsync(group, userId))
                .ThrowsAsync(new ActionResponseExceptions.NotFoundException("Group not found!"));

            // Act
            var result = await _groupController.UpdateGroup(group);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(404, statusCodeResult.StatusCode); 
            Assert.Equal("Group not found!", statusCodeResult.Value);
        }

        [Fact]
        public async Task UpdateGroup_NotTheOwner_ReturnsForbiddenAccess()
        {
            // Arrange
            var userId = "user123";
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            var group = new Group { Id = Guid.NewGuid(), Name = "Updated Group" };
            _mockGroupService.Setup(service => service.UpdateGroupAsync(group, userId))
                .ThrowsAsync(new ActionResponseExceptions.ForbiddenAccessException("You are not the owner of this group!"));

            // Act
            var result = await _groupController.UpdateGroup(group);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(403, statusCodeResult.StatusCode);
            Assert.Equal("You are not the owner of this group!", statusCodeResult.Value);
        }
        [Fact]
        public async Task UpdateGroup_ValidRequest_ReturnsOk()
        {
            // Arrange
            var userId = "user123";
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            var group = new Group { Id = Guid.NewGuid(), Name = "Updated Group" };
            _mockGroupService.Setup(service => service.UpdateGroupAsync(group, userId))
                .ReturnsAsync(new SimpleGroup { Id = Guid.NewGuid(), Name = group.Name });

            // Act
            var result = await _groupController.UpdateGroup(group);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<SimpleGroup>(okResult.Value);
            Assert.Equal(group.Name, returnValue.Name);
        }

        [Fact]
        public async Task DeleteGroup_ValidRequest_ReturnsOk()
        {
            // Arrange
            var groupId = Guid.NewGuid();
            var userId = "user123";
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            _mockGroupService.Setup(service => service.DeleteGroupAsync(groupId, userId))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _groupController.DeleteGroup(groupId);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task AddMemberToGroup_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var controller = new GroupController(_mockGroupService.Object, _mockHttpContextAccessor.Object);
            controller.ModelState.AddModelError("error", "Invalid data");

            // Act
            var result = await controller.AddMemberToGroup(new GroupMember());

            // Assert
            Assert.IsType<BadRequestObjectResult>(result); 
            var badRequestResult = result as BadRequestObjectResult;
            Assert.NotNull(badRequestResult);
            Assert.IsType<SerializableError>(badRequestResult.Value); 
        }

        [Fact]
        public async Task AddMemberToGroup_ValidRequest_ReturnsOk()
        {
            // Arrange
            var groupMember = new GroupMember { MemberId = "user123", GroupId = Guid.NewGuid() };

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext());  

            _mockGroupService.Setup(service => service.AddMemberToGroupAsync(groupMember))
                             .Returns(Task.CompletedTask);

            // Act
            var result = await _groupController.AddMemberToGroup(groupMember);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task GetMembersByGroupId_ValidRequest_ReturnsOk()
        {
            // Arrange
            var groupId = Guid.NewGuid();
            var userId = "user123";

            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            _mockGroupService.Setup(service => service.GetMembersByGroupIdAsync(groupId))
                .ReturnsAsync(new List<UserProfile>());

            // Act
            var result = await _groupController.GetMembersByGroupId(groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.IsType<List<UserProfile>>(okResult.Value);
        }

        [Fact]
        public async Task RemoveMemberFromGroup_ValidRequest_ReturnsOk()
        {
            // Arrange
            var groupMember = new GroupMember {MemberId = "user123", GroupId = Guid.NewGuid()};

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext());  

            _mockGroupService.Setup(service => service.RemoveMemberFromGroupAsync(groupMember))
                             .Returns(Task.CompletedTask);  

            // Act
            var result = await _groupController.RemoveMemberFromGroup(groupMember);

            // Assert
            Assert.IsType<OkResult>(result);  
        }


        [Fact]
        public async Task GetGroupById_ValidRequest_ReturnsOk()
        {
            // Arrange
            var groupId = Guid.NewGuid();
            var userId = "user123";
            var group = new Group { Id = groupId, Name = "Updated Group" };

            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            _mockGroupService.Setup(service => service.GetGroupByIdAsync(groupId, userId))
                .ReturnsAsync(new SimpleGroup { Id = Guid.NewGuid(), Name = group.Name });

            // Act
            var result = await _groupController.GetGroupById(groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<SimpleGroup>(okResult.Value);
            Assert.Equal(group.Name, returnValue.Name);
        }

        [Fact]
        public async Task GetGroupById_UnauthorizedUser_ReturnsNotFound()
        {
            // Arrange
            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns((HttpContext)null); 
            var groupId = Guid.NewGuid();

            // Act
            var result = await _groupController.GetGroupById(groupId);

            // Assert
            Assert.IsType<NotFoundResult>(result); 
        }


        [Fact]
        public async Task DeleteGroup_NotTheOwner_ReturnsForbidden()
        {
            // Arrange
            var userId = "user123";
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));
            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            var groupId = Guid.NewGuid();
            _mockGroupService.Setup(service => service.DeleteGroupAsync(groupId, userId))
                .ThrowsAsync(new ActionResponseExceptions.ForbiddenAccessException("You are not the owner of this group!"));

            // Act
            var result = await _groupController.DeleteGroup(groupId);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(403, objectResult.StatusCode);
        }

        [Fact]
        public async Task AddMemberToGroup_GroupNotFound_ReturnsNotFound()
        {
            // Arrange
            var userId = "user123";
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));
            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            var groupMember = new GroupMember { MemberId = "user456", GroupId = Guid.NewGuid() };
            _mockGroupService.Setup(service => service.AddMemberToGroupAsync(groupMember))
                .ThrowsAsync(new ActionResponseExceptions.NotFoundException("Group not found!"));

            // Act
            var result = await _groupController.AddMemberToGroup(groupMember);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(404, objectResult.StatusCode);
        }

        [Fact]
        public async Task RemoveMemberFromGroup_UnauthorizedUser_ReturnsNotFound()
        {
            // Arrange
            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns((HttpContext)null); // No user authenticated
            var groupMember = new GroupMember { MemberId = "user456", GroupId = Guid.NewGuid() };

            // Act
            var result = await _groupController.RemoveMemberFromGroup(groupMember);

            // Assert
            Assert.IsType<NotFoundResult>(result); // Update to match the actual result type
        }

        [Fact]
        public async Task GetGroupsByMemberId_ValidRequest_ReturnsOk()
        {
            // Arrange
            var userId = "user123";
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));
            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(new DefaultHttpContext { User = claimsPrincipal });

            var groups = new List<SimpleGroup>
    {
        new SimpleGroup { Id = Guid.NewGuid(), Name = "Group 1" },
        new SimpleGroup { Id = Guid.NewGuid(), Name = "Group 2" }
    };

            _mockGroupService.Setup(service => service.GetGroupsByMemberIdAsync(userId)).ReturnsAsync(groups);

            // Act
            var result = await _groupController.GetGroupsByMemberId();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.IsType<List<SimpleGroup>>(okResult.Value);
        }

    }

}
