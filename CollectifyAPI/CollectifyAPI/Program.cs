using System.Text.Json.Serialization;
using CollectifyAPI.Data;
using CollectifyAPI.Services;
using CollectifyAPI.Repositories;



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
// Add repositories
builder.Services.AddScoped<TokenRepository>();

var app = builder.Build();

// Configurare middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
