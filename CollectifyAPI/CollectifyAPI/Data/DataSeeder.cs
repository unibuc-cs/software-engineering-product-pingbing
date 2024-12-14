using CollectifyAPI.Data;
using CollectifyAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public static class DataSeeder
{
    public static void Seed(ModelBuilder builder, IConfiguration configuration)
    {
        var adminRole = new IdentityRole
        {
            Name = "admin",
            NormalizedName = "ADMIN"
        };

        var userRole = new IdentityRole
        {
            Name = "user",
            NormalizedName = "USER"
        };

        builder.Entity<IdentityRole>().HasData(adminRole, userRole);

        var adminUser = new AppUser
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "admin",
            NormalizedUserName = "ADMIN",
            Email = configuration["Seeding:AdminEmail"]!,
            NormalizedEmail = configuration["Seeding:AdminEmail"]!.ToUpper(),
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString("D"),
            PasswordHash = new PasswordHasher<AppUser>().HashPassword(null!, configuration["Seeding:AdminPassword"]!)
        };

        builder.Entity<AppUser>().HasData(adminUser);

        // Associate the admin user with the admin role
        var adminUserRole = new IdentityUserRole<string>
        {
            UserId = adminUser.Id,
            RoleId = adminRole.Id
        };

        builder.Entity<IdentityUserRole<string>>().HasData(adminUserRole);
    }
}
