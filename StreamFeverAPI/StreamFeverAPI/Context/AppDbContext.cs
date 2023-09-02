using Microsoft.EntityFrameworkCore;
using StreamFeverAPI.Models;

namespace StreamFeverAPI.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<Post> Posts { get; set; } 
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Group>().ToTable("groups");
            modelBuilder.Entity<Session>().ToTable("sessions");
            modelBuilder.Entity<UserGroup>().ToTable("usergroups");
            modelBuilder.Entity<UserSession>().ToTable("usersessions");
            modelBuilder.Entity<Post>().ToTable("posts");
            modelBuilder.Entity<Comment>().ToTable("comments");
        }
    }
}
