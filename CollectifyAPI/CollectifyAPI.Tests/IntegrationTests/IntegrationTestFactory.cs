using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CollectifyAPI.Data;
using CollectifyAPI.Models;
using System;
using System.Linq;

public class IntegrationTestFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove existing database configuration
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Add an in-memory database for testing
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("TestDb"));

            // Rebuild the service provider
            var provider = services.BuildServiceProvider();

            // Initialize the database
            using (var scope = provider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                dbContext.Database.EnsureDeleted();
                dbContext.Database.EnsureCreated();

                // Seed initial data
                SeedTestData(dbContext);
            }
        });
    }

    private void SeedTestData(ApplicationDbContext dbContext)
    {
        // Add test users, avoiding duplicates
        if (!dbContext.Users.Any(u => u.Id == "testUserId"))
        {
            dbContext.Users.Add(new AppUser
            {
                Id = "testUserId",
                Email = "testuser@example.com",
                UserName = "testuser@example.com"
            });
        }

        if (!dbContext.Users.Any(u => u.Id == "testUserId2"))
        {
            dbContext.Users.Add(new AppUser
            {
                Id = "testUserId2",
                Email = "testuser2@example.com",
                UserName = "testuser2@example.com"
            });
        }
        if (!dbContext.Users.Any(u => u.Id == "testUserId3"))
        {
            dbContext.Users.Add(new AppUser
            {
                Id = "testUserId3",
                Email = "testuser3@example.com",
                UserName = "testuser3@example.com"
            });
        }

        dbContext.SaveChanges();
    }

}
