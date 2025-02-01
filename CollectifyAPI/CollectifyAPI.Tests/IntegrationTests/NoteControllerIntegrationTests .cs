using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using CollectifyAPI.Dtos;
using CollectifyAPI.Models;
using Newtonsoft.Json;
using Xunit;


[Collection("SequentialTests")]

public class NoteControllerIntegrationTests : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;

    public NoteControllerIntegrationTests(IntegrationTestFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task<string> AuthenticateAsync()
    {

        var email = $"testuser-{Guid.NewGuid()}@example.com";
        var credentials = new { Email = email, Password = "Password123!" };


        // Attempt to register the user
        var registerResponse = await _client.PostAsJsonAsync("/api/account/register", credentials);
        if (!registerResponse.IsSuccessStatusCode && registerResponse.StatusCode != HttpStatusCode.BadRequest)
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
    public async Task UpdateNote_ValidRequest_ReturnsUpdatedNote()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var newNote = new SimpleNote { Title = "Old Title", Content = "Old Content" };
        var createResponse = await _client.PostAsJsonAsync("/api/notes/add_note", newNote);
        var createdNote = await createResponse.Content.ReadFromJsonAsync<SimpleNote>();

        var updatedNote = new SimpleNote { Id = createdNote.Id, Title = "Updated Title", Content = "Updated Content" };
        var updateResponse = await _client.PutAsJsonAsync("/api/notes/update_note", updatedNote);

        updateResponse.EnsureSuccessStatusCode();
        var returnedNote = await updateResponse.Content.ReadFromJsonAsync<SimpleNote>();

        Assert.Equal("Updated Title", returnedNote.Title);
    }

    [Fact]
    public async Task DeleteNote_ValidRequest_ReturnsOk()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var newNote = new SimpleNote { Title = "Test Note", Content = "Test Content" };
        var createResponse = await _client.PostAsJsonAsync("/api/notes/add_note", newNote);
        createResponse.EnsureSuccessStatusCode();

        var createdNote = await createResponse.Content.ReadFromJsonAsync<SimpleNote>();
        Assert.NotNull(createdNote);

        var deleteResponse = await _client.DeleteAsync($"/api/notes/delete_note?noteId={createdNote!.Id}");
        Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
    }


    [Fact]
    public async Task GetOwnedNotes_ReturnsNotes()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        await _client.PostAsJsonAsync("/api/notes/add_note", new SimpleNote { Title = "Test Note 1", Content = "Content 1" });
        await _client.PostAsJsonAsync("/api/notes/add_note", new SimpleNote { Title = "Test Note 2", Content = "Content 2" });

        var response = await _client.GetAsync("/api/notes/owned_notes");
        response.EnsureSuccessStatusCode();
        var notes = await response.Content.ReadFromJsonAsync<List<SimpleNote>>();

        Assert.NotEmpty(notes);
        Assert.True(notes.Count >= 2);
    }
}
