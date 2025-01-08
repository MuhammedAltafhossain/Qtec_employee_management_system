using AutoMapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using qtec_api.ModelDto;
using qtec_api.Models.ViewModel;

namespace qtec_api.Services {
    public class EmployeeService {
        private readonly AppDbContext _context;
        public EmployeeService(AppDbContext context)
        {
            _context = context;

        }


        public async Task AddEmployeeAsync(string name,string phone,DateTime joiningDate,string email,string position,int departmentId)
        {
            await _context.AddEmployeeAsync(name,phone,joiningDate,email,position,departmentId);
        }
        public async Task UpdateEmployeeAsync(int id,string name,string phone,DateTime joiningDate,string email,string position,int departmentId)
        {
            await _context.UpdateEmployeeAsync(id,name,phone,joiningDate,email,position,departmentId);
        }


        public async Task<List<EmployeeViewModel>> SearchEmployee(
        string? name,
        int? departmentId,
        string? position,
        int? minScore,
        int? maxScore,
        int page = 1,
        int pageSize = 10)
        {
            // SQL query for the stored procedure
            var sql = @"
        EXEC dbo.SearchEmployees 
            @Name, 
            @DepartmentId, 
            @Position, 
            @MinScore, 
            @MaxScore, 
            @Page, 
            @PageSize";

            // Parameters for the stored procedure
            var parameters = new[]
            {
                new SqlParameter("@Name", name ?? (object)DBNull.Value),
                new SqlParameter("@DepartmentId", departmentId ?? (object)DBNull.Value),
                new SqlParameter("@Position", position ?? (object)DBNull.Value),
                new SqlParameter("@MinScore", minScore ?? (object)DBNull.Value),
                new SqlParameter("@MaxScore", maxScore ?? (object)DBNull.Value),
                new SqlParameter("@Page", page),
                new SqlParameter("@PageSize", pageSize),
            };

            // Execute the raw SQL query and map results manually
            using var connection = _context.Database.GetDbConnection( );
            await connection.OpenAsync( );


            using var command = connection.CreateCommand( );
            command.CommandText = sql;
            command.Parameters.AddRange(parameters);

            var employees = new List<EmployeeViewModel>( );
            using var reader = await command.ExecuteReaderAsync( );
            while (await reader.ReadAsync( ))
            {
                employees.Add(new EmployeeViewModel
                {
                    id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Name = reader.GetString(reader.GetOrdinal("Name")),
                    Email = reader.GetString(reader.GetOrdinal("Email")),
                    Position = reader.GetString(reader.GetOrdinal("Position")),
                    Phone = reader.GetString(reader.GetOrdinal("Phone")),
                    DepartmentName = reader.GetString(reader.GetOrdinal("DepartmentName")),
                    DepartmentId = reader.GetInt32(reader.GetOrdinal("departmentId")),
                    Budget = reader.GetDecimal(reader.GetOrdinal("Budget")),
                    PerformanceScore = reader.GetInt32(reader.GetOrdinal("PerformanceScore")),
                });
            }

            return employees;
        }


    }
}
