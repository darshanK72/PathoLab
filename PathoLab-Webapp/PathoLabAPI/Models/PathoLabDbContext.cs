using Microsoft.EntityFrameworkCore;

namespace PathoLabAPI.Models
{
    public class PathoLabDbContext : DbContext
    {
        public PathoLabDbContext(DbContextOptions<PathoLabDbContext> options)
            : base(options)
        {
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<TestsMaster> TestsMaster { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Setting> Settings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Setting>().HasKey(s => s.Key);
        }
    }
}
