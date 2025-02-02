using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using CollectifyAPI.Dtos;
using CollectifyAPI.Models;
using Newtonsoft.Json;
using Xunit;

[Collection("SequentialTests")]
public class GroupControllerIntegrationTests : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;

    public GroupControllerIntegrationTests(IntegrationTestFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task<string> AuthenticateAsync()
    {
        var email = $"testuser-{Guid.NewGuid()}@example.com";
        var credentials = new { Email = email, Password = "Password123!" };

        // Attempt to register the user
        var registerResponse = await _client.PostAsJsonAsync("/api/account/register", credentials);
        if (registerResponse.StatusCode != HttpStatusCode.OK && registerResponse.StatusCode != HttpStatusCode.BadRequest)
        {
            var error = await registerResponse.Content.ReadAsStringAsync();
            throw new Exception($"Registration failed: {error}");
        }

        // Login to get the token
        var loginResponse = await _client.PostAsJsonAsync("/api/account/login", credentials);
        if (!loginResponse.IsSuccessStatusCode)
        {
            var error = await loginResponse.Content.ReadAsStringAsync();
            throw new Exception($"Login failed: {error}");
        }

        var loginContent = await loginResponse.Content.ReadAsStringAsync();
        var loginResult = JsonConvert.DeserializeObject<LoginTokens>(loginContent);

        return loginResult?.AccessToken ?? throw new Exception("Token generation failed");
    }

    [Fact]
    public async Task GetGroupById_ValidRequest_ReturnsGroup()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create a group
        var newGroup = new Group { Name = "Integration Test Group" };
        var createResponse = await _client.PostAsJsonAsync("/api/groups/create_group", newGroup);
        var createdGroup = await createResponse.Content.ReadFromJsonAsync<SimpleGroup>();

        // Retrieve the group by ID
        var response = await _client.GetAsync($"/api/groups/get_group?groupId={createdGroup.Id}");
        response.EnsureSuccessStatusCode();
        var retrievedGroup = await response.Content.ReadFromJsonAsync<SimpleGroup>();

        Assert.NotNull(retrievedGroup);
        Assert.Equal(createdGroup.Name, retrievedGroup.Name);
    }

    [Fact]
    public async Task UpdateGroup_ValidRequest_ReturnsUpdatedGroup()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create a group
        var newGroup = new Group { Name = "Old Group Name" };
        var createResponse = await _client.PostAsJsonAsync("/api/groups/create_group", newGroup);
        createResponse.EnsureSuccessStatusCode();

        var createdGroup = await createResponse.Content.ReadFromJsonAsync<SimpleGroup>();
        Assert.NotNull(createdGroup); // Ensure the object is not null

        // Update the group
        var updatedGroup = new Group
        {
            Id = (Guid)createdGroup!.Id, // Safe to access after Assert.NotNull
            Name = "Updated Group Name"
        };

        var updateResponse = await _client.PutAsJsonAsync("/api/groups/update_group", updatedGroup);
        updateResponse.EnsureSuccessStatusCode();

        var updated = await updateResponse.Content.ReadFromJsonAsync<SimpleGroup>();
        Assert.NotNull(updated);
        Assert.Equal("Updated Group Name", updated!.Name);
    }


    [Fact]
    public async Task DeleteGroup_ValidRequest_ReturnsOk()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var uniqueGroupName = $"TestGroup-{Guid.NewGuid()}";
        var newGroup = new Group { Name = uniqueGroupName };
        var createResponse = await _client.PostAsJsonAsync("/api/groups/create_group", newGroup);
        createResponse.EnsureSuccessStatusCode();

        var createdGroup = await createResponse.Content.ReadFromJsonAsync<SimpleGroup>();
        Assert.NotNull(createdGroup);

        var deleteResponse = await _client.DeleteAsync($"/api/groups/delete_group?groupId={createdGroup!.Id}");
        Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
    }


    [Fact]
    public async Task AddMemberToGroup_ValidRequest_ReturnsOk()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create a group
        var newGroup = new Group { Name = "Group for Member Addition" };
        var createResponse = await _client.PostAsJsonAsync("/api/groups/create_group", newGroup);
        createResponse.EnsureSuccessStatusCode();

        var createdGroup = await createResponse.Content.ReadFromJsonAsync<SimpleGroup>();
        Assert.NotNull(createdGroup);

        // Add a member to the group
        var member = new GroupMember { MemberId = "testUserId", GroupId = createdGroup!.Id };
        var response = await _client.PostAsJsonAsync("/api/groups/add_member", member);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

}
