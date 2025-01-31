using System.Net;
using System.Net.Http.Json;
using System.Text;
using CollectifyAPI.Dtos;
using CollectifyAPI.Models;
using Newtonsoft.Json;
using Xunit;

public class NoteControllerIntegrationTests : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;

    public NoteControllerIntegrationTests(IntegrationTestFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task<string> AuthenticateAsync()
    {
        var credentials = new { Email = "testuser@example.com", Password = "Password123!" };
        var registerResponse = await _client.PostAsJsonAsync("/api/account/register", credentials);
        if (registerResponse.StatusCode != HttpStatusCode.OK) return string.Empty;

        var loginResponse = await _client.PostAsJsonAsync("/api/account/login", credentials);
        var loginContent = await loginResponse.Content.ReadAsStringAsync();
        var loginResult = JsonConvert.DeserializeObject<LoginTokens>(loginContent);

        return loginResult?.AccessToken ?? string.Empty;
    }

    [Fact]
    public async Task CreateNote_ValidRequest_ReturnsCreatedNote()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var newNote = new SimpleNote { Title = "Integration Test Note", Content = "Test Content" };
        var response = await _client.PostAsJsonAsync("/api/notes/add_note", newNote);

        response.EnsureSuccessStatusCode();
        var createdNote = await response.Content.ReadFromJsonAsync<SimpleNote>();

        Assert.NotNull(createdNote);
        Assert.Equal("Integration Test Note", createdNote.Title);
    }

    [Fact]
    public async Task GetNote_ValidId_ReturnsNote()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var newNote = new SimpleNote { Title = "Integration Test Note", Content = "Test Content" };
        var createResponse = await _client.PostAsJsonAsync("/api/notes/add_note", newNote);
        var createdNote = await createResponse.Content.ReadFromJsonAsync<SimpleNote>();

        var response = await _client.GetAsync($"/api/notes/get_note?noteId={createdNote.Id}");
        response.EnsureSuccessStatusCode();
        var retrievedNote = await response.Content.ReadFromJsonAsync<SimpleNote>();

        Assert.NotNull(retrievedNote);
        Assert.Equal(createdNote.Title, retrievedNote.Title);
    }

    [Fact]
    public async Task UpdateNote_ValidRequest_ReturnsUpdatedNote()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

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
    public async Task DeleteNote_ValidId_ReturnsOk()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var newNote = new SimpleNote { Title = "Delete Me", Content = "Test Content" };
        var createResponse = await _client.PostAsJsonAsync("/api/notes/add_note", newNote);
        var createdNote = await createResponse.Content.ReadFromJsonAsync<SimpleNote>();

        var deleteResponse = await _client.DeleteAsync($"/api/notes/delete_note?noteId={createdNote.Id}");

        Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task GetOwnedNotes_ReturnsNotes()
    {
        var token = await AuthenticateAsync();
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        await _client.PostAsJsonAsync("/api/notes/add_note", new SimpleNote { Title = "Test Note 1", Content = "Content 1" });
        await _client.PostAsJsonAsync("/api/notes/add_note", new SimpleNote { Title = "Test Note 2", Content = "Content 2" });

        var response = await _client.GetAsync("/api/notes/owned_notes");
        response.EnsureSuccessStatusCode();
        var notes = await response.Content.ReadFromJsonAsync<List<SimpleNote>>();

        Assert.NotEmpty(notes);
        Assert.True(notes.Count >= 2);
    }
}
