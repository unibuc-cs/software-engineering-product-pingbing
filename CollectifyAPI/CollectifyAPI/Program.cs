using System.Text.Json.Serialization;
using CollectifyAPI.Data;
using CollectifyAPI.Services;
using CollectifyAPI.Repositories;
using Microsoft.Extensions.FileProviders;
using CollectifyAPI.Controllers;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Services configuration
builder.Services.ConfigureSwagger();
builder.Services.ConfigureIdentity();
builder.Services.ConfigureJwtAuthentication(builder.Configuration);
builder.Services.ConfigureDatabase(builder.Configuration);

// Add services
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<NoteService>();
builder.Services.AddScoped<GroupService>();
// Add repositories
builder.Services.AddScoped<TokenRepository>();
builder.Services.AddScoped<NoteRepository>();
builder.Services.AddScoped<GroupRepository>();

// AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var staticFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "static");
if (!Directory.Exists(staticFilesPath))
{
    Directory.CreateDirectory(staticFilesPath);
}
if (!Directory.Exists(Path.Combine(staticFilesPath, "avatars")))
{
    Directory.CreateDirectory(Path.Combine(staticFilesPath, "avatars"));
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(staticFilesPath)),
    RequestPath = "/static"
});

//app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
