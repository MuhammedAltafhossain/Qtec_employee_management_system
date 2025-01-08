using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using qtec_api.Models;

public class AppDbContext:DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<PerformanceReview> PerformanceReviews { get; set; }


    public async Task AddEmployeeAsync(string name,string phone,DateTime joiningDate,string email,string position,int departmentId)

    {
        var parameters = new[]
         {
            new SqlParameter("@Name", name),
            new SqlParameter("@Phone", phone),
            new SqlParameter("@JoiningDate", joiningDate),
            new SqlParameter("@Email", email),
            new SqlParameter("@Position", position),
            new SqlParameter("@DepartmentId", departmentId),
        };

        await Database.ExecuteSqlRawAsync("EXEC AddEmployee @Name, @Phone, @JoiningDate, @Email, @Position, @DepartmentId",parameters);
    }
    public async Task UpdateEmployeeAsync(int id,string name,string phone,DateTime joiningDate,string email,string position,int departmentId)

    {
        var parameters = new[]
         {
            new SqlParameter("@id", id),
            new SqlParameter("@Name", name),
            new SqlParameter("@Phone", phone),
            new SqlParameter("@JoiningDate", joiningDate),
            new SqlParameter("@Email", email),
            new SqlParameter("@Position", position),
            new SqlParameter("@DepartmentId", departmentId),

        };

        await Database.ExecuteSqlRawAsync("EXEC UpdateEmployee @id, @Name, @Phone, @JoiningDate, @Email, @Position, @DepartmentId",parameters);
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Department>( )
                .HasOne(d => d.Manager)
                .WithOne( )
                .HasForeignKey<Department>(d => d.ManagerId)
                .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>( )
            .HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DepartmentId);

        modelBuilder.Entity<PerformanceReview>( )
            .HasOne(pr => pr.Employee)
            .WithMany(e => e.PerformanceReviews)
            .HasForeignKey(pr => pr.EmployeeId);

        // Indexes
        modelBuilder.Entity<Employee>( ).HasIndex(e => e.Name);
        modelBuilder.Entity<Employee>( ).HasIndex(e => e.Position);
        modelBuilder.Entity<Department>( ).HasIndex(e => e.DepartmentName);
        modelBuilder.Entity<PerformanceReview>( ).HasIndex(pr => pr.ReviewScore);
    }

}