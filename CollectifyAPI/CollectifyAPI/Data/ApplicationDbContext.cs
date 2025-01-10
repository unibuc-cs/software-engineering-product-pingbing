using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CollectifyAPI.Models;

namespace CollectifyAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        private readonly IConfiguration _configuration;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<NotesGroup> NotesGroups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<UserRefreshToken> UserRefreshTokens { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Database seeding
            DataSeeder.Seed(builder, _configuration);

            // RefreshToken
            builder.Entity<UserRefreshToken>()
                .HasKey(t => t.Id);

            // User 1-M Note
            builder.Entity<AppUser>()
                .HasMany(u => u.Notes)
                .WithOne(n => n.Creator)
                .HasForeignKey(n => n.CreatorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Group 1-M Note
            builder.Entity<NotesGroup>()
                .HasMany(g => g.Notes)
                .WithOne(n => n.Group)
                .HasForeignKey(n => n.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            // User 1-M Group
            builder.Entity<AppUser>()
                .HasMany(u => u.OwnedGroups)
                .WithOne(g => g.Creator)
                .HasForeignKey(g => g.CreatorId)
                .OnDelete(DeleteBehavior.SetNull);

            // GroupMembers PK
            builder.Entity<GroupMember>()
                .HasKey(gm => new { gm.MemberId, gm.GroupId });

            // User 1-M GroupMembers M-1 Group (User M-M Group)
            builder.Entity<GroupMember>()
                .HasOne(gm => gm.Member)
                .WithMany(u => u.MemberGroups)
                .HasForeignKey(gm => gm.MemberId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<GroupMember>()
                .HasOne(gm => gm.Group)
                .WithMany(g => g.Members)
                .HasForeignKey(gm => gm.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
